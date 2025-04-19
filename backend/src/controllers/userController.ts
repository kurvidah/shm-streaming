import type { Request, Response } from "express";
import pool from "../db";

// @desc    Get users by ID
// @route   GET /api/v1/users/:id
// @access  Private/Admin

export const getUsers = async (req: Request, res: Response): Promise<void> => {
    try {

        let query;

        query = "SELECT * FROM users";

        // Get user
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

        const user_id = req.query

        let query;
        let queryParams;

        query = "SELECT * FROM users WHERE user_id = ?";
        queryParams = [req.params.id];

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

// @desc    Update a user
// @route   PUT /api/v1/users/:id
// @access  Private/Admin
export const updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
        const { username, email, password, gender, age, region } = req.body;

        // Check if user exists
        const [existingRows] = await pool.execute("SELECT * FROM users WHERE user_id = ?", [req.params.id]);

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
        if (age) {
            updateFields.push("age = ?");
            updateValues.push(age);
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

        // Get updated usre
        const [updatedRows] = await pool.execute("SELECT * FROM users WHERE user_id = ?", [req.params.id]);

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

// @desc    Delete a user
// @route   DELETE /api/v1/users/:id
// @access  Private/Admin
export const deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
        // Check if user exists
        const [existingRows] = await pool.execute("SELECT * FROM users WHERE user_id = ?", [req.params.id]);

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