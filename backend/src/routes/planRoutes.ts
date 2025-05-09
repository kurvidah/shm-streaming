import express from "express"
import { getPlans, getPlanById } from "../controllers/planController"

const router = express.Router()

router
    .route("/")
    .get(getPlans)

router
    .route("/:id")
    .get(getPlanById)

export const planRoutes = router