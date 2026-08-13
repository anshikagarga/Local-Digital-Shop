import express from "express";

import {
    addProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from "../Controllers/productController.js";

import { protect } from "../middlewares/authMiddleware.js";
import upload from "../middlewares/uploadMiddleware.js";

const router = express.Router();

router.post(
    "/",
    protect,
    upload.single("image"),
    addProduct
);

router.get("/", getAllProducts);

router.get("/:id", getProductById);

router.put(
    "/:id",
    protect,
    updateProduct
);

router.delete(
    "/:id",
    protect,
    deleteProduct
);

export default router;