import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
    updateProfile,
    changePassword,
} from "../Controllers/userController.js";

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