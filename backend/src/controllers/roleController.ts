import type { Request, Response } from "express";
import pool from "../db";
import slugify from "../utils/slugify";

// @desc    Get all role
// @route   GET /api/v1/roles
// @access  Private/Admin

export const getRoles = async (req: Request, res: Response): Promise<void> => {
    try {

        let query;

        query = "SELECT * FROM roles";

        // Get user
        const [roleRows] = await pool.execute(query);

        if (!Array.isArray(roleRows) || roleRows.length === 0) {
            res.status(404).json({ error: "Roles list empty" });
            return;
        }

        res.json(roleRows);
    } catch (error) {
        console.error("Get role error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Create a role
// @route   POST /api/v1/roles
// @access  Private/Admin
export const createRoles = async (req: Request, res: Response): Promise<void> => {
    try {
        const { role_id, role_name } = req.body;

        if (
            !role_name || 
            typeof role_name !== "string" || 
            role_name.trim() === "" ||
            role_id === null ||
            typeof role_id !== "number" || 
            !Number.isInteger(role_id)
        ) {
            res.status(400).json({ error: "Valid role name and integer role ID are required" });
            return;
        }

        // Insert role
        const [result] = await pool.execute(
            "INSERT INTO roles (role_id, role_name) VALUES (?, ?)",
            [
                role_id, role_name,
            ],
        );


        const insertResult = result as any;

        if (insertResult.insertId) {
            // Get the created role
            const [rows] = await pool.execute("SELECT * FROM roles WHERE role_id = ?", [insertResult.insertId]);

            if (Array.isArray(rows) && rows.length > 0) {
                const role = rows[0] as any;
                // Add slug
                role.slug = slugify(role.role_name, { lower: true });
                res.status(201).json(role);
            } else {
                res.status(404).json({ error: "Role not found after creation" });
            }
        } else {
            res.status(400).json({ error: "Failed to create role" });
        }

    } catch (error) {
        console.error("Create roles error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Delete a role
// @route   DELETE /api/v1/roles/:id
// @access  Private/Admin
export const deleteRole = async (req: Request, res: Response): Promise<void> => {
    try {
        // Check if role exists
        const [existingRows] = await pool.execute("SELECT * FROM roles WHERE role_id = ?", [req.params.id]);

        if (!Array.isArray(existingRows) || existingRows.length === 0) {
            res.status(404).json({ error: "Role not found" });
            return;
        }

        // Delete role
        await pool.execute("DELETE FROM roles WHERE role_id = ?", [req.params.id]);

        res.json({ message: "Role removed" });
    } catch (error) {
        console.error("Delete role error:", error);
        res.status(500).json({ error: "Server error" });
    }
};