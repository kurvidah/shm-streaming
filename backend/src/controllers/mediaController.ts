import fs from "fs";
import path from "path";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import pool from "../db";
import ffmpeg from "fluent-ffmpeg";

const getVideoDuration = (filePath: string): Promise<number> => {
    return new Promise((resolve, reject) => {
        ffmpeg.ffprobe(filePath, (err, metadata) => {
            if (err) reject(err);
            else resolve(metadata.format.duration || 0);
        });
    });
};

export const getMediaById = async (req: Request, res: Response): Promise<void> => {
    try {
        const media_id = req.params.id;
        const rangeHeader = req.headers["range-minutes"] as string | undefined;

        // Authenticate user
        const token = req.headers.authorization?.split(" ")[1];
        if (!token || !req.headers.authorization?.startsWith("Bearer")) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const self: any = jwt.verify(token, process.env.SECRET_KEY || "your_jwt_secret");

        // Get media info
        const [rows] = await pool.execute("SELECT * FROM media WHERE media_id = ?", [media_id]);
        if (!rows || rows.length === 0) {
            res.status(404).json({ error: "Media not found" });
            return;
        }

        const media = rows[0] as any;
        // const videoPath = path.resolve(media.file_path);
        const videoPath = '/app/public/media/test_video.mp4' // For testing
        if (!fs.existsSync(videoPath)) {
            res.status(404).json({ error: "File not found" });
            return;
        }

        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;

        // Duration
        const durationSeconds = await getVideoDuration(videoPath);
        const durationMinutes = durationSeconds / 60;

        // Setup streaming
        let startByte = 0;
        let endByte = fileSize - 1;

        if (rangeHeader && rangeHeader.startsWith("minutes=")) {
            const [, rangeStr] = rangeHeader.split("=");
            const [startMinStr, endMinStr] = rangeStr.split("-");
            const startMin = parseFloat(startMinStr);
            const endMin = parseFloat(endMinStr || `${durationMinutes}`);

            if (!isNaN(startMin) && startMin >= 0 && startMin < durationMinutes) {
                const startRatio = startMin / durationMinutes;
                const endRatio = Math.min(1, endMin / durationMinutes);
                startByte = Math.floor(startRatio * fileSize);
                endByte = Math.min(fileSize - 1, Math.floor(endRatio * fileSize));
            }
        }

        const chunkSize = endByte - startByte + 1;
        const fileStream = fs.createReadStream(videoPath, { start: startByte, end: endByte });

        // Set response headers
        res.writeHead(startByte > 0 || endByte < fileSize - 1 ? 206 : 200, {
            "Content-Range": `bytes ${startByte}-${endByte}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize,
            "Content-Type": "video/mp4",
        });

        // --- Dynamic watch duration update ---
        const watchedMinutes = (endByte - startByte) / (fileSize / durationMinutes); // Estimate progress in minutes

        // Update or insert watch history dynamically
        await pool.execute(
            `
            INSERT INTO watch_history (user_id, media_id, watch_duration)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
            watch_duration = watch_duration + ?
        `,
            [self.id, media_id, watchedMinutes, watchedMinutes]
        );

        fileStream.pipe(res);
    } catch (error) {
        console.error("Stream error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
