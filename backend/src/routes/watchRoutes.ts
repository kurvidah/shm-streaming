import express from "express"
import { protect } from "../middleware/authMiddleware"
import { serveMedia } from "../controllers/watchController"

const router = express.Router()

router
    .route("/:id")
    .get(protect, serveMedia)

export const watchRoutes = router