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
            query += " AND (title LIKE ? OR description LIKE ? OR imdb_id LIKE ?)";
            queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (genre) {
            query += `
            AND movie_id IN (
                SELECT movie_id 
                FROM movie_genre mg
                JOIN genres g ON mg.genre_id = g.genre_id
                WHERE LOWER(g.name) = ?
            )`;
            queryParams.push(genre.toString().toLowerCase());
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

        // Add slug, genres, and media to each movie
        const moviesWithDetails = await Promise.all(
            Array.isArray(rows)
                ? rows.map(async (movie: any) => {
                    // Fetch genres for the movie
                    const [genreRows] = await pool.execute(
                        `
                        SELECT g.genre_name
                        FROM movie_genre mg
                        JOIN genres g ON mg.genre_id = g.genre_id
                        WHERE mg.movie_id = ?
                        `,
                        [movie.movie_id]
                    );

                    const genres = Array.isArray(genreRows)
                        ? genreRows.map((g: any) => g.genre_name)
                        : [];

                    // Fetch media for the movie
                    const [mediaRows] = await pool.execute(
                        "SELECT * FROM media WHERE movie_id = ?",
                        [movie.movie_id]
                    );

                    const media = Array.isArray(mediaRows) ? mediaRows : [];

                    return {
                        ...movie,
                        slug: slugify(movie.title, { lower: true }),
                        genres,
                        media,
                    };
                })
                : []
        );

        res.json(moviesWithDetails);
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

        // Get genres for this movie
        const [genreRows] = await pool.execute(
            `
            SELECT g.genre_name
            FROM movie_genre mg
            JOIN genres g ON mg.genre_id = g.genre_id
            WHERE mg.movie_id = ?
            `,
            [movie.movie_id]
        );

        movie.genres = Array.isArray(genreRows) ? genreRows.map((g: any) => g.genre_name) : [];

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
        const { title, poster, description, release_year, genre, duration, is_available, tmdb_id } = req.body;

        if (!title || typeof title !== "string" || title.trim() === "") {
            res.status(400).json({ error: "Title is required" });
            return;
        }

        // Insert movie
        const [result] = await pool.execute(
            "INSERT INTO movies (title, poster, description, release_year, duration, is_available, tmdb_id) VALUES (?, ?, ?, ?, ?, ?, ?)",
            [
                title,
                poster || null,
                description || null,
                release_year || null,
                duration || null,
                is_available ? 1 : 0,
                tmdb_id || null,
            ],
        );

        const insertResult = result as any;

        if (insertResult.insertId) {
            const movieId = insertResult.insertId;

            // Handle genres
            if (genre && typeof genre === "string") {
                const genres = genre.split(",").map((g: string) => g.trim().toLowerCase());

                for (const g of genres) {
                    // Check if genre exists
                    const [existingGenreRows] = await pool.execute("SELECT * FROM genres WHERE LOWER(name) = ?", [g]);

                    let genreId;
                    if (Array.isArray(existingGenreRows) && existingGenreRows.length > 0) {
                        genreId = (existingGenreRows[0] as any).genre_id;
                    } else {
                        // Insert new genre
                        const [genreResult] = await pool.execute("INSERT INTO genres (name) VALUES (?)", [g]);
                        genreId = (genreResult as any).insertId;
                    }

                    // Link movie and genre
                    await pool.execute("INSERT INTO movie_genre (movie_id, genre_id) VALUES (?, ?)", [movieId, genreId]);
                }
            }

            // Get the created movie
            const [rows] = await pool.execute("SELECT * FROM movies WHERE movie_id = ?", [movieId]);

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

// TODO: Create a view for getting movies with media and genres included

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
            updateFields.push("tmdb_id = ?");
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