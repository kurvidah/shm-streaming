import type { Request, Response } from "express"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import pool from "../db"

// Generate JWT
const generateToken = (id: number) => {
    const token = jwt.sign({ id }, process.env.SECRET_KEY || "your_jwt_secret", {
        expiresIn: "30d",
    })
    console.log("Generated token:", token) // Debugging line to check generated token
    return token;
}

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body

        // Validate input
        if (!email || typeof email !== "string" || !email.includes("@")) {
            res.status(400).json({ error: "Invalid email format" });
            return;
        }
        if (!password || typeof password !== "string") {
            res.status(400).json({ error: "Password is required" });
            return;
        }

        // Check if user exists
        const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email])

        if (Array.isArray(rows) && rows.length > 0) {
            const user = rows[0] as any

            // Check password
            const isMatch = await bcrypt.compare(password, user.password)

            if (isMatch) {
                res.json({
                    token: generateToken(user.user_id),
                })
            } else {
                res.status(401).json({ error: "Invalid credentials" })
            }
        } else {
            res.status(401).json({ error: "Invalid credentials" })
        }
    } catch (error) {
        console.error("Login error:", error)
        res.status(500).json({ error: "Server error" })
    }
}

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
export const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password, gender, age, region } = req.body

        // Validate input
        if (!username || typeof username !== "string" || username.length < 3) {
            res.status(400).json({ error: "Username must be at least 3 characters" });
            return;
        }
        if (!email || typeof email !== "string" || !email.includes("@")) {
            res.status(400).json({ error: "Invalid email format" });
            return;
        }
        if (!password || typeof password !== "string" || password.length < 8) {
            res.status(400).json({ error: "Password must be at least 8 characters" });
            return;
        }
        if (age !== undefined && (typeof age !== "number" || age < 0)) {
            res.status(400).json({ error: "Invalid age" });
            return;
        }

        // Check if user already exists
        const [existingUsers] = await pool.execute("SELECT * FROM users WHERE email = ? OR username = ?", [email, username])

        if (Array.isArray(existingUsers) && existingUsers.length > 0) {
            const user = existingUsers[0] as any
            if (user.email === email) {
                res.status(400).json({ error: "Email already in use" })
                return;
            }
            if (user.username === username) {
                res.status(400).json({ error: "Username already taken" })
                return;
            }
        }

        // Hash password
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        // Create user
        const [result] = await pool.execute(
            "INSERT INTO users (username, email, password, role_id, gender, age, region) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [username, email, hashedPassword, 3, gender || null, age || null, region || null],
        )

        const insertResult = result as any
        if (insertResult.insertId) {
            res.status(201).json({ message: "User registered successfully" })
        } else {
            res.status(400).json({ error: "Invalid user data" })
        }
    } catch (error) {
        console.error("Registration error:", error)
        res.status(500).json({ error: "Server error" })
    }
}
