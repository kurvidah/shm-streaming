import type { Request, Response } from "express";
import pool from "../db";

export const fetchDashboardSummary = async (req: Request, res: Response): Promise<void> => {
    try {
        const [result]: any = await pool.query(`
            SELECT 
                (SELECT COUNT(*) FROM users) AS total_users,
                (SELECT COUNT(*) FROM media) AS content_library,
                (SELECT COUNT(*) FROM subscription_plan) AS total_plans,
                (SELECT SUM(amount) FROM billing WHERE payment_status = 'COMPLETED') AS total_revenue;
        `);

        res.status(200).json(result[0]);
    } catch (error: any) {
        console.error("Error fetching dashboard summary:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const fetchUsersByGender = async (req: Request, res: Response): Promise<void> => {
    try {
        const [result] = await pool.query(`
            SELECT 
                gender, 
                COUNT(*) AS count 
            FROM users 
            GROUP BY gender;
        `);

        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching users by gender:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const fetchUsersByPlan = async (req: Request, res: Response): Promise<void> => {
    try {
        const [result] = await pool.query(`
            SELECT 
            sp.plan_name, 
            COUNT(u.user_id) AS user_count 
            FROM subscription_plan sp
            LEFT JOIN (
            SELECT us.user_id, us.plan_id
            FROM user_subscription us
            JOIN billing b ON us.user_subscription_id = b.user_subscription_id
            WHERE CURRENT_DATE BETWEEN us.start_date AND us.end_date
              AND b.payment_status = 'COMPLETED'
            ) AS active_subscriptions ON sp.plan_id = active_subscriptions.plan_id
            LEFT JOIN users u ON u.user_id = active_subscriptions.user_id
            GROUP BY sp.plan_name;
        `);

        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching users by plan:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const fetchUsersByRegion = async (req: Request, res: Response): Promise<void> => {
    try {
        const [result] = await pool.query(`
            SELECT 
                region, 
                COUNT(*) AS user_count 
            FROM users 
            GROUP BY region;
        `);

        res.status(200).json(result.rows);
    } catch (error) {
        console.error("Error fetching users by region:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const fetchMonthlyRevenue = async (req: Request, res: Response): Promise<void> => {
    try {
        const year = req.query.year ? parseInt(req.query.year as string, 10) : new Date().getFullYear();
        const month = req.query.month ? parseInt(req.query.month as string, 10) : null;

        let query = `
            SELECT EXTRACT(MONTH FROM us.start_date) as month, 
            COALESCE(SUM(sp.price), 0) AS total_revenue
                FROM user_subscription us
                JOIN subscription_plan sp ON us.plan_id = sp.plan_id
                WHERE EXTRACT(YEAR FROM us.start_date) = ?
        `;

        const queryParams: (number | null)[] = [year];

        if (month) {
            query += ` WHERE m.month = ? `;
            queryParams.push(month);
        }

        query += `
            GROUP BY month
            ORDER BY month;
        `;

        const [result] = await pool.query(query, queryParams);
        console.log(result);
        const revenueMap: Record<number, number> = {};
        result.forEach((row: { month: number, total_revenue: number }) => {
            revenueMap[row.month] = row.total_revenue;
        });
        res.status(200).json(revenueMap);
    } catch (error) {
        console.error("Error fetching revenue:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}

export const fetchActiveSubscriptions = async (req: Request, res: Response): Promise<void> => {
    try {
        const year = req.query.year ? parseInt(req.query.year as string, 10) : new Date().getFullYear();
        const month = req.query.month ? parseInt(req.query.month as string, 10) : null;

        let query = `
            SELECT 
                us.user_subscription_id,
                u.user_id,
                u.username AS user_name,
                sp.plan_name,
                us.start_date,
                us.end_date
            FROM user_subscription us
            JOIN users u ON us.user_id = u.user_id
            JOIN subscription_plan sp ON us.plan_id = sp.plan_id
            JOIN billing b ON us.user_subscription_id = b.user_subscription_id
            WHERE b.payment_status = 'COMPLETED'
              AND EXTRACT(YEAR FROM us.start_date) = ?
        `;

        const queryParams: (number | null)[] = [year];

        if (month) {
            query += ` AND EXTRACT(MONTH FROM us.start_date) = $2 `;
            queryParams.push(month);
        }

        query += `
            ORDER BY us.start_date DESC;
        `;

        const [result] = await pool.query(query, queryParams);

        res.status(200).json(result);
    } catch (error) {
        console.error("Error fetching active subscriptions:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
}