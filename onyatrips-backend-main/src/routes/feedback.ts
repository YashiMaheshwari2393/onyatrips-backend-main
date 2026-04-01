import { Router, Response, Request } from "express";
import { pool } from "../db";
import { requireAuth, AuthRequest } from "../auth";
import { isFeedbackTargetType, isValidRating, normalizeComment, FeedbackTargetType } from "./feedbackHelpers";

const router = Router();

async function targetExists(targetId: string, targetType: FeedbackTargetType): Promise<boolean> {
  const query = targetType === "place" ? `SELECT id FROM places WHERE id = $1` : `SELECT id FROM groups WHERE id = $1`;
  const result = await pool.query(query, [targetId]);
  return (result.rowCount ?? 0) > 0;
}

router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { targetId, targetType, rating, comment } = req.body as {
      targetId: string;
      targetType: unknown;
      rating: unknown;
      comment?: unknown;
    };

    if (!targetId || typeof targetId !== "string") {
      return res.status(400).json({ error: "target_id is required and must be a string" });
    }

    if (!isFeedbackTargetType(targetType)) {
      return res.status(400).json({ error: "target_type must be either 'place' or 'group'" });
    }

    if (!isValidRating(rating)) {
      return res.status(400).json({ error: "rating must be an integer between 1 and 5" });
    }

    if (!(await targetExists(targetId, targetType))) {
      return res.status(404).json({ error: `${targetType} not found` });
    }

    const duplicateCheck = await pool.query(
      `SELECT id FROM reviews WHERE user_id = $1 AND target_id = $2 AND target_type = $3`,
      [userId, targetId, targetType]
    );

    if ((duplicateCheck.rowCount ?? 0) > 0) {
      return res.status(409).json({ error: "You have already reviewed this target" });
    }

    const normalizedComment = normalizeComment(comment);

    const insertResult = await pool.query(
      `INSERT INTO reviews (target_id, target_type, user_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, target_id, target_type, user_id, rating, comment, created_at`,
      [targetId, targetType, userId, rating, normalizedComment]
    );

    return res.status(201).json(insertResult.rows[0]);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

router.get("/:targetId", async (req: Request, res: Response) => {
  try {
    const targetId = req.params.targetId;
    const targetType = req.query.type;

    if (!targetId) {
      return res.status(400).json({ error: "targetId is required" });
    }

    if (!isFeedbackTargetType(targetType)) {
      return res.status(400).json({ error: "Query param 'type' must be either 'place' or 'group'" });
    }

    const reviewRows = await pool.query(
      `SELECT r.id,
              r.rating,
              r.comment,
              r.created_at,
              p.full_name AS reviewer_name,
              p.avatar_url AS reviewer_avatar
       FROM reviews r
       JOIN profiles p ON p.id = r.user_id
       WHERE r.target_id = $1 AND r.target_type = $2
       ORDER BY r.created_at DESC`,
      [targetId, targetType]
    );

    const aggregateResult = await pool.query(
      `SELECT COUNT(*) AS total_reviews,
              COALESCE(AVG(rating), 0)::numeric(10,2) AS average_rating
       FROM reviews
       WHERE target_id = $1 AND target_type = $2`,
      [targetId, targetType]
    );

    return res.status(200).json({
      targetId,
      targetType,
      averageRating: Number(aggregateResult.rows[0].average_rating),
      totalReviews: Number(aggregateResult.rows[0].total_reviews),
      reviews: reviewRows.rows,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default router;
