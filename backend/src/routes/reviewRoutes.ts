import express from "express"
import { protect } from "../middleware/authMiddleware"
import { createReview, getReviews} from "../controllers/reviewController"

const router = express.Router()

router
    .route("/")
    .get(getReviews)
    .post(protect, createReview)

export const reviewRoutes = router