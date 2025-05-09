import express from "express"
import { deleteSelf, deleteUser, getSelf, getUserById, getUsers, updateSelf, updateSelfPassword, updateUser } from "../controllers/userController"
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

export const userRoutes = router