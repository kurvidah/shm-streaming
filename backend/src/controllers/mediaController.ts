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
        res.json({ mediaCount, media: mediaRows });
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

        const mediaCount = mediaRows.length;
        res.json({ count: mediaCount, media });
    } catch (error) {
        console.error("Get media error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Create a media
// @route   POST /api/v1/media
// @access  Private/Admin
export const createMedia = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            movie_id,
            episode,
            season,
            description,
            upload_date,
            file_path,
            status,
        } = req.body;

        if (!movie_id || !Number.isInteger(movie_id)) {
            res.status(400).json({ error: "Movie id must be an integer" });
            return;
        }

        // Validate status
        if (!status || !["APPROVED", "PENDING", "REJECTED"].includes(status)) {
            res.status(400).json({ error: "Status must be one of: APPROVED, PENDING, REJECTED" });
            return;
        }

        const [result] = await pool.execute(
            `INSERT INTO media (movie_id, episode, season, description, upload_date, file_path, status)
             VALUES (?, ?, ?, ?, ?, ? ,?)`,
            [
                movie_id,
                episode,
                season,
                description || null,
                upload_date,
                file_path,
                status,
            ]
        );

        const insertResult = result as any;
        const mediaId = insertResult.insertId;

        if (!mediaId) {
            res.status(400).json({ error: "Failed to create media" });
            return;
        }

        const [rows] = await pool.execute("SELECT * FROM media WHERE media_id = ?", [mediaId]);

        if (!Array.isArray(rows) || rows.length === 0) {
            res.status(404).json({ error: "Media not found after creation" });
            return;
        }

        const media = rows[0] as any;

        res.status(201).json(media);
    } catch (error) {
        console.error("Create media error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Update a media
// @route   PUT /api/v1/media/:id
// @access  Private/Admin
export const updateMedia = async (req: Request, res: Response): Promise<void> => {
    try {
        const { movie_id, episode, season, description, upload_date, file_path, status } = req.body;

        // Check if subscription plan exists
        const [existingRows] = await pool.execute("SELECT * FROM media WHERE media_id = ?", [req.params.id]);

        if (!Array.isArray(existingRows) || existingRows.length === 0) {
            res.status(404).json({ error: "Media not found" });
            return;
        }

        // Build update query
        const updateFields: string[] = [];
        const updateValues: any[] = [];

        if (movie_id) {
            updateFields.push("movie_id = ?");
            updateValues.push(movie_id);
        }
        if (episode) {
            updateFields.push("episode = ?");
            updateValues.push(episode);
        }
        if (season) {
            updateFields.push("season = ?");
            updateValues.push(season);
        }
        if (description) {
            updateFields.push("description = ?");
            updateValues.push(description);
        }
        if (upload_date) {
            updateFields.push("upload_date = ?");
            updateValues.push(upload_date);
        }
        if (file_path) {
            updateFields.push("file_path = ?");
            updateValues.push(file_path);
        }
        if (status) {
            updateFields.push("status = ?");
            updateValues.push(status);
        }

        if (updateFields.length === 0) {
            res.status(400).json({ error: "No fields to update" });
            return;
        }

        // Add media id to values
        updateValues.push(req.params.id);

        // Update media
        await pool.execute(`UPDATE media SET ${updateFields.join(", ")} WHERE media_id = ?`, updateValues);

        // Get updated media
        const [updatedRows] = await pool.execute("SELECT * FROM media WHERE media_id = ?", [req.params.id]);

        if (Array.isArray(updatedRows) && updatedRows.length > 0) {
            const plan = updatedRows[0] as any;
            res.json(plan);
        } else {
            res.status(404).json({ error: "Media not found after update" });
        }
    } catch (error) {
        console.error("Update media error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Delete a media
// @route   DELETE /api/v1/media/:id
// @access  Private/Admin
export const deleteMedia = async (req: Request, res: Response): Promise<void> => {
    try {
        // Check if media exists
        const [existingRows] = await pool.execute("SELECT * FROM media WHERE media_id = ?", [req.params.id]);

        if (!Array.isArray(existingRows) || existingRows.length === 0) {
            res.status(404).json({ error: "Media not found" });
            return;
        }

        // Delete media
        await pool.execute("DELETE FROM media WHERE media_id = ?", [req.params.id]);

        res.json({ message: "Media removed" });
    } catch (error) {
        console.error("Delete media error:", error);
        res.status(500).json({ error: "Server error" });
    }
};