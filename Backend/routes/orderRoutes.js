import express from "express";

import {
    createOrder,
    getMyOrders,
    getOrderById,
    cancelOrder,
    updateOrderStatus,
} from "../Controllers/orderController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createOrder);

router.get("/", protect, getMyOrders);

router.get("/:orderId", protect, getOrderById);

router.patch(
    "/:orderId/cancel",
    protect,
    cancelOrder
);

router.patch(
    "/:orderId/status",
    protect,
    updateOrderStatus
);

export default router;