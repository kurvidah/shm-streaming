import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import pool from "../db";

const userAgentParser = require("ua-parser-js");

const generateToken = (id: number): string => {
    return jwt.sign({ id }, process.env.SECRET_KEY || "your_jwt_secret", { expiresIn: "30d" });
};

const validateLoginInput = (identifier: string, password: string): string | null => {
    if (!identifier || typeof identifier !== "string") return "Identifier is required";
    if (!password || typeof password !== "string") return "Password is required";
    return null;
};

const validateRegisterInput = (username: string, email: string, password: string, birthdate?: string, region?: string): string | null => {
    if (!username || typeof username !== "string" || username.length < 3) return "Username must be at least 3 characters";
    if (!email || typeof email !== "string" || !email.includes("@")) return "Invalid email format";
    if (!password || typeof password !== "string" || password.length < 8) return "Password must be at least 8 characters";
    if (birthdate !== undefined && (!/^\d{4}-\d{2}-\d{2}$/.test(birthdate))) return "Invalid birthdate";
    if (region !== undefined && (!/^[A-Z]{2}$/.test(region))) return "Invalid region. Must be a valid ISO 3166-1 alpha-2 code";
    return null;
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { identifier, password } = req.body;

        const validationError = validateLoginInput(identifier, password);
        if (validationError) {
            res.status(400).json({ error: validationError });
            return;
        }

        const userAgent = req.headers['user-agent'] || "Unknown device";
        const { device: parsedDevice } = userAgentParser(userAgent);
        const deviceType = parsedDevice.type === "mobile" ? "Mobile" : parsedDevice.type === "tablet" ? "Tablet" : "Desktop";
        const deviceName = parsedDevice.vendor || "Unknown vendor";

        const [userRows] = await pool.execute("SELECT * FROM users WHERE email = ? OR username = ?", [identifier, identifier]);
        if (!Array.isArray(userRows) || userRows.length === 0) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const user = userRows[0] as any;
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }

        const [deviceRows] = await pool.execute("SELECT * FROM device WHERE user_id = ?", [user.user_id]);
        if (!Array.isArray(deviceRows) || deviceRows.length === 0) {
            await pool.execute(
                "INSERT INTO device (user_id, device_type, device_name) VALUES (?, ?, ?)",
                [user.user_id, deviceType, deviceName]
            );
        }

        const [updatedDeviceRows] = await pool.execute("SELECT * FROM device WHERE user_id = ?", [user.user_id]);
        const device = (updatedDeviceRows as any[])[0];

        res.json({
            user_id: user.user_id,
            username: user.username,
            email: user.email,
            role: user.role,
            device,
            token: generateToken(user.user_id),
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password, gender, birthdate, region } = req.body;

        const validationError = validateRegisterInput(username, email, password, birthdate, region);
        if (validationError) {
            res.status(400).json({ error: validationError });
            return;
        }

        const [existingUsers] = await pool.execute("SELECT * FROM users WHERE email = ? OR username = ?", [email, username]);
        if (Array.isArray(existingUsers) && existingUsers.length > 0) {
            const user = existingUsers[0] as any;
            if (user.email === email) {
                res.status(400).json({ error: "Email already in use" });
                return;
            }
            if (user.username === username) {
                res.status(400).json({ error: "Username already taken" });
                return;
            }
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const [result] = await pool.execute(
            "INSERT INTO users (username, email, password, role, gender, birthdate, region) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [username, email, hashedPassword, 'USER', gender || null, birthdate || null, region || null]
        );

        const insertResult = result as any;
        if (insertResult.insertId) {
            await pool.execute(
                "INSERT INTO user_subscription (user_id, plan_id) VALUES (?, ?)",
                [insertResult.insertId, 1]
            );
            res.status(201).json({ message: "User registered successfully" });
        } else {
            res.status(400).json({ error: "Invalid user data" });
        }
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
