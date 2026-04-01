import { Router, Response } from "express";
import { pool } from "../db";
import { requireAuth, AuthRequest } from "../auth";

const router = Router();

// GET /api/bucket-list
router.get("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const result = await pool.query(
      `SELECT bl.id, bl.place_id, p.name, p.description, p.location
       FROM bucket_list bl
       INNER JOIN places p ON p.id = bl.place_id
       WHERE bl.user_id = $1`,
      [userId]
    );
    res.status(200).json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// POST /api/bucket-list
router.post("/", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { placeId } = req.body as { placeId: number };

    const existing = await pool.query(
      `SELECT id FROM bucket_list WHERE user_id = $1 AND place_id = $2`,
      [userId, placeId]
    );
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Place already in bucket list" });
    }

    const newItem = await pool.query(
      `INSERT INTO bucket_list (user_id, place_id) VALUES ($1, $2) RETURNING *`,
      [userId, placeId]
    );
    res.status(201).json(newItem.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

// DELETE /api/bucket-list/:placeId
router.delete("/:placeId", requireAuth, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const placeId = Number(req.params.placeId);

    const existing = await pool.query(
      `SELECT id FROM bucket_list WHERE user_id = $1 AND place_id = $2`,
      [userId, placeId]
    );
    if (existing.rows.length === 0) {
      return res.status(404).json({ error: "Item not found in bucket list" });
    }

    await pool.query(
      `DELETE FROM bucket_list WHERE user_id = $1 AND place_id = $2`,
      [userId, placeId]
    );
    res.status(200).json({ message: "Removed from bucket list" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
});

export default router;