import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {

    try {

        let token;

        if (
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            console.log("Authorization Header:", req.headers.authorization);
            token = req.headers.authorization.replace("Bearer ", "").trim();
            console.log("Extracted Token:", token);
            console.log("JWT Secret:", process.env.JWT_SECRET); 

            const decoded = jwt.verify(
                token,
                process.env.JWT_SECRET
            );

            console.log("Decoded", decoded);

            const user = await User.findById(decoded.id).select("-password");

            if (!user) {
                console.log("JWT ERROR:", error);
                return res.status(401).json({
                    success: false,
                    message: "User not found"
                });
            }

            req.user = user;

            next();

        } else {

            return res.status(401).json({
                success: false,
                message: "No token provided"
            });

        }

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid Token"
        });

    }

};