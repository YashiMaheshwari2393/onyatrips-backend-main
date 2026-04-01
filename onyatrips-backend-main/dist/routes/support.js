"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const db_1 = require("../db");
const auth_1 = require("../auth");
const router = (0, express_1.Router)();
router.post("/tickets", auth_1.requireAuth, async (req, res) => {
    try {
        const userId = String(req.user.id);
        const { subject, description, category } = req.body;
        if (!subject || typeof subject !== "string" || subject.trim().length === 0) {
            return res.status(400).json({ error: "subject is required" });
        }
        if (!description || typeof description !== "string" || description.trim().length === 0) {
            return res.status(400).json({ error: "description is required" });
        }
        const categoryValue = typeof category === "string" && category.trim().length > 0 ? category.trim() : null;
        const insertResult = await db_1.pool.query(`INSERT INTO support_tickets (user_id, subject, description, category)
       VALUES ($1, $2, $3, $4)
       RETURNING id, user_id, subject, description, category, status, created_at`, [userId, subject.trim(), description.trim(), categoryValue]);
        return res.status(201).json(insertResult.rows[0]);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
router.get("/tickets", auth_1.requireAuth, async (req, res) => {
    try {
        const userId = String(req.user.id);
        const ticketsResult = await db_1.pool.query(`SELECT id, subject, description, category, status, created_at
       FROM support_tickets
       WHERE user_id = $1
       ORDER BY created_at DESC`, [userId]);
        return res.status(200).json({ tickets: ticketsResult.rows });
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
router.post("/tickets/:id/reply", auth_1.requireAuth, async (req, res) => {
    try {
        const userId = String(req.user.id);
        const ticketId = req.params.id;
        const { message } = req.body;
        if (!message || typeof message !== "string" || message.trim().length === 0) {
            return res.status(400).json({ error: "message is required" });
        }
        const ticketResult = await db_1.pool.query(`SELECT id FROM support_tickets WHERE id = $1 AND user_id = $2`, [ticketId, userId]);
        if ((ticketResult.rowCount ?? 0) === 0) {
            return res.status(404).json({ error: "Ticket not found" });
        }
        const replyResult = await db_1.pool.query(`INSERT INTO support_messages (ticket_id, sender_id, message)
       VALUES ($1, $2, $3)
       RETURNING id, ticket_id, sender_id, message, created_at`, [ticketId, userId, message.trim()]);
        return res.status(201).json(replyResult.rows[0]);
    }
    catch (err) {
        console.error(err);
        return res.status(500).json({ error: "Internal server error" });
    }
});
exports.default = router;
