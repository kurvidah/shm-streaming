import type { Request, Response } from "express";
import pool from "../db";
import slugify from "../utils/slugify";

// @desc    Get all movies
// @route   GET /api/v1/movies
// @access  Public
export const getMovies = async (req: Request, res: Response): Promise<void> => {
    try {
        const { search, genre, release_year, is_available } = req.query;

        let query = "SELECT * FROM movies WHERE 1=1";
        const queryParams: any[] = [];

        // Add filters
        if (search) {
            query += " AND (title LIKE ? OR description LIKE ?)";
            queryParams.push(`%${search}%`, `%${search}%`);
        }

        if (genre) {
            query += " AND genre = ?";
            queryParams.push(genre);
        }

        if (release_year) {
            query += " AND release_year = ?";
            queryParams.push(release_year);
        }

        if (is_available !== undefined) {
            query += " AND is_available = ?";
            queryParams.push(is_available === "true" ? 1 : 0);
        }

        // Execute query
        const [rows] = await pool.execute(query, queryParams);

        // Add slug to each movie
        const moviesWithSlug = Array.isArray(rows)
            ? rows.map((movie: any) => ({
                ...movie,
                slug: slugify(movie.title, { lower: true }),
            }))
            : [];

        res.json(moviesWithSlug);
    } catch (error) {
        console.error("Get movies error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Get movie by ID
// @route   GET /api/v1/movies/:id
// @access  Public
export const getMovieById = async (req: Request, res: Response): Promise<void> => {
    try {
        // Check if id is a number or a slug
        const isNumeric = /^\d+$/.test(req.params.id);

        let query;
        let queryParams;

        if (isNumeric) {
            query = "SELECT * FROM movies WHERE movie_id = ?";
            queryParams = [req.params.id];
        } else {
            // Treat as slug - find by title that would match the slug
            query = 'SELECT * FROM movies WHERE LOWER(REPLACE(title, " ", "-")) = ?';
            queryParams = [req.params.id.toLowerCase()];
        }

        // Get movie
        const [movieRows] = await pool.execute(query, queryParams);

        if (!Array.isArray(movieRows) || movieRows.length === 0) {
            res.status(404).json({ error: "Movie not found" });
            return;
        }

        const movie = movieRows[0] as any;

        // Add slug
        movie.slug = slugify(movie.title, { lower: true });

        // Get media for this movie
        const [mediaRows] = await pool.execute("SELECT * FROM media WHERE movie_id = ?", [movie.movie_id]);

        // Add media to movie
        movie.media = Array.isArray(mediaRows) ? mediaRows : [];

        res.json(movie);
    } catch (error) {
        console.error("Get movie error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Create a movie
// @route   POST /api/v1/movies
// @access  Private/Admin
export const createMovie = async (req: Request, res: Response): Promise<void> => {
    try {
        console.log(req.body)
        const { title, poster, description, release_year, genre, duration, is_available, imdb_id } = req.body;

        if (!title || typeof title !== "string" || title.trim() === "") {
            res.status(400).json({ error: "Title is required" });
            return;
        }

        // Insert movie
        const [result] = await pool.execute(
            "INSERT INTO movies (title, poster, description, release_year, genre, duration, is_available, imdb_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
            [
                title,
                poster || null,
                description || null,
                release_year || null,
                genre || null,
                duration || null,
                is_available ? 1 : 0,
                imdb_id || null,
            ],
        );

        const insertResult = result as any;

        if (insertResult.insertId) {
            // Get the created movie
            const [rows] = await pool.execute("SELECT * FROM movies WHERE movie_id = ?", [insertResult.insertId]);

            if (Array.isArray(rows) && rows.length > 0) {
                const movie = rows[0] as any;
                // Add slug
                movie.slug = slugify(movie.title, { lower: true });
                res.status(201).json(movie);
            } else {
                res.status(404).json({ error: "Movie not found after creation" });
            }
        } else {
            res.status(400).json({ error: "Failed to create movie" });
        }
    } catch (error) {
        console.error("Create movie error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Update a movie
// @route   PUT /api/v1/movies/:id
// @access  Private/Admin
export const updateMovie = async (req: Request, res: Response): Promise<void> => {
    try {
        const { title, poster, description, release_year, genre, duration, is_available, imdb_id } = req.body;

        // Check if movie exists
        const [existingRows] = await pool.execute("SELECT * FROM movies WHERE movie_id = ?", [req.params.id]);

        if (!Array.isArray(existingRows) || existingRows.length === 0) {
            res.status(404).json({ error: "Movie not found" });
            return;
        }

        // Build update query
        const updateFields: string[] = [];
        const updateValues: any[] = [];

        if (title) {
            updateFields.push("title = ?");
            updateValues.push(title);
        }
        if (poster) {
            updateFields.push("poster = ?");
            updateValues.push(poster);
        }
        if (description) {
            updateFields.push("description = ?");
            updateValues.push(description);
        }
        if (release_year) {
            updateFields.push("release_year = ?");
            updateValues.push(release_year);
        }
        if (genre) {
            updateFields.push("genre = ?");
            updateValues.push(genre);
        }
        if (duration) {
            updateFields.push("duration = ?");
            updateValues.push(duration);
        }
        if (is_available !== undefined) {
            updateFields.push("is_available = ?");
            updateValues.push(is_available ? 1 : 0);
        }
        if (imdb_id) {
            updateFields.push("imdb_id = ?");
            updateValues.push(imdb_id);
        }

        if (updateFields.length === 0) {
            res.status(400).json({ error: "No fields to update" });
            return;
        }

        // Add movie_id to values
        updateValues.push(req.params.id);

        // Update movie
        await pool.execute(`UPDATE movies SET ${updateFields.join(", ")} WHERE movie_id = ?`, updateValues);

        // Get updated movie
        const [updatedRows] = await pool.execute("SELECT * FROM movies WHERE movie_id = ?", [req.params.id]);

        if (Array.isArray(updatedRows) && updatedRows.length > 0) {
            const movie = updatedRows[0] as any;
            // Add slug
            movie.slug = slugify(movie.title, { lower: true });
            res.json(movie);
        } else {
            res.status(404).json({ error: "Movie not found after update" });
        }
    } catch (error) {
        console.error("Update movie error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Delete a movie
// @route   DELETE /api/v1/movies/:id
// @access  Private/Admin
export const deleteMovie = async (req: Request, res: Response): Promise<void> => {
    try {
        // Check if movie exists
        const [existingRows] = await pool.execute("SELECT * FROM movies WHERE movie_id = ?", [req.params.id]);

        if (!Array.isArray(existingRows) || existingRows.length === 0) {
            res.status(404).json({ error: "Movie not found" });
            return;
        }

        // Delete movie
        await pool.execute("DELETE FROM movies WHERE movie_id = ?", [req.params.id]);

        res.json({ message: "Movie removed" });
    } catch (error) {
        console.error("Delete movie error:", error);
        res.status(500).json({ error: "Server error" });
    }
};