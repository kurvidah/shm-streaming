import type { Request, Response } from "express";
import pool from "../db";
import jwt from "jsonwebtoken"

// @desc    Get all users
// @route   GET /api/v1/users
// @access  Private/Admin

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {
        const query = `
            SELECT 
            u.user_id, 
            u.username, 
            u.email, 
            u.role, 
            u.gender, 
            u.birthdate, 
            u.region, 
            u.created_at, 
            sp.plan_name AS active_subscription
            FROM users u
            LEFT JOIN user_subscription s ON u.user_id = s.user_id AND s.end_date > NOW()
            LEFT JOIN subscription_plan sp ON s.plan_id = sp.plan_id
        `;

        // Get users
        const [userRows] = await pool.execute(query);

        if (!Array.isArray(userRows) || userRows.length === 0) {
            res.status(404).json({ error: "User list empty" });
            return;
        }

        res.json(userRows);
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Get users by ID
// @route   GET /api/v1/users/:id
// @access  Private/Admin

export const getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
        const query = `
            SELECT 
            u.user_id, 
            u.username, 
            u.email, 
            u.role, 
            u.gender, 
            u.birthdate, 
            u.region, 
            u.created_at,
            sp.plan_name AS active_subscription
            FROM users u
            LEFT JOIN user_subscription s ON u.user_id = s.user_id AND s.end_date > NOW()
            LEFT JOIN subscription_plan sp ON s.plan_id = sp.plan_id
            WHERE u.user_id = ?
        `;
        const queryParams = [req.params.id];

        // Get user
        const [userRows] = await pool.execute(query, queryParams);

        if (!Array.isArray(userRows) || userRows.length === 0) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        const user = userRows[0] as any;

        res.json(user);
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Get user's own details
// @route   GET /api/v1/users/me
// @access  Private

export const getSelf = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            // Verify token
            const self: any = jwt.verify(token || "your_token", process.env.SECRET_KEY || "your_jwt_secret");
            console.log("self", self);

            const query = `
            SELECT 
                u.user_id, 
                u.username, 
                u.email, 
                u.role, 
                u.gender, 
                u.birthdate, 
                u.region, 
                u.created_at, 
                sp.plan_name AS active_subscription
            FROM users u
            LEFT JOIN user_subscription s ON u.user_id = s.user_id AND s.end_date > NOW()
            LEFT JOIN subscription_plan sp ON s.plan_id = sp.plan_id
            WHERE u.user_id = ?
            `;
            const queryParams = [self.id];

            // Get user
            const [userRows] = await pool.execute(query, queryParams);

            if (!Array.isArray(userRows) || userRows.length === 0) {
                res.status(404).json({ error: "User not found" });
                return;
            }

            const user = userRows[0] as any;

            res.json(user);
        }

        if (!token) {
            res.status(401).json({ error: "Not authorized, no token" });
        }
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Update a user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password, gender, birthdate, region } = req.body;

        // Check if user exists
        const [existingRows] = await pool.execute("SELECT user_id, username, email, role, gender, birthdate, region, created_at FROM users WHERE user_id = ?", [req.params.id]);

        if (!Array.isArray(existingRows) || existingRows.length === 0) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // Build update query
        const updateFields: string[] = [];
        const updateValues: any[] = [];

        if (username) {
            updateFields.push("username = ?");
            updateValues.push(username);
        }
        if (email) {
            updateFields.push("email = ?");
            updateValues.push(email);
        }
        if (password) {
            updateFields.push("password = ?");
            updateValues.push(password);
        }
        if (gender) {
            updateFields.push("gender = ?");
            updateValues.push(gender);
        }
        if (birthdate) {
            updateFields.push("birthdate = ?");
            updateValues.push(birthdate);
        }
        if (region) {
            updateFields.push("region = ?");
            updateValues.push(region);
        }

        if (updateFields.length === 0) {
            res.status(400).json({ error: "No fields to update" });
            return;
        }

        // Add user_id to values
        updateValues.push(req.params.id);

        // Update user
        await pool.execute(`UPDATE users SET ${updateFields.join(", ")} WHERE user_id = ?`, updateValues);

        // Get updated user
        const [updatedRows] = await pool.execute("SELECT user_id, username, email, role, gender, birthdate, region, created_at FROM users WHERE user_id = ?", [req.params.id]);

        if (Array.isArray(updatedRows) && updatedRows.length > 0) {
            const user = updatedRows[0] as any;
            res.json(user);
        } else {
            res.status(404).json({ error: "User not found after update" });
        }
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Update user's own details
// @route   PUT /api/v1/users/me
// @access  Private

