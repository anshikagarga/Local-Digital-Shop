import express from "express";


const {register} = require("../Controllers/authController.js");
const router = express.Router();

router.post("/register", registerUser);

export default router;