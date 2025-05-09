import type { Request, Response } from "express";
import pool from "../db";
import slugify from "../utils/slugify";

// Helper: Get genres for a movie
async function getGenresForMovie(movieId: number): Promise<string[]> {
    const [rows] = await pool.execute(
        `SELECT g.genre_name FROM movie_genre mg JOIN genres g ON mg.genre_id = g.genre_id WHERE mg.movie_id = ?`,
        [movieId]
    );
    return Array.isArray(rows) ? rows.map((r: any) => r.genre_name) : [];
}

// Helper: Get media for a movie
async function getMediaForMovie(movieId: number): Promise<any[]> {
    const [rows] = await pool.execute(`SELECT * FROM media WHERE movie_id = ?`, [movieId]);
    return Array.isArray(rows) ? rows : [];
}

// Helper: Get views for a movie
async function getMovieViews(movieId: number): Promise<number> {
    const [rows] = await pool.execute(
        `SELECT COUNT(DISTINCT user_id) AS views FROM watch_history WHERE media_id IN (SELECT media_id FROM media WHERE movie_id = ?)`,
        [movieId]
    );
    return Array.isArray(rows) && rows.length > 0 ? (rows[0] as any).views : 0;
}

// Helper: Get rating for a movie
async function getMovieRating(movieId: number): Promise<number> {
    const [rows] = await pool.execute(
        `SELECT AVG(rating) AS rating FROM reviews WHERE movie_id = ?`,
        [movieId]
    );
    return Array.isArray(rows) && rows.length > 0 ? (rows[0] as any).rating : 0;
}

// Helper: Format a movie row into full object
async function formatMovie(row: any): Promise<any> {
    const movie = {
        movie_id: row.movie_id,
        title: row.title,
        description: row.description,
        release_year: row.release_year,
        duration: row.duration,
        is_available: row.is_available,
        imdb_id: row.imdb_id,
        poster: row.poster,
        tmdb_id: row.tmdb_id,
        slug: slugify(row.title, { lower: true }),
        rating: await getMovieRating(row.movie_id),
        genres: await getGenresForMovie(row.movie_id),
        media: await getMediaForMovie(row.movie_id),
        views: await getMovieViews(row.movie_id)
    };
    return movie;
}

// Helper: Insert genre if it doesn't exist and return genre_id
async function getOrCreateGenreId(genreName: string): Promise<number> {
    const [existingRows] = await pool.execute(
        "SELECT genre_id FROM genres WHERE LOWER(genre_name) = ?",
        [genreName.toLowerCase()]
    );

    if (Array.isArray(existingRows) && existingRows.length > 0) {
        return (existingRows[0] as any).genre_id;
    }

    const [insertResult] = await pool.execute("INSERT INTO genres (genre_name) VALUES (?)", [genreName]);
    return (insertResult as any).insertId;
}

// Helper: Link movie with genres
async function linkMovieWithGenres(movieId: number, genres: string[]): Promise<void> {
    for (const genre of genres) {
        const genreId = await getOrCreateGenreId(genre);
        await pool.execute(
            "INSERT INTO movie_genre (movie_id, genre_id) VALUES (?, ?)",
            [movieId, genreId]
        );
    }
}

