import express from "express"
import { protect } from "../middleware/authMiddleware"
import { getById, getAll } from "../controllers/crudController.ts"

const router = express.Router()

router
    .route("/")
    .get(protect, getAll("media"))

router
    .route("/:id")
    .get(protect, getById("media", "media_id"))

export const mediaRoutes = router