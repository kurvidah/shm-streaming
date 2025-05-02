import type { Request, Response } from "express";
import pool from "../db";
import jwt from "jsonwebtoken"

// @desc    Get all subscription plan
// @route   GET /api/v1/plans
// @access  Public

export const getPlan = async (req: Request, res: Response): Promise<void> => {
    try {

        let query;

        query = "SELECT * FROM subscription_plan";

        // Get subscription plan
        const [planRows] = await pool.execute(query);

        if (!Array.isArray(planRows) || planRows.length === 0) {
            res.status(404).json({ error: "subscription plan list empty" });
            return;
        }

        res.json(planRows);
    } catch (error) {
        console.error("Get subscription plan error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Get subscription plan by ID
// @route   GET /api/v1/plans/:id
// @access  Public

export const getPlanById = async (req: Request, res: Response): Promise<void> => {
    try {

        const plan_id = req.query

        let query;
        let queryParams;

        query = "SELECT * FROM subscription_plan WHERE plan_id = ?";
        queryParams = [req.params.id];

        // Get subscription plan
        const [planRows] = await pool.execute(query, queryParams);

        if (!Array.isArray(planRows) || planRows.length === 0) {
            res.status(404).json({ error: "subscription plan not found" });
            return;
        }

        const subscription_plan = planRows[0] as any;

        res.json(subscription_plan);
    } catch (error) {
        console.error("Get subscription_plan error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Get user's own plan
// @route   GET /api/v1/plans/me
// @access  Private

export const getSelfPlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            // Verify token
            const self: any = jwt.verify(token || "your_token", process.env.SECRET_KEY || "your_jwt_secret");
            console.log("self", self);

            const query = "SELECT * FROM subscription_plan WHERE plan_id = ?";
            const queryParams = [self.id];

            // Get user plan
            const [userplanRows] = await pool.execute(query, queryParams);

            if (!Array.isArray(userplanRows) || userplanRows.length === 0) {
                res.status(404).json({ error: "User plan not found" });
                return;
            }

            const userplan = userplanRows as any;

            res.json(userplan);
        }

        if (!token) {
            res.status(401).json({ error: "Not authorized, no token" });
        }
    } catch (error) {
        console.error("Get user plan error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Create a subscription plan
// @route   POST /api/v1/plans
// @access  Private/Admin
export const createPlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const {
            plan_name,
            price,
            max_devices,
            hd_available,
            ultra_hd_available,
            duration_days,
        } = req.body;

        if (!plan_name || typeof plan_name !== "string" || plan_name.trim() === "") {
            res.status(400).json({ error: "Plan name is required" });
            return;
        }

        const [result] = await pool.execute(
            `INSERT INTO subscription_plan (plan_name, price, max_devices, hd_available, ultra_hd_available, duration_days)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                plan_name,
                price,
                max_devices,
                hd_available ? 1 : 0,
                ultra_hd_available ? 1 : 0,
                duration_days,
            ]
        );

        const insertResult = result as any;
        const planId = insertResult.insertId;

        if (!planId) {
            res.status(400).json({ error: "Failed to create subscription plan" });
            return;
        }

        const [rows] = await pool.execute("SELECT * FROM subscription_plan WHERE plan_id = ?", [planId]);

        if (!Array.isArray(rows) || rows.length === 0) {
            res.status(404).json({ error: "Subscription plan not found after creation" });
            return;
        }

        const plan = rows[0] as any;

        res.status(201).json(plan);
    } catch (error) {
        console.error("Create subscription plan error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Update a subscription plan
// @route   PUT /api/v1/plans/:id
// @access  Private/Admin
export const updatePlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const { plan_name, price, max_devices, hd_available, ultra_hd_available, duration_days} = req.body;

        // Check if subscription plan exists
        const [existingRows] = await pool.execute("SELECT plan_id, plan_name, price, max_devices, hd_available, ultra_hd_available, duration_days FROM subscription_plan WHERE plan_id = ?", [req.params.id]);

        if (!Array.isArray(existingRows) || existingRows.length === 0) {
            res.status(404).json({ error: "Subscription plan not found" });
            return;
        }

        // Build update query
        const updateFields: string[] = [];
        const updateValues: any[] = [];

        if (plan_name) {
            updateFields.push("plan_name = ?");
            updateValues.push(plan_name);
        }
        if (price) {
            updateFields.push("price = ?");
            updateValues.push(price);
        }
        if (max_devices) {
            updateFields.push("max_devices = ?");
            updateValues.push(max_devices);
        }
        if (hd_available !== undefined) {
            updateFields.push("hd_available = ?");
            updateValues.push(hd_available);
        }
        if (ultra_hd_available !== undefined) {
            updateFields.push("ultra_hd_available = ?");
            updateValues.push(ultra_hd_available);
        }
        if (duration_days) {
            updateFields.push("duration_days = ?");
            updateValues.push(duration_days);
        }

        if (updateFields.length === 0) {
            res.status(400).json({ error: "No fields to update" });
            return;
        }

        // Add subscription plan id to values
        updateValues.push(req.params.id);

        // Update subscription plan
        await pool.execute(`UPDATE subscription_plan SET ${updateFields.join(", ")} WHERE plan_id = ?`, updateValues);

        // Get updated subscription plan
        const [updatedRows] = await pool.execute("SELECT * FROM subscription_plan WHERE plan_id = ?", [req.params.id]);

        if (Array.isArray(updatedRows) && updatedRows.length > 0) {
            const plan = updatedRows[0] as any;
            res.json(plan);
        } else {
            res.status(404).json({ error: "Subscription plan not found after update" });
        }
    } catch (error) {
        console.error("Update subscription plan error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Delete a subscription plan
// @route   DELETE /api/v1/plans/:id
// @access  Private/Admin
export const deletePlan = async (req: Request, res: Response): Promise<void> => {
    try {
        // Check if subscription plan exists
        const [existingRows] = await pool.execute("SELECT * FROM subscription_plan WHERE plan_id = ?", [req.params.id]);

        if (!Array.isArray(existingRows) || existingRows.length === 0) {
            res.status(404).json({ error: "Subscription plan not found" });
            return;
        }

        // Delete subscription plan
        await pool.execute("DELETE FROM subscription_plan WHERE plan_id = ?", [req.params.id]);

        res.json({ message: "Subscription plan removed" });
    } catch (error) {
        console.error("Delete subscription plan error:", error);
        res.status(500).json({ error: "Server error" });
    }
};