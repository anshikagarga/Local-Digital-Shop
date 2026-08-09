import express from "express";
import {addToWishlist} from "../Controllers/wishlistController.js";
import {protect} from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/:productId", protect, addToWishlist);

export default router;