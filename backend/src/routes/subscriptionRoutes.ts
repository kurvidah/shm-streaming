import express from "express"
import { admin, mod, protect } from "../middleware/authMiddleware"
import { getSelfPlan, updateSelfPlan, getUserPlan, updateUserPlan } from "../controllers/subscriptionController"

const router = express.Router()

router
    .route("/")
    .get(protect, getSelfPlan)
    .put(protect, updateSelfPlan)

router.route("/:id")
    .get(mod, getUserPlan)
    .put(mod, updateUserPlan)

export const subscriptionRoutes = router