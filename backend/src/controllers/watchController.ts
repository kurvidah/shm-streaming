import type { Request, Response } from "express";
import pool from "../db";
import fs from "fs";

// @desc    Get media by ID
// @route   GET /api/v1/watch/:id
// @access  Private
export const serveMedia = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        const result = await pool.query("SELECT * FROM media WHERE media_id = ?", [id]);

        if (result[0].length === 0) {
            res.status(404).json({ message: "Media not found" });
            return;
        }

        const filePath = result[0][0].file_path;

        const stream = fs.createReadStream(`/app/${filePath}`);
        stream.on("error", (err) => {
            res.status(500).json({ message: "Error reading the file", error: err.message });
        });

        res.setHeader("Content-Type", "application/octet-stream");
        stream.pipe(res);
    } catch (error) {
        res.status(500).json({ message: "Server error", error: error.message });
    }
};