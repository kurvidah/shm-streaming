import express from "express"
import { admin, protect } from "../middleware/authMiddleware"
import { deleteBill, getBill, getBillById, getSelfBills, payBill, updateBill } from "../controllers/billController"

const router = express.Router()

router
    .route("/")
    .get(admin, getBill)

router
    .route("/pay")
    .get(protect, getSelfBills)
    .post(protect, payBill)
    
router
    .route("/:id")
    .get(admin, getBillById)
    .put(admin, updateBill)
    .delete(admin, deleteBill)

export const billRoutes = router