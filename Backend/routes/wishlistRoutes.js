import express from "express";

import {
    addToWishlist,
    getWishlist,
    removeFromWishlist
} from "../Controllers/wishlistController.js";

import { protect } from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:productId", protect, addToWishlist);

router.get("/", protect, getWishlist);
router.delete("/:productId", protect, removeFromWishlist);

export default router;