// @desc    Get featured movies
// @route   GET /api/v1/movies
// @access  Public
export const getFeaturedMovies = async (req: Request, res: Response): Promise<void> => {
    try {
        // Popularity = (views * 0.7) + (rating * 30) + recency

        const [rows] = await pool.execute(
            `SELECT m.*, (COUNT(DISTINCT wh.user_id) * 0.7 + AVG(r.rating) * 30) AS popularity
             FROM movies m
             LEFT JOIN media me ON m.movie_id = me.movie_id
             LEFT JOIN watch_history wh ON me.media_id = wh.media_id
             LEFT JOIN reviews r ON m.movie_id = r.movie_id
             WHERE m.is_available = 1
             GROUP BY m.movie_id
             ORDER BY popularity DESC
             LIMIT 10`
        );
        // console.log("Hello")

        const movies = await Promise.all((rows as any[]).map(formatMovie));

        res.json(movies);
    } catch (error) {
        console.error("Get featured movies error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Get all movies
// @route   GET /api/v1/movies
// @access  Public
export const getMovies = async (req: Request, res: Response): Promise<void> => {
    try {
        const { search, genre, release_year, is_available } = req.query;

        let query = `SELECT DISTINCT m.* FROM movies m `;
        const queryParams: any[] = [];

        if (genre) {
            query += `
        JOIN movie_genre mg ON m.movie_id = mg.movie_id
        JOIN genres g ON mg.genre_id = g.genre_id
        WHERE LOWER(g.genre_name) = ?`;
            queryParams.push(genre.toString().toLowerCase());
        } else {
            query += `WHERE 1=1`;
        }

        if (search) {
            query += ` AND (m.title LIKE ? OR m.description LIKE ? OR m.imdb_id LIKE ?)`;
            queryParams.push(`%${search}%`, `%${search}%`, `%${search}%`);
        }

        if (release_year) {
            query += ` AND m.release_year = ?`;
            queryParams.push(release_year);
        }

        if (is_available !== undefined) {
            query += ` AND m.is_available = ?`;
            queryParams.push(is_available === "true" ? 1 : 0);
        }

        const [rows] = await pool.execute(query, queryParams);

        const movies = await Promise.all((rows as any[]).map(formatMovie));

        if (movies.length === 0) {
            res.status(404).json({ error: "No movies found" });
            return;
        }

        const movieCount = movies.length;
        res.json({ count: movieCount, movies });
    } catch (error) {
        console.error("Get movies error:", error);
        res.status(500).json({ error: "Server error" });
    }
};

// @desc    Get movie by ID or slug
// @route   GET /api/v1/movies/:id
// @access  Public
export const getMovieById = async (req: Request, res: Response): Promise<void> => {
    try {
        const { id } = req.params;
        const isNumeric = /^\d+$/.test(id);

        let query = isNumeric
            ? `SELECT * FROM movies WHERE movie_id = ?`
            : `SELECT * FROM movies WHERE LOWER(REPLACE(title, " ", "-")) = ?`;

        const queryParams = [isNumeric ? id : id.toLowerCase()];

        const [rows] = await pool.execute(query, queryParams);

        if (!Array.isArray(rows) || rows.length === 0) {
            res.status(404).json({ error: "Movie not found" });
            return;
        }

        const movie = await formatMovie(rows[0]);
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
        const {
            title,
            poster,
            description,
            release_year,
            genres,
            duration,
            is_available,
            tmdb_id,
        } = req.body;

        if (!title || typeof title !== "string" || title.trim() === "") {
            res.status(400).json({ error: "Title is required" });
            return;
        }

        const [result] = await pool.execute(
            `INSERT INTO movies (title, poster, description, release_year, duration, is_available, tmdb_id)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
                title,
                poster || null,
                description || null,
                release_year || null,
                duration || null,
                is_available ? 1 : 0,
                tmdb_id || null,
            ]
        );

        const insertResult = result as any;
        const movieId = insertResult.insertId;

        if (!movieId) {
            res.status(400).json({ error: "Failed to create movie" });
            return;
        }

        if (genres) {
            await linkMovieWithGenres(movieId, genres);
        }

        const [rows] = await pool.execute("SELECT * FROM movies WHERE movie_id = ?", [movieId]);

        if (!Array.isArray(rows) || rows.length === 0) {
            res.status(404).json({ error: "Movie not found after creation" });
            return;
        }

        const movie = rows[0] as any;
        movie.slug = slugify(movie.title, { lower: true });

        res.status(201).json(movie);
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
        const { title, poster, description, release_year, genres, duration, is_available, imdb_id } = req.body;
        const movieId = Number(req.params.id);

        console.log(req.body.genres)

        // Check if movie exists
        const [existingRows] = await pool.execute("SELECT * FROM movies WHERE movie_id = ?", [movieId]);

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
        if (genres) {
            await pool.execute("DELETE FROM movie_genre WHERE movie_id = ?", [movieId]);
            await linkMovieWithGenres(movieId, genres);
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

        if (updateFields.length === 0 && !genres) {
            res.status(400).json({ error: "No fields to update" });
            return;
        }
        else if (updateFields.length > 0) {
            // Add movie_id to values
            updateValues.push(req.params.id);

            // Update movie
            await pool.execute(`UPDATE movies SET ${updateFields.join(", ")} WHERE movie_id = ?`, updateValues);
        }

        // Get updated movie
        const [updatedRows] = await pool.execute("SELECT * FROM movies WHERE movie_id = ?", [req.params.id]);

        if (Array.isArray(updatedRows) && updatedRows.length > 0) {
            const movie = await formatMovie(updatedRows[0]);

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