import express from "express"
import { protect } from "../middleware/authMiddleware"
import { getWatchHistory } from "../controllers/historyController"

const router = express.Router()

router
    .route("/")
    .get(getWatchHistory)

export const historyRoutes = router