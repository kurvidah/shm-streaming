import express from "express"
import { getMovies, getMovieById, createMovie, updateMovie, deleteMovie, getFeaturedMovies } from "../controllers/movieController"
import { protect, admin, mod } from "../middleware/authMiddleware"

const router = express.Router()

router
    .route("/")
    .get(getMovies)

router
    .route("/featured")
    .get(getFeaturedMovies)

router
    .route("/:id")
    .get(getMovieById)

export const movieRoutes = router