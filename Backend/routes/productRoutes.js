import express from "express"
import {
    addProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
} from "../Controllers/productController.js";
import {protect} from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post("/", protect, addProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);
router.put("/:id", protect, updateProduct);
router.delete("/:id", protect , deleteProduct);

export default router;