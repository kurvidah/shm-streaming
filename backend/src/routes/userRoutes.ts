import express from "express"
import { deleteDevice, deleteSelf, deleteUser, getSelf, getUserById, getUsers, updateSelf, updateSelfPassword, updateUser } from "../controllers/userController"
import { protect } from "../middleware/authMiddleware"

const router = express.Router()

router
    .route("/update-password")
    .put(protect, updateSelfPassword)

router
    .route("/")
    .get(protect, getSelf)
    .put(protect, updateSelf)
    .delete(protect, deleteSelf)

router
    .route("/device/:id")
    .delete(protect, deleteDevice)

export const userRoutes = router