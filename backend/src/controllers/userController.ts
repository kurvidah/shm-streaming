import type { Request, Response } from "express";
import pool from "../db";
import jwt from "jsonwebtoken";

const regionMap: Record<string, string> = {
    AF: "Africa",
    AN: "Antarctica",
    AS: "Asia",
    EU: "Europe",
    NA: "North America",
    OC: "Oceania",
    SA: "South America",
};

const getUserSafe = async (id: string | number) => {
    const [users] = await pool.execute(`
        SELECT 
            u.user_id, u.username, u.email, u.role, 
            u.gender, u.birthdate, u.region, u.created_at,
            sp.plan_name AS active_subscription
        FROM users u
        LEFT JOIN user_subscription s ON u.user_id = s.user_id AND s.end_date > NOW()
        LEFT JOIN subscription_plan sp ON s.plan_id = sp.plan_id
        WHERE u.user_id = ?
    `, [id]);

    if (!Array.isArray(users) || users.length === 0) return null;

    const [devices] = await pool.execute(`
        SELECT device_id, device_type, device_name
        FROM device
        WHERE user_id = ?
    `, [id]);

    const user = users[0] as { [key: string]: any, devices?: any[] };
    user.devices = Array.isArray(devices) ? devices : [];

    // Map region code to region name
    if (user.region && regionMap[user.region]) {
        user.region = regionMap[user.region];
    }

    return user;
};


const buildUpdateQuery = (fields: Record<string, any>, isSelfUpdate: boolean = false) => {
    const updateFields: string[] = [];
    const updateValues: any[] = [];

    for (const [key, value] of Object.entries(fields)) {
        if (value !== undefined) {
            // Prevent self-updating password
            if (isSelfUpdate && key === "password") {
                continue;
            }

            // Map region if the key is "region" and the value exists in the regionMap
            if (key === "region" && regionMap[value]) {
                updateFields.push(`${key} = ?`);
                updateValues.push(regionMap[value]);
            } else {
                updateFields.push(`${key} = ?`);
                updateValues.push(value);
            }
        }
    }

    return { updateFields, updateValues };
};

const extractUserFromToken = (req: Request) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token || !req.headers.authorization?.startsWith("Bearer")) return null;
    return jwt.verify(token, process.env.SECRET_KEY || "your_jwt_secret") as any;
};

// @desc Get all users
export const getUsers = async (_req: Request, res: Response) => {
    try {
        const [userRows] : any = await pool.execute(`
            SELECT 
                u.user_id, u.username, u.email, u.role, 
                u.gender, u.birthdate, u.region, u.created_at,
                sp.plan_name AS active_subscription
            FROM users u
            LEFT JOIN user_subscription s ON u.user_id = s.user_id AND s.end_date > NOW()
            LEFT JOIN subscription_plan sp ON s.plan_id = sp.plan_id
        `);

        if (!Array.isArray(userRows) || userRows.length === 0) {
            return res.status(404).json({ error: "User list empty" });
        }

        const [deviceRows] = await pool.execute(`
            SELECT user_id, device_id, device_type, device_name
            FROM device
        `);

        const userMap = new Map<number, any>();
        for (const user of userRows) {
            user.devices = [];
            userMap.set(user.user_id, user);
        }

        for (const device of deviceRows as any[]) {
            const user = userMap.get(device.user_id);
            if (user) user.devices.push(device);
        }

        const userCount = userMap.size;
        res.json({ count: userCount, rows: [...userMap.values()] });
    } catch (error) {
        console.error("Get users error:", error);
        res.status(500).json({ error: "Server error" });
    }
};


// @desc Get user by ID
export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await getUserSafe(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (error) {
        console.error("Get user by ID error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc Get current user
export const getSelf = async (req: Request, res: Response) => {
    try {
        const userPayload = extractUserFromToken(req);
        if (!userPayload) return res.status(401).json({ error: "Not authorized, no token" });

        const user = await getUserSafe(userPayload.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        res.json(user);
    } catch (error) {
        console.error("Get self error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc Update user by ID
export const updateUser = async (req: Request, res: Response) => {
    try {
        const user = await getUserSafe(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const { updateFields, updateValues } = buildUpdateQuery(req.body);
        if (updateFields.length === 0) return res.status(400).json({ error: "No fields to update" });

        updateValues.push(req.params.id);
        await pool.execute(`UPDATE users SET ${updateFields.join(", ")} WHERE user_id = ?`, updateValues);

        const updatedUser = await getUserSafe(req.params.id);
        res.json(updatedUser);
    } catch (error) {
        console.error("Update user error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc Update self
export const updateSelf = async (req: Request, res: Response) => {
    try {
        const userPayload = extractUserFromToken(req);
        if (!userPayload) return res.status(401).json({ error: "Not authorized, no token" });

        const user = await getUserSafe(userPayload.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const { updateFields, updateValues } = buildUpdateQuery(req.body, true);
        if (updateFields.length === 0) return res.status(400).json({ error: "No fields to update" });

        updateValues.push(userPayload.id);
        await pool.execute(`UPDATE users SET ${updateFields.join(", ")} WHERE user_id = ?`, updateValues);

        const updatedUser = await getUserSafe(userPayload.id);
        res.json(updatedUser);
    } catch (error) {
        console.error("Update self error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc Delete user by ID
export const deleteUser = async (req: Request, res: Response) => {
    try {
        const user = await getUserSafe(req.params.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        await pool.execute("DELETE FROM users WHERE user_id = ?", [req.params.id]);
        res.json({ message: "User removed" });
    } catch (error) {
        console.error("Delete user error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc Delete self
export const deleteSelf = async (req: Request, res: Response) => {
    try {
        const userPayload = extractUserFromToken(req);
        if (!userPayload) return res.status(401).json({ error: "Not authorized, no token" });

        const user = await getUserSafe(userPayload.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        await pool.execute("DELETE FROM users WHERE user_id = ?", [userPayload.id]);
        res.json({ message: "User removed" });
    } catch (error) {
        console.error("Delete self error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc Update self password
export const updateSelfPassword = async (req: Request, res: Response) => {
    try {
        const userPayload = extractUserFromToken(req);
        if (!userPayload) return res.status(401).json({ error: "Not authorized, no token" });

        const user = await getUserSafe(userPayload.id);
        if (!user) return res.status(404).json({ error: "User not found" });

        const { oldPassword: currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ error: "Current password and new password are required" });
        }

        // Verify old password
        const [passwordRows]: any = await pool.execute(
            "SELECT password FROM users WHERE user_id = ?",
            [userPayload.id]
        );
        if (!Array.isArray(passwordRows) || passwordRows.length === 0) {
            return res.status(404).json({ error: "User not found" });
        }

        const storedPassword = passwordRows[0].password;
        if (storedPassword !== currentPassword) {
            return res.status(401).json({ error: "Current password is incorrect" });
        }

        // Update to new password
        await pool.execute("UPDATE users SET password = ? WHERE user_id = ?", [newPassword, userPayload.id]);
        res.json({ message: "Password updated" });
    } catch (error) {
        console.error("Update self password error:", error);
        res.status(500).json({ error: "Server error" });
    }
};