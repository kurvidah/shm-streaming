import type { Request, Response } from "express";
import pool from "../db";

// @desc    Get all bills
// @route   GET /api/v1/bills
// @access  Private/Admin

export const getBill = async (req: Request, res: Response): Promise<void> => {
    try {

        let query;

        query = "SELECT * FROM billing";

        // Get bill
        const [billRows] = await pool.execute(query);

        if (!Array.isArray(billRows) || billRows.length === 0) {
            res.status(404).json({ error: "Bill list empty" });
            return;
        }

        res.json(billRows);
    } catch (error) {
        console.error("Get bill error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Get bill by ID
// @route   GET /api/v1/bills/:id
// @access  Private/Admin

export const getBillById = async (req: Request, res: Response): Promise<void> => {
    try {


        let query;
        let queryParams;

        query = "SELECT * FROM billing WHERE billing_id = ?";
        queryParams = [req.params.id];

        // Get subscription plan
        const [billRows] = await pool.execute(query, queryParams);

        if (!Array.isArray(billRows) || billRows.length === 0) {
            res.status(404).json({ error: "Bill not found" });
            return;
        }

        const billing = billRows[0] as any;

        res.json(billing);
    } catch (error) {
        console.error("Get bill error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Update a bil
// @route   PUT /api/v1/bills/:id
// @access  Private/Admin
export const updateBill = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user_subscription_id, amount, payment_method, payment_date, due_date, payment_status} = req.body;

        // Check if subscription plan exists
        const [existingRows] = await pool.execute("SELECT billing_id, user_subscription_id, amount, payment_method, payment_date, due_date, payment_status FROM billing WHERE billing_id = ?", [req.params.id]);

        if (!Array.isArray(existingRows) || existingRows.length === 0) {
            res.status(404).json({ error: "Subscription plan not found" });
            return;
        }

        // Build update query
        const updateFields: string[] = [];
        const updateValues: any[] = [];

        if (user_subscription_id) {
            updateFields.push("user_subscription_id = ?");
            updateValues.push(user_subscription_id);
        }
        if (amount) {
            updateFields.push("amount = ?");
            updateValues.push(amount);
        }
        if (payment_method) {
            updateFields.push("payment_method = ?");
            updateValues.push(payment_method);
        }
        if (payment_date) {
            updateFields.push("payment_date = ?");
            updateValues.push(payment_date);
        }
        if (due_date) {
            updateFields.push("due_date = ?");
            updateValues.push(due_date);
        }
        if (payment_status) {
            updateFields.push("payment_status = ?");
            updateValues.push(payment_status);
        }

        if (updateFields.length === 0) {
            res.status(400).json({ error: "No fields to update" });
            return;
        }

        // Add bill id to values
        updateValues.push(req.params.id);

        // Update bill
        await pool.execute(`UPDATE billing SET ${updateFields.join(", ")} WHERE billing_id = ?`, updateValues);

        // Get updated bill
        const [updatedRows] = await pool.execute("SELECT * FROM billing WHERE billing_id = ?", [req.params.id]);

        if (Array.isArray(updatedRows) && updatedRows.length > 0) {
            const bill = updatedRows[0] as any;
            res.json(bill);
        } else {
            res.status(404).json({ error: "Bill not found after update" });
        }
    } catch (error) {
        console.error("Update bill error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Delete a bill
// @route   DELETE /api/v1/bills/:id
// @access  Private/Admin
export const deleteBill = async (req: Request, res: Response): Promise<void> => {
    try {
        // Check if bill exists
        const [existingRows] = await pool.execute("SELECT * FROM billing WHERE billing_id = ?", [req.params.id]);

        if (!Array.isArray(existingRows) || existingRows.length === 0) {
            res.status(404).json({ error: "Bill not found" });
            return;
        }

        // Delete bill
        await pool.execute("DELETE FROM billing WHERE billing_id = ?", [req.params.id]);

        res.json({ message: "Bill removed" });
    } catch (error) {
        console.error("Delete bill error:", error);
        res.status(500).json({ error: "Server error" });
    }
};