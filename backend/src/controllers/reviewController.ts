import type { Request, Response } from "express";
import pool from "../db";

// @desc    Get all reviews
// @route   GET /api/v1/reviews
// @access  Public

export const getReview = async (req: Request, res: Response): Promise<void> => {
    try {

        let query;

        query = "SELECT * FROM reviews";

        // Get subscription plan
        const [reviewRows] = await pool.execute(query);

        if (!Array.isArray(reviewRows) || reviewRows.length === 0) {
            res.status(404).json({ error: "Reviews list empty" });
            return;
        }

        res.json(reviewRows);
    } catch (error) {
        console.error("Get review error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Get review by ID
// @route   GET /api/v1/reviews/:id
// @access  Public

export const getReviewById = async (req: Request, res: Response): Promise<void> => {
    try {

        let query;
        let queryParams;

        query = "SELECT * FROM reviews WHERE review_id = ?";
        queryParams = [req.params.id];

        // Get review
        const [reviewRows] = await pool.execute(query, queryParams);

        if (!Array.isArray(reviewRows) || reviewRows.length === 0) {
            res.status(404).json({ error: "Review not found" });
            return;
        }

        const review = reviewRows[0] as any;

        res.json(review);
    } catch (error) {
        console.error("Get review error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Create a reviews
// @route   POST /api/v1/reviews
// @access  Public
export const createReview = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            user_id,
            movie_id,
            media_id,
            rating,
            review_text,
            review_date,
        } = req.body;

        if (!review_text || typeof review_text !== "string" || review_text.trim() === "") {
            res.status(400).json({ error: "Review Text is required" });
            return;
        }

        const [result] = await pool.execute(
            `INSERT INTO subscription_plan (user_id, movie_id, media_id, rating, review_text, review_date)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                user_id,
                movie_id,
                media_id,
                rating,
                review_text,
                review_date,
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

        const plan = rows[0] as any;

        res.status(201).json(plan);
    } catch (error) {
        console.error("Create review error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Delete a review
// @route   DELETE /api/v1/reviews/:id
// @access  Private/Admin
export const deleteReview = async (req: Request, res: Response): Promise<void> => {
    try {
        // Check if review exists
        const [existingRows] = await pool.execute("SELECT * FROM reviews WHERE review_id = ?", [req.params.id]);

        if (!Array.isArray(existingRows) || existingRows.length === 0) {
            res.status(404).json({ error: "Review not found" });
            return;
        }

        // Delete review
        await pool.execute("DELETE FROM reviews WHERE review_id = ?", [req.params.id]);

        res.json({ message: "Review removed" });
    } catch (error) {
        console.error("Delete review error:", error);
        res.status(500).json({ error: "Server error" });
    }
};