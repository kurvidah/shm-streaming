import type { Request, Response } from "express";
import pool from "../db";

// @desc    Get all media
// @route   GET /api/v1/media
// @access  Public

export const getMedia = async (req: Request, res: Response): Promise<void> => {
    try {

        let query;

        query = "SELECT * FROM media";

        // Get subscription plan
        const [mediaRows] = await pool.execute(query);

        if (!Array.isArray(mediaRows) || mediaRows.length === 0) {
            res.status(404).json({ error: "Media list empty" });
            return;
        }
        const mediaCount = mediaRows.length;
        res.json({ mediaCount, rows: mediaRows });
    } catch (error) {
        console.error("Get media plan error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Get media by ID
// @route   GET /api/v1/media/:id
// @access  Public

export const getMediaById = async (req: Request, res: Response): Promise<void> => {
    try {

        let query;
        let queryParams;

        query = "SELECT * FROM media WHERE media_id = ?";
        queryParams = [req.params.id];

        // Get media
        const [mediaRows] = await pool.execute(query, queryParams);

        if (!Array.isArray(mediaRows) || mediaRows.length === 0) {
            res.status(404).json({ error: "media not found" });
            return;
        }

        const media = mediaRows[0] as any;

        // Check if media is empty
        if (!media) {
            res.status(404).json({ error: "Media not found" });
            return;
        }

        res.json({ media });
    } catch (error) {
        console.error("Get media error:", error);
        res.status(500).json({ error: "Server error" });
    }
};