export const updateSelf = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const { username, email, password, gender, birthdate, region } = req.body;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            // Verify token
            const self: any = jwt.verify(token || "your_token", process.env.SECRET_KEY || "your_jwt_secret");

            const query = "SELECT user_id, username, email, role, gender, birthdate, region, created_at FROM users WHERE user_id = ?";
            const queryParams = [self.id];

            // Get user
            const [userRows] = await pool.execute(query, queryParams);

            if (!Array.isArray(userRows) || userRows.length === 0) {
                res.status(404).json({ error: "User not found" });
                return;
            }

            // Build update query
            const updateFields: string[] = [];
            const updateValues: any[] = [];

            if (username) {
                updateFields.push("username = ?");
                updateValues.push(username);
            }
            if (email) {
                updateFields.push("email = ?");
                updateValues.push(email);
            }
            if (password) {
                updateFields.push("password = ?");
                updateValues.push(password);
            }
            if (gender) {
                updateFields.push("gender = ?");
                updateValues.push(gender);
            }
            if (birthdate) {
                updateFields.push("birthdate = ?");
                updateValues.push(birthdate);
            }
            if (region) {
                updateFields.push("region = ?");
                updateValues.push(region);
            }

            if (updateFields.length === 0) {
                res.status(400).json({ error: "No fields to update" });
                return;
            }

            // Add user_id to values
            updateValues.push(self.id);

            // Update user
            await pool.execute(`UPDATE users SET ${updateFields.join(", ")} WHERE user_id = ?`, updateValues);

            // Get updated usre
            const [updatedRows] = await pool.execute("SELECT user_id FROM users WHERE user_id = ?", [self.id]);

            if (Array.isArray(updatedRows) && updatedRows.length > 0) {
                const user = updatedRows[0] as any;
                res.json(user);
            } else {
                res.status(404).json({ error: "User not found after update" });
            }
        }

        if (!token) {
            res.status(401).json({ error: "Not authorized, no token" });
        }
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Delete a user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        // Check if user exists
        const [existingRows] = await pool.execute("SELECT user_id FROM users WHERE user_id = ?", [req.params.id]);

        if (!Array.isArray(existingRows) || existingRows.length === 0) {
            res.status(404).json({ error: "User not found" });
            return;
        }

        // Delete user
        await pool.execute("DELETE FROM users WHERE user_id = ?", [req.params.id]);

        res.json({ message: "User removed" });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Delete user's own details
// @route   DELETE /api/v1/users/me
// @access  Private
export const deleteSelf = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            // Verify token
            const self: any = jwt.verify(token || "your_token", process.env.SECRET_KEY || "your_jwt_secret");

            const query = "SELECT user_id FROM users WHERE user_id = ?";
            const queryParams = [self.id];

            // Get user
            const [userRows] = await pool.execute(query, queryParams);

            if (!Array.isArray(userRows) || userRows.length === 0) {
                res.status(404).json({ error: "User not found" });
                return;
            }

            // Delete user
            await pool.execute("DELETE FROM users WHERE user_id = ?", [self.id]);

            res.json({ message: "User removed" });
        }

        if (!token) {
            res.status(401).json({ error: "Not authorized, no token" });
        }
    } catch (error) {
        console.error("Get user error:", error);
        res.status(500).json({ error: "Server error" });
    }
};