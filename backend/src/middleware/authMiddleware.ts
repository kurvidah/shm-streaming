import type { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import pool from "../db"

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: any
        }
    }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
    let token;

    // Check if token exists in headers
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
        try {
            // Get token from header
            token = req.headers.authorization.split(" ")[1];

            // Verify token
            const decoded: any = jwt.verify(token, process.env.SECRET_KEY || "your_jwt_secret");

            // Get user from database
            const [rows] = await pool.execute("SELECT user_id, username, email, role_id FROM users WHERE user_id = ?", [
                decoded.id,
            ]);

            if (Array.isArray(rows) && rows.length > 0) {
                req.user = rows[0];
                next();
            } else {
                res.status(401).json({ error: "Not authorized, user not found" });
            }
        } catch (error) {
            console.error("Auth error:", error);
            res.status(401).json({ error: "Not authorized, token failed" });
        }
    }

    if (!token) {
        res.status(401).json({ error: "Not authorized, no token" });
    }
};

// Admin middleware
export const admin = [protect, (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role_id <= 1) {
        next();
    } else {
        res.status(403).json({ error: "Not authorized as admin" });
    }
}];

export const mod = [protect, (req: Request, res: Response, next: NextFunction) => {
    if (req.user && req.user.role_id <= 2) {
        next();
    } else {
        res.status(403).json({ error: "Not authorized as a moderator" });
    }
}];
