import express from "express"
import { admin, mod, protect } from "../middleware/authMiddleware"
import { getDeviceById, getDevices } from "../controllers/deviceController"

const router = express.Router()

router
    .route("/")
    .get(mod, getDevices)

router
    .route("/:id")
    .get(mod, getDeviceById)

export const deviceRoutes = router