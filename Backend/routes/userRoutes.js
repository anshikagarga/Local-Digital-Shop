import express from "express";
import { protect } from "../middlewares/authMiddleware.js";
import {
    updateProfile,
    changePassword,
    getSellerSettings,
    updateSellerSettings
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
router.get(
    "/seller-settings",
    protect,
    getSellerSettings
);

router.put(
    "/seller-settings",
    protect,
    updateSellerSettings
);

export default router;