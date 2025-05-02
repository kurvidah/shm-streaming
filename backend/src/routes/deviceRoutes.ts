import express from "express"
import { admin, mod, protect } from "../middleware/authMiddleware"
import { deleteDevice, getDeviceById, getDevices, updateDevice } from "../controllers/deviceController"

const router = express.Router()

router
    .route("/")
    .get(mod, getDevices)

router
    .route("/:id")
    .get(mod, getDeviceById)
    .put(admin, updateDevice)
    .delete(admin, deleteDevice)

export const deviceRoutes = router