import type { Request, Response } from "express";
import pool from "../db";
import jwt from "jsonwebtoken"

// @desc    Get all subscription plans
// @route   GET /api/v1/plans
// @access  Public

export const getPlans = async (req: Request, res: Response): Promise<void> => {
    try {

        let query;

        query = "SELECT * FROM subscription_plan";

        // Get subscription plan
        const [planRows] = await pool.execute(query);

        if (!Array.isArray(planRows) || planRows.length === 0) {
            res.status(404).json({ error: "No subscription plans found" });
            return;
        }

        const planCount = planRows.length;
        res.json({ count: planCount, plans: planRows });
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
            res.status(404).json({ error: "Subscription plan not found" });
            return;
        }

        const subscription_plan = planRows[0] as any;

        res.json(subscription_plan);
    } catch (error) {
        console.error("Get subscription_plan error:", error);
        res.status(500).json({ error: "Server error" });
    }
};