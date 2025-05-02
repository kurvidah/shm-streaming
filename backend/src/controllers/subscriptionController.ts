import type { Request, Response } from "express";
import pool from "../db";
import jwt from "jsonwebtoken"

// @desc    Get user's own plan
// @route   GET /api/v1/subscription
// @access  Private
export const getSelfPlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            // Verify token
            const self: any = jwt.verify(token || "your_token", process.env.SECRET_KEY || "your_jwt_secret");
            console.log("self", self);

            // Get user plan
            const [userplanRows] = await pool.execute("SELECT * FROM user_subscription WHERE user_id = ?", [self.id]);

            if (!Array.isArray(userplanRows) || userplanRows.length === 0) {
                res.status(404).json({ error: "Subscription not found" });
                return;
            }

            const userplan = userplanRows[0] as any;

            // Get subscription plan details
            const [subscriptionPlanRows] = await pool.execute("SELECT * FROM subscription_plan WHERE plan_id = ?", [userplan.plan_id]);
            if (!Array.isArray(subscriptionPlanRows) || subscriptionPlanRows.length === 0) {
                res.status(404).json({ error: "Subscription plan not found" });
                return;
            }

            const subscriptionPlan = subscriptionPlanRows[0] as any;

            res.json(subscriptionPlan);
        }

        if (!token) {
            res.status(401).json({ error: "Not authorized, no token" });
        }
    } catch (error) {
        console.error("Get subscription error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Update a subscription plan
// @route   PUT /api/v1/subscription
// @access  Private
export const updateSelfPlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const { plan_id } = req.body;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            // Verify token
            const self: any = jwt.verify(token || "your_token", process.env.SECRET_KEY || "your_jwt_secret");
            console.log("self", self);

            // Check if subscription plan exists
            const [existingRows] = await pool.execute("SELECT * FROM subscription_plan WHERE plan_id = ?", [plan_id]);
            if (!Array.isArray(existingRows) || existingRows.length === 0) {
                res.status(404).json({ error: "Subscription plan not found" });
                return;
            }

            // Check if user subscription exists
            const [userSubscriptionRows] = await pool.execute("SELECT * FROM user_subscription WHERE user_id = ?", [self.id]);
            if (!Array.isArray(userSubscriptionRows) || userSubscriptionRows.length === 0) {
                res.status(404).json({ error: "User subscription not found" });
                return;
            }

            // Update user subscription
            await pool.execute("UPDATE user_subscription SET plan_id = ? WHERE user_id = ?", [plan_id, self.id]);

            // Fetch updated subscription details
            const [updatedSubscriptionRows] = await pool.execute(
                `SELECT us.user_id, sp.plan_name 
                 FROM user_subscription us 
                 JOIN subscription_plan sp ON us.plan_id = sp.plan_id 
                 WHERE us.user_id = ?`,
                [self.id]
            );

            if (!Array.isArray(updatedSubscriptionRows) || updatedSubscriptionRows.length === 0) {
                res.status(404).json({ error: "Updated subscription details not found" });
                return;
            }

            const updatedSubscription = updatedSubscriptionRows[0];
            res.json({ message: "Subscription plan updated", subscription: updatedSubscription });
        }

        if (!token) {
            res.status(401).json({ error: "Not authorized, no token" });
        }
    } catch (error) {
        console.error("Update subscription plan error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Get a user's subscription plan by ID
// @route   GET /api/v1/subscription/:id
// @access  Admin
export const getUserPlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;

        // Check if user subscription exists
        const [userplanRows] = await pool.execute("SELECT * FROM user_subscription WHERE user_id = ?", [id]);

        if (!Array.isArray(userplanRows) || userplanRows.length === 0) {
            res.status(404).json({ error: "Subscription not found" });
            return;
        }

        const userplan = userplanRows as any;

        res.json(userplan);
    } catch (error) {
        console.error("Get user subscription error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Update a user's subscription plan by ID
// @route   PUT /api/v1/subscription/:id
// @access  Admin
export const updateUserPlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const { plan_id } = req.body;

        // Check if subscription plan exists
        const [existingRows] = await pool.execute("SELECT * FROM subscription_plan WHERE plan_id = ?", [plan_id]);
        if (!Array.isArray(existingRows) || existingRows.length === 0) {
            res.status(404).json({ error: "Subscription plan not found" });
            return;
        }

        // Check if user subscription exists
        const [userSubscriptionRows] = await pool.execute("SELECT * FROM user_subscription WHERE user_id = ?", [id]);
        if (!Array.isArray(userSubscriptionRows) || userSubscriptionRows.length === 0) {
            res.status(404).json({ error: "User subscription not found" });
            return;
        }

        // Update user subscription
        await pool.execute("UPDATE user_subscription SET plan_id = ? WHERE user_id = ?", [plan_id, id]);

        // Fetch updated subscription details
        const [updatedSubscriptionRows] = await pool.execute(
            `SELECT us.user_id, sp.plan_name 
             FROM user_subscription us 
             JOIN subscription_plan sp ON us.plan_id = sp.plan_id 
             WHERE us.user_id = ?`,
            [id]
        );

        if (!Array.isArray(updatedSubscriptionRows) || updatedSubscriptionRows.length === 0) {
            res.status(404).json({ error: "Updated subscription details not found" });
            return;
        }

        const updatedSubscription = updatedSubscriptionRows[0];
        res.json({ message: "Subscription plan updated", subscription: updatedSubscription });
    } catch (error) {
        console.error("Update user subscription plan error:", error);
        res.status(500).json({ error: "Server error" });
    }
};