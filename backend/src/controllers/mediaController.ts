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

        // Authenticate user
        const token = req.query.token || req.headers.authorization?.split(" ")[1];
        if (!token) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const self: any = jwt.verify(token, process.env.SECRET_KEY || "your_jwt_secret");

        // Fetch media record
        const [rows] = await pool.execute("SELECT * FROM media WHERE media_id = ?", [media_id]);
        if (!rows || rows.length === 0) {
            res.status(404).json({ error: "Media not found" });
            return;
        }

        const media = rows[0] as any;
        const videoPath = '/app/public/media/test_video.mp4'; // For testing
        if (!fs.existsSync(videoPath)) {
            res.status(404).json({ error: "File not found" });
            return;
        }

        const stat = fs.statSync(videoPath);
        const fileSize = stat.size;
        const durationSeconds = await getVideoDuration(videoPath);
        const durationMinutes = durationSeconds / 60;

        // Get previous watch_duration
        const [[watch]] = await pool.execute(
            `SELECT watch_duration FROM watch_history WHERE user_id = ? AND media_id = ?`,
            [self.id, media_id]
        );

        let resumeMinutes = 0;
        const watched = (watch as any)?.watch_duration || 0;

        // If watched almost to the end, restart from beginning
        if (watched < durationMinutes - 1) {
            resumeMinutes = watched;
        }

        // Compute byte ranges
        const startRatio = resumeMinutes / durationMinutes;
        const startByte = Math.floor(startRatio * fileSize);
        const endByte = fileSize - 1;

        if (startByte > endByte) {
            res.status(416).json({ error: "Invalid byte range" });
            return;
        }

        const chunkSize = endByte - startByte + 1;
        const fileStream = fs.createReadStream(videoPath, { start: startByte, end: endByte });

        // Update watch_duration on each play
        const watchedMinutes = (endByte - startByte) / (fileSize / durationMinutes);
        const [[existing]] = await pool.execute(
            `SELECT watch_duration FROM watch_history WHERE user_id = ? AND media_id = ?`,
            [self.id, media_id]
        );
        
        if (existing) {
            await pool.execute(
                `UPDATE watch_history SET watch_duration = watch_duration + ? WHERE user_id = ? AND media_id = ?`,
                [watchedMinutes, self.id, media_id]
            );
        } else {
            await pool.execute(
                `INSERT INTO watch_history (user_id, media_id, watch_duration) VALUES (?, ?, ?)`,
                [self.id, media_id, watchedMinutes]
            );
        }

        // Stream response
        res.writeHead(206, {
            "Content-Range": `bytes ${startByte}-${endByte}/${fileSize}`,
            "Accept-Ranges": "bytes",
            "Content-Length": chunkSize,
            "Content-Type": "video/mp4",
        });

        fileStream.pipe(res);
    } catch (error) {
        console.error("Stream error:", error);
        res.status(500).json({ error: "Server error" });
    }
};


export const watchEnd = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token || !req.headers.authorization.startsWith("Bearer")) {
            res.status(401).json({ error: "Unauthorized" });
            return;
        }

        const self: any = jwt.verify(token, process.env.SECRET_KEY || "your_jwt_secret");
        const { media_id, watch_duration } = req.body;

        if (!media_id || typeof watch_duration !== "number" || watch_duration < 0) {
            res.status(400).json({ error: "Invalid payload" });
            return;
        }

        // Update or insert watch duration using GREATEST to keep max progress
        await pool.execute(
            `
            INSERT INTO watch_history (user_id, media_id, watch_duration)
            VALUES (?, ?, ?)
            ON DUPLICATE KEY UPDATE
            watch_duration = GREATEST(watch_duration, VALUES(watch_duration))
        `,
            [self.id, media_id, watch_duration]
        );

        res.status(200).json({ success: true });
    } catch (error) {
        console.error("Watch-end error:", error);
        res.status(500).json({ error: "Server error" });
    }
};