import express from "express"
import { protect } from "../middleware/authMiddleware"
import { getById, getAll } from "../controllers/crudController.ts"
import { getMediaById, updateWatchDuration } from "../controllers/mediaController.ts"

const router = express.Router()

router
    .route("/")
    .get(protect, getAll("media"))

router
    .route("/:id")
    .get(protect, getMediaById)

router
    .route("/:id/info")
    .post(protect, getById("media", "media_id"))

export const mediaRoutes = router