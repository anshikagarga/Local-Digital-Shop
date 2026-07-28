import express from "express"
import {addProduct} from "../Controllers/productController.js"
import {protect} from "../middlewares/authMiddleware.js"

const router = express.Router();

router.post("/", protect, addProduct);

export default router;