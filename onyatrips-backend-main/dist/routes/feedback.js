"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const auth_1 = require("../auth");
const feedbackHelpers_1 = require("./feedbackHelpers");
const router = (0, express_1.Router)();
async function targetExists(targetId, targetType) {
    const query = targetType === "place" ? `SELECT id FROM places WHERE id = $1` : `SELECT id FROM groups WHERE id = $1`;
    const result = await db_1.pool.query(query, [targetId]);
    return (result.rowCount ?? 0) > 0;
}
router.post("/", auth_1.requireAuth, async (req, res) => {
    try {
        const userId = req.user.id;
        const { targetId, targetType, rating, comment } = req.body;
        if (!targetId || typeof targetId !== "string") {
            return res.status(400).json({ error: "target_id is required and must be a string" });
        }
        if (!(0, feedbackHelpers_1.isFeedbackTargetType)(targetType)) {
            return res.status(400).json({ error: "target_type must be either 'place' or 'group'" });
        }
        if (!(0, feedbackHelpers_1.isValidRating)(rating)) {
            return res.status(400).json({ error: "rating must be an integer between 1 and 5" });
        }
        if (!(await targetExists(targetId, targetType))) {
            return res.status(404).json({ error: `${targetType} not found` });
        }
        const duplicateCheck = await db_1.pool.query(`SELECT id FROM reviews WHERE user_id = $1 AND target_id = $2 AND target_type = $3`, [userId, targetId, targetType]);
        if ((duplicateCheck.rowCount ?? 0) > 0) {
            return res.status(409).json({ error: "You have already reviewed this target" });
        }
        const normalizedComment = (0, feedbackHelpers_1.normalizeComment)(comment);
        const insertResult = await db_1.pool.query(`INSERT INTO reviews (target_id, target_type, user_id, rating, comment)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, target_id, target_type, user_id, rating, comment, created_at`, [targetId, targetType, userId, rating, normalizedComment]);
        return res.status(201).json(insertResult.rows[0]);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
router.get("/:targetId", async (req, res) => {
    try {
        const targetId = req.params.targetId;
        const targetType = req.query.type;
        if (!targetId) {
            return res.status(400).json({ error: "targetId is required" });
        }
        if (!(0, feedbackHelpers_1.isFeedbackTargetType)(targetType)) {
            return res.status(400).json({ error: "Query param 'type' must be either 'place' or 'group'" });
        }
        const reviewRows = await db_1.pool.query(`SELECT r.id,
              r.rating,
              r.comment,
              r.created_at,
              p.full_name AS reviewer_name,
              p.avatar_url AS reviewer_avatar
       FROM reviews r
       JOIN profiles p ON p.id = r.user_id
       WHERE r.target_id = $1 AND r.target_type = $2
       ORDER BY r.created_at DESC`, [targetId, targetType]);
        const aggregateResult = await db_1.pool.query(`SELECT COUNT(*) AS total_reviews,
              COALESCE(AVG(rating), 0)::numeric(10,2) AS average_rating
       FROM reviews
       WHERE target_id = $1 AND target_type = $2`, [targetId, targetType]);
        return res.status(200).json({
            targetId,
            targetType,
            averageRating: Number(aggregateResult.rows[0].average_rating),
            totalReviews: Number(aggregateResult.rows[0].total_reviews),
            reviews: reviewRows.rows,
        });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = router;
