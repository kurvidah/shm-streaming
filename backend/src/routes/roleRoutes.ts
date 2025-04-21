import express from "express"
import { admin } from "../middleware/authMiddleware"
import { createRoles, deleteRole, getRoles } from "../controllers/roleController"

const router = express.Router()

router
    .route("/")
    .get(admin, getRoles)
    .post(admin, createRoles)

router
    .route("/:id")
    .delete(admin, deleteRole)


export const roleRoutes = router

