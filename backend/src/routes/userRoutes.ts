import express from "express"
import { deleteSelf, deleteUser, getSelf, getUserById, getUsers, updateSelf, updateUser } from "../controllers/userController"
import { admin, mod, protect } from "../middleware/authMiddleware"

const router = express.Router()

router
    .route("/")
    .get(mod, getUsers)

router
    .route("/me")
    .get(protect, getSelf)
    .put(protect, updateSelf)
    .delete(protect, deleteSelf)

router
    .route("/:id")
    .get(mod, getUserById)
    .put(admin, updateUser)
    .delete(admin, deleteUser)

export const userRoutes = router