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
        price: planDetails.price,
        billing_id: row.billing_id,
    };
}

// Helper: Get the user's current active plan
export const getLastActive = async (userId: string, date: Date = new Date()): Promise<any> => {
    const [userSubRows] = await pool.execute(
        `
SELECT us.* 
    FROM user_subscription us
    JOIN billing b ON us.user_subscription_id = b.user_subscription_id
    WHERE us.user_id = ? AND ? <= us.end_date
    AND b.payment_status = 'COMPLETED'
    ORDER BY us.end_date DESC
    LIMIT 1
           `,
        [userId, date]
    );

    if (!Array.isArray(userSubRows) || userSubRows.length === 0) {
        return null;
    }
    console.log(userSubRows);

    const userSub = userSubRows[0] as any;
    const resBody = await formatSubscription(userSub);

    return resBody;
}

// @desc    Get all user's subscriptions
// @route   GET /api/v1/admin/subscriptions
// @access  Admin
export const getUserSubscriptions = async (req: Request, res: Response): Promise<void> => {
    try {
        const { search, limit = "100", page = "1" } = req.query;
        const allowedSortFields = ['username', 'email', 'total_subscriptions', 'latest_subscription', 'total_revenue'];
        const sortBy = allowedSortFields.includes(req.query.sortBy as string)
            ? req.query.sortBy
            : 'latest_subscription';

        const params: any[] = [];

        let whereClause = "";
        if (search) {
            const s = `%${search}%`;
            whereClause = `WHERE u.username LIKE ? OR u.email LIKE ?`;
            params.push(s, s);
        }

        const limitVal = parseInt(limit as string, 10);
        const pageVal = parseInt(page as string, 10);
        const offset = (pageVal - 1) * limitVal;

        // Main paginated query
        const userQuery = `
            SELECT 
                u.user_id,
                u.username,
                u.email,
                COUNT(s.user_subscription_id) AS total_subscriptions,
                MAX(s.end_date) AS latest_subscription,
                COALESCE(SUM(b.amount), 0) AS total_revenue
            FROM users u
            LEFT JOIN user_subscription s ON u.user_id = s.user_id
            LEFT JOIN billing b ON s.user_subscription_id = b.user_subscription_id
            ${whereClause}
            GROUP BY u.user_id
            ORDER BY ${sortBy} DESC
            LIMIT ? OFFSET ?
        `;
        const userParams = [...params, limitVal, offset];
        const [users] = await pool.execute(userQuery, userParams);

        // --- Summary Queries ---

        // 1. Active Subscriptions
        const [activeRes] = await pool.execute(`
            SELECT COUNT(*) AS active_count
            FROM user_subscription us
            JOIN billing b ON us.user_subscription_id = b.user_subscription_id
            WHERE CURRENT_DATE BETWEEN us.start_date AND us.end_date
              AND b.payment_status = 'COMPLETED'
        `);
        const activeCount = (activeRes as any)[0]?.active_count || 0;

        // 2. Subscriptions Growth
        const [growthRes] = await pool.execute(`
            SELECT
                COUNT(CASE WHEN MONTH(end_date) = MONTH(CURRENT_DATE()) AND YEAR(end_date) = YEAR(CURRENT_DATE()) THEN 1 END) AS current_month,
                COUNT(CASE WHEN MONTH(end_date) = MONTH(CURRENT_DATE() - INTERVAL 1 MONTH) AND YEAR(end_date) = YEAR(CURRENT_DATE() - INTERVAL 1 MONTH) THEN 1 END) AS last_month
            FROM user_subscription
        `);
        const { current_month = 0, last_month = 0 } = (growthRes as any)[0] || {};
        const growthPercent = last_month
            ? (((current_month - last_month) / last_month) * 100).toFixed(1)
            : "N/A";

        // 3. Most Popular Plan
        const [popularPlanRes] = await pool.execute(`
            SELECT p.plan_name, COUNT(*) AS count
            FROM user_subscription u
            LEFT JOIN subscription_plan p ON p.plan_id = u.plan_id
            JOIN billing b ON u.user_subscription_id = b.user_subscription_id
            WHERE CURRENT_DATE BETWEEN u.start_date AND u.end_date
              AND b.payment_status = 'COMPLETED'
            GROUP BY p.plan_name
            ORDER BY count DESC
            LIMIT 1
        `);
        const { plan_name: mostPopularPlan = "N/A", count: topPlanCount = 0 } = (popularPlanRes as any)[0] || {};

        // 4. Total Subscriptions (for topPlanPercent)
        const [totalSubsRes] = await pool.execute(`
            SELECT COUNT(*) AS total
            FROM user_subscription us
            JOIN billing b ON us.user_subscription_id = b.user_subscription_id
            WHERE CURRENT_DATE BETWEEN us.start_date AND us.end_date
              AND b.payment_status = 'COMPLETED'
        `);
        const totalSubscriptions = (totalSubsRes as any)[0]?.total || 0;
        const topPlanPercent = totalSubscriptions
            ? ((topPlanCount / totalSubscriptions) * 100).toFixed(1)
            : "0.0";

        // 5. Average Revenue Per Subscriber
        const [revenueRes] = await pool.execute(`
            SELECT SUM(b.amount) AS total_revenue, COUNT(DISTINCT s.user_id) AS user_count
            FROM user_subscription s
            LEFT JOIN billing b ON s.user_subscription_id = b.user_subscription_id
        `);
        const { total_revenue = 0, user_count = 0 } = (revenueRes as any)[0] || {};
        const avgRevenue = user_count
            ? (total_revenue / user_count).toFixed(2)
            : "0.00";

        // --- Response ---
        res.json({
            summary: {
                activeSubscriptions: activeCount,
                growthFromLastMonth: `${growthPercent}%`,
                mostPopularPlan,
                topPlanPercent: `${topPlanPercent}% of subscribers`,
                avgRevenuePerUser: `$${avgRevenue}`
            },
            count: (users as any[]).length,
            rows: users
        });
    } catch (error) {
        console.error("Admin get user subscriptions error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

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

            // Get all paid plans
            const [planRows] = await pool.execute(`
                SELECT 
                    us.user_id,
                    us.plan_id,
                    b.billing_id,
                    sp.plan_name,
                    b.payment_date,
                    us.start_date,
                    us.end_date
                FROM user_subscription us
                JOIN subscription_plan sp ON us.plan_id = sp.plan_id
                JOIN billing b ON us.user_subscription_id = b.user_subscription_id
                WHERE us.user_id = ? AND us.end_date > CURRENT_DATE AND b.payment_status = 'COMPLETED'
            `, [self.id]);

            res.json(planRows);
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
        const { plan_id } = req.query;

        if (!plan_id) {
            res.status(400).json({ error: "Missing required plan_id" });
            return;
        }

        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            // Verify token
            const self: any = jwt.verify(token || "your_token", process.env.SECRET_KEY || "your_jwt_secret");

            // Check if the user has an active plan
            const lastPaidPlan = await getLastActive(self.id);

            if (lastPaidPlan) {
                // Add a subscription after the last active plan
                const [planDetailsRows] = await pool.execute("SELECT duration_days, price FROM subscription_plan WHERE plan_id = ?", [plan_id]);
                if (!Array.isArray(planDetailsRows) || planDetailsRows.length === 0) {
                    res.status(404).json({ error: "Plan details not found" });
                    return;
                }

                const { duration_days, price } = planDetailsRows[0] as any;
                const start_date = new Date(lastPaidPlan.end_date);
                start_date.setDate(start_date.getDate() + 1);
                const end_date = new Date(start_date);
                end_date.setDate(start_date.getDate() + duration_days);

                const [result] = await pool.execute(
                    "INSERT INTO user_subscription (user_id, plan_id, start_date, end_date) VALUES (?, ?, ?, ?)",
                    [self.id, plan_id, start_date, end_date]
                );

                const user_subscription_id = (result as any).insertId;

                // Add a new billing entry
                const [billingResult] = await pool.execute(
                    "INSERT INTO billing (user_subscription_id, payment_status, amount, due_date) VALUES (?, ?, ?, NOW() + INTERVAL 7 DAY)",
                    [user_subscription_id, 'PENDING', price]
                );

                const billing_id = (billingResult as any).insertId;


                const newSubscription = await formatSubscription({
                    user_subscription_id,
                    user_id: self.id,
                    plan_id,
                    start_date,
                    end_date,
                    billing_id
                });

                res.json({ message: "Subscription plan added after current plan", subscription: newSubscription });
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
                const [billingResult] = await pool.execute(
                    "INSERT INTO billing (user_subscription_id, payment_status, amount, due_date) VALUES (?, ?, ?, NOW() + INTERVAL 7 DAY)",
                    [user_subscription_id, 'PENDING', price]
                );

                const billing_id = (billingResult as any).insertId;

                const newSubscription = await formatSubscription({
                    user_subscription_id,
                    user_id: self.id,
                    plan_id,
                    billing_id
                });

                res.json({ message: "New subscription plan added", subscription: newSubscription });
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