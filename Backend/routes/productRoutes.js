import express from "express"
import {addProduct, getAllProducts, getProductById} from "../Controllers/productController.js"
import {protect} from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post("/", protect, addProduct);
router.get("/", getAllProducts);
router.get("/:id", getProductById);

export default router;