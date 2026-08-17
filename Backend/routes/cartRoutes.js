import express from "express";
import {addToCart, getCart,updateCartQuantity, removeFromCart, clearCart } from "../Controllers/cartController.js";


import {protect} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addToCart);
router.get("/", protect, getCart);
router.put("/", protect, updateCartQuantity);
router.delete("/:productId", protect, removeFromCart);
router.delete("/", protect, clearCart);

export default router;