import express from "express"
import { protect } from "../middleware/authMiddleware"
import { getById, getAll } from "../controllers/crudController.ts"
import { getMediaById, watchEnd } from "../controllers/mediaController.ts"

const router = express.Router()

router
    .route("/")
    .get(protect, getAll("media"))

router
    .route("/:id/meta")
    .get(protect, getById("media", "media_id"))

router
    .route("/:id/watch-end")
    .post(protect, watchEnd)

router
    .route("/:id")
    .get(getMediaById)

export const mediaRoutes = router