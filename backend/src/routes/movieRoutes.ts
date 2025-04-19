import express from "express"
import { getMovies, getMovieById, createMovie, updateMovie, deleteMovie } from "../controllers/movieController"
import { protect, admin, mod } from "../middleware/authMiddleware"

const router = express.Router()

router
    .route("/")
    .get(getMovies)
    .post(mod, createMovie)

router
    .route("/:id")
    .get(getMovieById)
    .put(mod, updateMovie)
    .delete(mod, deleteMovie)

export const movieRoutes = router