import express from "express";
import {registerUser, loginUser, getProfileUser,resetPassword} from "../Controllers/authController.js";
import {protect} from "../middlewares/authMiddleware.js"


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfileUser);
router.post(
    "/reset-password",
    resetPassword
);

export default router;