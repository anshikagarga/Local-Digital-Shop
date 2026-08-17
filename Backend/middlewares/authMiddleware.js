import jwt from "jsonwebtoken";
import User from "../models/User.js";

const getAuthErrorMessage = (error) => {
    if (error.name === "TokenExpiredError") {
        return "Your session has expired. Please login again.";
    }

    if (
        error.name === "JsonWebTokenError" ||
        error.message?.includes("jwt")
    ) {
        return "Your session has expired. Please login again.";
    }

    return "Authentication failed. Please login again.";
};

export const protect = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                success: false,
                message: "No token provided",
            });
        }

        const token = authHeader.replace("Bearer ", "").trim();

        if (!token || token === "null" || token === "undefined") {
            return res.status(401).json({
                success: false,
                message: "Your session has expired. Please login again.",
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User not found",
            });
        }

        req.user = user;
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: getAuthErrorMessage(error),
        });
    }
};
