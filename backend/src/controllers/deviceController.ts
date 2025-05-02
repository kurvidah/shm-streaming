import type { Request, Response } from "express";
import pool from "../db";

// @desc    Get all devices
// @route   GET /api/v1/devices
// @access  Private/Admin

export const getDevices = async (req: Request, res: Response): Promise<void> => {
    try {

        let query;

        query = "SELECT * FROM device";

        // Get user
        const [deviceRows] = await pool.execute(query);

        if (!Array.isArray(deviceRows) || deviceRows.length === 0) {
            res.status(404).json({ error: "Device list empty" });
            return;
        }

        res.json(deviceRows);
    } catch (error) {
        console.error("Get device error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Get devices by ID
// @route   GET /api/v1/devices/:id
// @access  Private/Admin

export const getDeviceById = async (req: Request, res: Response): Promise<void> => {
    try {

        const device_id = req.query

        let query;
        let queryParams;

        query = "SELECT * FROM device WHERE device_id = ?";
        queryParams = [req.params.id];

        // Get device
        const [deviceRows] = await pool.execute(query, queryParams);

        if (!Array.isArray(deviceRows) || deviceRows.length === 0) {
            res.status(404).json({ error: "Device not found" });
            return;
        }

        const device = deviceRows[0] as any;

        res.json(device);
    } catch (error) {
        console.error("Get device error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Update a device
// @route   PUT /api/v1/devices/:id
// @access  Private/Admin
export const updateDevice = async (req: Request, res: Response): Promise<void> => {
    try {
        const { user_id, device_type, device_name, registered_at} = req.body;

        // Check if device exists
        const [existingRows] = await pool.execute("SELECT device_id, user_id, device_type, device_name, registered_at FROM device WHERE device_id = ?", [req.params.id]);

        if (!Array.isArray(existingRows) || existingRows.length === 0) {
            res.status(404).json({ error: "Device not found" });
            return;
        }

        // Build update query
        const updateFields: string[] = [];
        const updateValues: any[] = [];

        if (user_id) {
            updateFields.push("user_id = ?");
            updateValues.push(user_id);
        }
        if (device_type) {
            updateFields.push("device_type = ?");
            updateValues.push(device_type);
        }
        if (device_name) {
            updateFields.push("device_name = ?");
            updateValues.push(device_name);
        }
        if (registered_at) {
            updateFields.push("registered_at = ?");
            updateValues.push(registered_at);
        }

        if (updateFields.length === 0) {
            res.status(400).json({ error: "No fields to update" });
            return;
        }

        // Add device_id to values
        updateValues.push(req.params.id);

        // Update device
        await pool.execute(`UPDATE device SET ${updateFields.join(", ")} WHERE device_id = ?`, updateValues);

        // Get updated device
        const [updatedRows] = await pool.execute("SELECT * FROM device WHERE device_id = ?", [req.params.id]);

        if (Array.isArray(updatedRows) && updatedRows.length > 0) {
            const user = updatedRows[0] as any;
            res.json(user);
        } else {
            res.status(404).json({ error: "Device not found after update" });
        }
    } catch (error) {
        console.error("Update device error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Delete a device
// @route   DELETE /api/v1/devices/:id
// @access  Private/Admin
export const deleteDevice = async (req: Request, res: Response): Promise<void> => {
    try {
        // Check if device exists
        const [existingRows] = await pool.execute("SELECT device_id FROM device WHERE device_id = ?", [req.params.id]);

        if (!Array.isArray(existingRows) || existingRows.length === 0) {
            res.status(404).json({ error: "Device not found" });
            return;
        }

        // Delete device
        await pool.execute("DELETE FROM device WHERE device_id = ?", [req.params.id]);

        res.json({ message: "Device removed" });
    } catch (error) {
        console.error("Delete device error:", error);
        res.status(500).json({ error: "Server error" });
    }
};