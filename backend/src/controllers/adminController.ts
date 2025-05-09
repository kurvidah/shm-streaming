import { Request, Response } from "express";
import pool from "../db";

export const getAll = (table: string) => async (_req: Request, res: Response) => {
    try {
        const [rows] = await pool.execute(`SELECT * FROM ${table}`);

        const count = (rows as any[]).length;
        res.json({ count, rows });
    } catch (error) {
        console.error(`Get all from ${table} error:`, error);
        res.status(500).json({ error: "Server error" });
    }
};

export const getById = (table: string, idColumn = "id") => async (req: Request, res: Response) => {
    try {
        const [rows] = await pool.execute<any[]>(`SELECT * FROM ${table} WHERE ${idColumn} = ?`, [req.params.id]);
        if ((rows as any[]).length === 0) {
            return res.status(404).json({ error: `${table.slice(0, -1)} not found` });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error(`Get ${table} by ID error:`, error);
        res.status(500).json({ error: "Server error" });
    }
};

export const createOne = (table: string, allowedFields: string[]) => async (req: Request, res: Response) => {
    try {
        const fields = allowedFields.filter(field => req.body[field] !== undefined);
        const values = fields.map(field => req.body[field]);

        if (fields.length === 0) {
            return res.status(400).json({ error: "No valid fields provided" });
        }

        const placeholders = fields.map(() => "?").join(", ");
        const [result] = await pool.execute(
            `INSERT INTO ${table} (${fields.join(", ")}) VALUES (${placeholders})`,
            values
        );

        res.status(201).json({ message: `${table.slice(0, -1)} created`, id: (result as any).insertId });
    } catch (error) {
        console.error(`Create ${table} error:`, error);
        res.status(500).json({ error: "Server error" });
    }
};

export const updateOne = (table: string, allowedFields: string[], idColumn = "id") => async (req: Request, res: Response) => {
    try {
        const fields = allowedFields.filter(field => req.body[field] !== undefined);
        const values = fields.map(field => req.body[field]);

        if (fields.length === 0) {
            return res.status(400).json({ error: "No valid fields provided" });
        }

        const updates = fields.map(field => `${field} = ?`).join(", ");
        values.push(req.params.id);

        await pool.execute(`UPDATE ${table} SET ${updates} WHERE ${idColumn} = ?`, values);
        res.json({ message: `${table.slice(0, -1)} updated` });
    } catch (error) {
        console.error(`Update ${table} error:`, error);
        res.status(500).json({ error: "Server error" });
    }
};

export const deleteOne = (table: string, idColumn = "id") => async (req: Request, res: Response) => {
    try {
        await pool.execute(`DELETE FROM ${table} WHERE ${idColumn} = ?`, [req.params.id]);
        res.json({ message: `${table.slice(0, -1)} deleted` });
    } catch (error) {
        console.error(`Delete from ${table} error:`, error);
        res.status(500).json({ error: "Server error" });
    }
};
