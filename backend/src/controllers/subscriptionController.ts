import type { Request, Response } from "express";
import pool from "../db";
import jwt from "jsonwebtoken"
import { format } from "mysql2";

async function formatSubscription(row: any): Promise<any> {
    if (!row) {
        return null;
    }

    // Fetch plan details
    const [planRows] = await pool.execute("SELECT * FROM subscription_plan WHERE plan_id = ?", [row.plan_id]);
    if (!Array.isArray(planRows) || planRows.length === 0) {
        return null;
    }

    const planDetails = planRows[0] as any;

    return {
        user_subscription_id: row.user_subscription_id,
        user_id: row.user_id,
        plan_id: row.plan_id,
        plan_name: planDetails.plan_name,
        plan_description: planDetails.plan_description,
        start_date: row.start_date,
        end_date: row.end_date,
        duration_days: planDetails.duration_days,
        price: planDetails.price
    };
}

// Helper: Get the user's current active plan
const getCurrentPlan = async (userId: string, date: Date = new Date()) : Promise<any> => {
    console.log(date);
    const [userSubRows] = await pool.execute(
        `SELECT us.* 
         FROM user_subscription us
         JOIN billing b ON us.user_subscription_id = b.user_subscription_id
         WHERE us.user_id = ? AND ? BETWEEN us.start_date AND us.end_date
           AND b.payment_status = 'COMPLETED'`,
        [userId, date]
    );

    if (!Array.isArray(userSubRows) || userSubRows.length === 0) {
        return null;
    }

    const userSub = userSubRows[0] as any;
    const resBody = await formatSubscription(userSub);

    return resBody;
}

// @desc    Get user's own plan
// @route   GET /api/v1/subscription
// @access  Private
export const getActivePlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            // Verify token
            const self: any = jwt.verify(token || "your_token", process.env.SECRET_KEY || "your_jwt_secret");
            // console.log("self", self);

            // Get subscription plan details
            const activeSubscription = await getCurrentPlan(self.id);

            res.json(activeSubscription);
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
export const updatePlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        const { plan_id } = req.body;

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            // Verify token
            const self: any = jwt.verify(token || "your_token", process.env.SECRET_KEY || "your_jwt_secret");

            // Check if the user has an active plan
            const currentPlan = await getCurrentPlan(self.id);

            if (currentPlan) {
                // Check if the user already has a continuing plan
                const [continuingPlanRows] = await pool.execute(
                    `SELECT * FROM user_subscription 
                     WHERE user_id = ? AND start_date > ?`,
                    [self.id, currentPlan.end_date]
                );

                if (Array.isArray(continuingPlanRows) && continuingPlanRows.length > 0) {
                    res.status(400).json({ error: "User already has a continuing plan" });
                    return;
                }

                // Add a subscription after the current plan
                const [planDetailsRows] = await pool.execute("SELECT duration_days, price FROM subscription_plan WHERE plan_id = ?", [plan_id]);
                if (!Array.isArray(planDetailsRows) || planDetailsRows.length === 0) {
                    res.status(404).json({ error: "Plan details not found" });
                    return;
                }

                const { duration_days, price } = planDetailsRows[0] as any;
                const start_date = new Date(currentPlan.end_date);
                start_date.setDate(start_date.getDate() + 1);
                const end_date = new Date(start_date);
                end_date.setDate(start_date.getDate() + duration_days);

                const [result] = await pool.execute(
                    "INSERT INTO user_subscription (user_id, plan_id, start_date, end_date) VALUES (?, ?, ?, ?)",
                    [self.id, plan_id, start_date, end_date]
                );

                const user_subscription_id = (result as any).insertId;

                // Add a new billing entry
                await pool.execute(
                    "INSERT INTO billing (user_subscription_id, payment_status, amount, due_date) VALUES (?, ?, ?, ?)",
                    [user_subscription_id, 'PENDING', price, end_date]
                );

                res.json({ message: "Subscription plan added after current plan" });
            } else {
                // Add a new subscription
                const [planDetailsRows] = await pool.execute("SELECT duration_days, price FROM subscription_plan WHERE plan_id = ?", [plan_id]);
                if (!Array.isArray(planDetailsRows) || planDetailsRows.length === 0) {
                    res.status(404).json({ error: "Plan details not found" });
                    return;
                }

                const { duration_days, price } = planDetailsRows[0] as any;
                const start_date = new Date();
                const end_date = new Date();
                end_date.setDate(start_date.getDate() + duration_days);

                const [result] = await pool.execute(
                    "INSERT INTO user_subscription (user_id, plan_id, start_date, end_date) VALUES (?, ?, ?, ?)",
                    [self.id, plan_id, start_date, end_date]
                );

                const user_subscription_id = (result as any).insertId;

                // Add a new billing entry
                await pool.execute(
                    "INSERT INTO billing (user_subscription_id, payment_status, amount, due_date) VALUES (?, ?, ?, ?)",
                    [user_subscription_id, 'PENDING', price, end_date]
                );

                res.json({ message: "New subscription plan added" });
            }
        }

        if (!token) {
            res.status(401).json({ error: "Not authorized, no token" });
        }
    } catch (error) {
        console.error("Update subscription plan error:", error);
        res.status(500).json({ error: "Server error" });
    }
};