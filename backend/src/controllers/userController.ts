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
            if (key === "region" && Object.values(regionMap).includes(value)) {
                const regionCode = Object.keys(regionMap).find(code => regionMap[code] === value);
                if (regionCode) {
                    updateFields.push(`${key} = ?`);
                    updateValues.push(regionCode);
                }
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
export const getUsers = async (req: Request, res: Response) => {
    try {
        const queryParams = req.query;

        // Extract filters from query parameters
        const filters: string[] = [];
        const values: any[] = [];
        if (queryParams.username) {
            filters.push("u.username = ?");
            values.push(queryParams.username);
        }
        if (queryParams.email) {
            filters.push("u.email = ?");
            values.push(queryParams.email);
        }
        if (queryParams.role) {
            filters.push("u.role = ?");
            values.push(queryParams.role);
        }
        if (queryParams.region) {
            filters.push("u.region = ?");
            values.push(queryParams.region);
        }

        const whereClause = filters.length > 0 ? `WHERE ${filters.join(" AND ")}` : "";

        const [users]: any = await pool.execute(`
            SELECT 
            u.user_id, u.username, u.email, u.role, 
            u.gender, u.birthdate, 
            CASE 
                WHEN u.region IS NOT NULL AND u.region IN ('AF', 'AN', 'AS', 'EU', 'NA', 'OC', 'SA') 
                THEN CASE u.region
                WHEN 'AF' THEN 'Africa'
                WHEN 'AN' THEN 'Antarctica'
                WHEN 'AS' THEN 'Asia'
                WHEN 'EU' THEN 'Europe'
                WHEN 'NA' THEN 'North America'
                WHEN 'OC' THEN 'Oceania'
                WHEN 'SA' THEN 'South America'
                END
                ELSE u.region
            END AS region,
            u.created_at,
            sp.plan_name AS active_subscription
            FROM users u
            LEFT JOIN user_subscription s ON u.user_id = s.user_id AND s.end_date > NOW()
            LEFT JOIN subscription_plan sp ON s.plan_id = sp.plan_id
            ${whereClause}
        `, values);

        const userIds = users.map((user: any) => user.user_id);

        let devices: any[] = [];
        if (userIds.length > 0) {
            const [deviceRows]: any = await pool.execute(`
            SELECT 
                d.user_id, d.device_id, d.device_type, d.device_name
            FROM device d
            WHERE d.user_id IN (${userIds.map(() => '?').join(', ')})
            `, userIds);

            devices = deviceRows;
        }

        const rows = users.map((user: any) => {
            const userDevices = devices.filter((device: any) => device.user_id === user.user_id);
            return { ...user, devices: userDevices };
        });

        if (!Array.isArray(rows) || rows.length === 0) {
            return res.status(404).json({ error: "User list empty" });
        }

        res.json({ count: rows.length, rows });
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