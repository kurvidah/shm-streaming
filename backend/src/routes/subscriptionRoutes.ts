import express from "express"
import { admin, mod, protect } from "../middleware/authMiddleware"
import { getActivePlan, updatePlan, getUserPlan, updateUserPlan } from "../controllers/subscriptionController"

const router = express.Router()

router
    .route("/")
    .get(protect, getActivePlan)
    .put(protect, updatePlan)

export const subscriptionRoutes = router