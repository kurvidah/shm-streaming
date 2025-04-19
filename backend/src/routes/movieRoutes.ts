import express from "express"
import { getMovies, getMovieById, createMovie, updateMovie, deleteMovie } from "../controllers/movieController"
import { protect, admin, mod } from "../middleware/authMiddleware"

const router = express.Router()

router.route("/").get(getMovies).post(admin, createMovie)

router.route("/:id").get(protect, getMovieById).put(mod, updateMovie).delete(mod, deleteMovie)

export const movieRoutes = router