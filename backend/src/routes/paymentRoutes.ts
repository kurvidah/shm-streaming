import express from "express"
import { protect } from "../middleware/authMiddleware"
import { getBills, payBill } from "../controllers/paymentController"

const router = express.Router()

router
    .route("/")
    .get(protect, getBills)
    .post(protect, payBill)

export const paymentRoutes = router