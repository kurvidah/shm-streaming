import express from "express"
import { deleteUser, getUserById, getUsers, updateUser } from "../controllers/userController"
import { admin, mod, protect } from "../middleware/authMiddleware"

const router = express.Router()

router
    .route("/")
    .get(mod,getUsers)

router
    .route("/:id")
    .get(mod,getUserById)
    .put(admin,updateUser)
    .delete(admin,deleteUser)

export const userRoutes = router