import type { Request, Response } from "express";
import pool from "../db";
import jwt from "jsonwebtoken"

// @desc    Get user's own watch history
// @route   GET /api/v1/watch-history
// @access  Private
export const getWatchHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            // Verify token
            const self: any = jwt.verify(token || "your_token", process.env.SECRET_KEY || "your_jwt_secret");
            const query = `
                SELECT * FROM watch_history
                WHERE user_id = ?
                ORDER BY timestamp DESC
            `;
            
            const [rows]  = await pool.query(query, [self.id]);

            if (!Array.isArray(rows)) {
                res.status(404).json({ error: "No watch history found" });
                return;
            }

            res.status(200).json({ count: rows.length, rows });
        }

        if (!token) {
            res.status(401).json({ error: "Not authorized, no token" });
        }
    } catch (error) {
        console.error("Get watch history error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
