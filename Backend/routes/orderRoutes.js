import express from "express";
import {placeOrder, getMyOrders, getOrderById, cancelOrder} from "../controllers/orderController.js";
import {protect} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, placeOrder);
router.get("/", protect, getMyOrders);
router.get("/:id", protect, getOrderById);
router.patch("/:id/cancel", protect, cancelOrder);
export default router;