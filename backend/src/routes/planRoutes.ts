import express from "express"
import { admin, protect } from "../middleware/authMiddleware"
import { getPlans, createPlan, getPlanById, updatePlan, deletePlan } from "../controllers/planController"

const router = express.Router()

router
    .route("/")
    .get(getPlans)
    .post(admin, createPlan)

router
    .route("/:id")
    .get(getPlanById)
    .put(admin, updatePlan)
    .delete(admin, deletePlan)

export const planRoutes = router