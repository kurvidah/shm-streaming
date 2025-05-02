import express from "express"
import { admin, protect } from "../middleware/authMiddleware"
import { getPlan, createPlan, getPlanById, updatePlan, deletePlan, getSelfPlan } from "../controllers/planController"

const router = express.Router()

router
    .route("/")
    .get(getPlan)
    .post(admin, createPlan)

router
    .route("/me")
    .get(protect, getSelfPlan)
    
router
    .route("/:id")
    .get(getPlanById)
    .put(admin, updatePlan)
    .delete(admin, deletePlan)

export const planRoutes = router