import type { Request, Response } from "express";
import pool from "../db";
import jwt from "jsonwebtoken";

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @access  Public
export const getReviews = async (req: Request, res: Response): Promise<void> => {
    try {
        const { movie_id, media_id } = req.query;

        let query = `SELECT r.* , users.username  FROM reviews r
            JOIN users ON r.user_id = users.user_id
        `;
        const queryParams: any[] = [];

        if (movie_id) {
            query += " WHERE movie_id = ?";
            queryParams.push(movie_id);
        } else if (media_id) {
            query += " WHERE media_id = ?";
            queryParams.push(media_id);
        } else {
            res.status(400).json({ error: "Must provide either movie_id or media_id" });
            return;
        }

        // Get reviews
        const [reviewRows] = await pool.execute(query, queryParams);

        if (!Array.isArray(reviewRows) || reviewRows.length === 0) {
            res.status(404).json({ error: "No reviews found" });
            return;
        }

        const reviewCount = reviewRows.length;
        res.json({ count: reviewCount, rows: reviewRows });
    } catch (error) {
        console.error("Get reviews error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Create a review
// @route   POST /api/v1/reviews
// @access  Public
export const createReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            // Verify token
            const self: any = jwt.verify(
                token || "your_token",
                process.env.SECRET_KEY || "your_jwt_secret"
            );

            const user_id = self.id; // Extract user_id from the token
            const {
                movie_id,
                media_id,
                rating,
                review_text
            } = req.body;

            if (!review_text || typeof review_text !== "string" || review_text.trim() === "") {
                res.status(400).json({ error: "Review Text is required" });
                return;
            }

            const [result] = await pool.execute(
                `INSERT INTO reviews (user_id, movie_id, media_id, rating, review_text)
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    user_id,
                    movie_id,
                    media_id,
                    rating,
                    review_text,
                ]
            );

            const insertResult = result as any;
            const reviewId = insertResult.insertId;

            if (!reviewId) {
                res.status(400).json({ error: "Failed to create review" });
                return;
            }

            const [rows] = await pool.execute("SELECT * FROM reviews WHERE review_id = ?", [reviewId]);

            if (!Array.isArray(rows) || rows.length === 0) {
                res.status(404).json({ error: "Review not found after creation" });
                return;
            }

            const review = rows[0] as any;

            res.status(201).json(review);
        } else {
            res.status(401).json({ error: "Unauthorized: No token provided" });
        }
    } catch (error) {
        console.error("Create review error:", error);
        res.status(500).json({ error: "Server error" });
    }
};