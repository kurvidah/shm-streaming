import express from "express"
import { admin } from "../middleware/authMiddleware"
import { createMedia, deleteMedia, getMedia, getMediaById, updateMedia } from "../controllers/mediaController"

const router = express.Router()

router
    .route("/")
    .get(getMedia)
    .post(admin, createMedia)

router
    .route("/:id")
    .get(getMediaById)
    .put(admin, updateMedia)
    .delete(admin, deleteMedia)

export const mediaRoutes = router