import type { Request, Response } from "express";
import pool from "../db";
import jwt from "jsonwebtoken";

// @desc    Get self bills
// @route   GET /api/v1/bills
// @access  Private
export const getBills = async (
    req: Request,
    res: Response
): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            // Verify token
            const self: any = jwt.verify(
                token || "your_token",
                process.env.SECRET_KEY || "your_jwt_secret"
            );

            // Get user bills
            const [billRows] = await pool.execute(
                `SELECT * FROM billing 
                 WHERE user_subscription_id IN 
                 (SELECT user_subscription_id FROM user_subscription WHERE user_id = ?)`,
                [self.id]
            );

            if (!Array.isArray(billRows) || billRows.length === 0) {
                res.status(404).json({ error: "Bill list empty" });
                return;
            }

            res.json(billRows);
        }

        if (!token) {
            res.status(401).json({ error: "Not authorized, no token" });
            return;
        }
    } catch (error) {
        console.error("Get self bills error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Pay a bill
// @route   POST /api/v1/bills/pay
// @access  Private
export const payBill = async (req: Request, res: Response): Promise<void> => {
    try {
        const token = req.headers.authorization?.split(" ")[1];

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            const { billing_id, payment_method } = req.body;

            // Verify token
            const self: any = jwt.verify(
                token || "your_token",
                process.env.SECRET_KEY || "your_jwt_secret"
            );

            // Check if the billing_id is associated with the user
            const [userBillingRows] = await pool.execute(
                `SELECT * FROM billing 
                 WHERE billing_id = ? AND user_subscription_id IN 
                 (SELECT user_subscription_id FROM user_subscription WHERE user_id = ?)`,
                [billing_id, self.id]
            );

            if (!Array.isArray(userBillingRows) || userBillingRows.length === 0) {
                res.status(403).json({ error: "Not authorized to access this bill" });
                return;
            }

            // Check if bill exists
            const [existingRows] = await pool.execute(
                "SELECT * FROM billing WHERE billing_id = ?",
                [billing_id]
            );

            if (!Array.isArray(existingRows) || existingRows.length === 0) {
                res.status(404).json({ error: "Bill not found" });
                return;
            }

            // Update bill status to paid
            await pool.execute(
                "UPDATE billing SET payment_status = 'COMPLETED', payment_method = ? WHERE billing_id = ?",
                [payment_method, billing_id]
            );

            // Check the associated user_subscription
            const [subscriptionRows] = await pool.execute(
                `SELECT us.start_date, us.end_date, sp.duration_days 
             FROM user_subscription us 
             JOIN subscription_plan sp ON us.plan_id = sp.plan_id 
             WHERE us.user_subscription_id = (SELECT user_subscription_id FROM billing WHERE billing_id = ?)`,
                [billing_id]
            );

            if (Array.isArray(subscriptionRows) && subscriptionRows.length > 0) {
                const subscription = subscriptionRows[0] as any;
                const paymentDate = new Date();

                if (new Date(subscription.start_date) <= paymentDate) {
                    // Update start_date to payment_date and adjust end_date
                    const newEndDate = new Date(paymentDate);
                    newEndDate.setDate(newEndDate.getDate() + subscription.duration_days);

                    await pool.execute(
                        `UPDATE user_subscription
                 SET start_date = ?, end_date = ? 
                 WHERE user_subscription_id = (SELECT user_subscription_id FROM billing WHERE billing_id = ?)`,
                        [paymentDate, newEndDate, billing_id]
                    );
                }
            }
        }

        if (!token) {
            res.status(401).json({ error: "Not authorized, no token" });
            return;
        }

        res.json({ message: "Bill paid successfully" });
    } catch (error) {
        console.error("Pay bill error:", error);
        res.status(500).json({ error: "Server error" });
    }
};
