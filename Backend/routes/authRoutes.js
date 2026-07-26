import express from "express";
import {registerUser, loginUser, getProfileUser} from "../Controllers/authController.js";
import {protect} from "../middlewares/authMiddleware.js"


const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/profile", protect, getProfileUser);

export default router;