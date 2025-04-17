import express from "express"
import { getMovies, getMovieById, createMovie, updateMovie, deleteMovie } from "../controllers/movieController"
import { protect, admin } from "../middleware/authMiddleware"

const router = express.Router()

router.route("/").get(getMovies, protect).post(createMovie)

router.route("/:id").get(getMovieById).put(updateMovie).delete(deleteMovie)

export const movieRoutes = router
