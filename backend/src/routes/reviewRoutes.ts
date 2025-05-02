import express from "express"
import { admin, protect } from "../middleware/authMiddleware"
import { createReview, deleteReview, getReview, getReviewById } from "../controllers/reviewController"

const router = express.Router()

router
    .route("/")
    .get(getReview)
    .post(createReview)
    
router
    .route("/:id")
    .get(admin, getReviewById)
    .delete(admin, deleteReview)

export const reviewRoutes = router