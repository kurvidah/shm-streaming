import express from "express"
import { admin } from "../middleware/authMiddleware"
import { deleteBill, getBill, getBillById, updateBill } from "../controllers/billController"

const router = express.Router()

router
    .route("/")
    .get(admin, getBill)
    
router
    .route("/:id")
    .get(admin, getBillById)
    .put(admin, updateBill)
    .delete(admin, deleteBill)

export const billRoutes = router