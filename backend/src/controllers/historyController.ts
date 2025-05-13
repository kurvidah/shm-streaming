import type { Request, Response } from "express";
import pool from "../db";
import jwt from "jsonwebtoken";

// @desc    Get user's own watch history with media info
// @route   GET /api/v1/watch-history
// @access  Private
export const getWatchHistory = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            if (!token) {
                res.status(401).json({ error: "Not authorized, no token" });
                return;
            }

            // Verify token
            const self: any = jwt.verify(token, process.env.SECRET_KEY || "your_jwt_secret");

            const query = `
                SELECT
                    wh.user_id,
                    wh.media_id,
                    wh.watched_at,
                    wh.watch_duration,
                    me.episode,
                    me.season,
                    me.description,
                    m.title,
                    m.poster
                FROM watch_history wh
                JOIN media me ON wh.media_id = me.media_id
                JOIN movies m ON me.movie_id = m.movie_id
                WHERE wh.user_id = ?
                ORDER BY wh.watched_at DESC
            `;

            const [rows] = await pool.query(query, [self.id]);

            if (!Array.isArray(rows)) {
                res.status(404).json({ error: "No watch history found" });
                return;
            }

            res.status(200).json({ count: rows.length, rows });
            return;
        }

        res.status(401).json({ error: "Not authorized, invalid token format" });
    } catch (error) {
        console.error("Get watch history error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
