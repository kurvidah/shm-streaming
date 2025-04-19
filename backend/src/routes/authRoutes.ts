import express from "express"
import { login, register } from "../controllers/authController.ts"

const router = express.Router()

// Register routes with descriptions
router.route("/login").post(login)

router.route("/register").post(register)

export const authRoutes = router
