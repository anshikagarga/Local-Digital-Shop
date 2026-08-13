import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
    updateProfile,
    changePassword,
} from "../controllers/userController.js";

const router = express.Router();

router.put(
    "/profile",
    protect,
    updateProfile
);
router.put(
    "/change-password",
    protect,
    changePassword
);

export default router;