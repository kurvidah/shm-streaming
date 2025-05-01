import type { Request, Response } from "express";
import pool from "../db";
import jwt from "jsonwebtoken"

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