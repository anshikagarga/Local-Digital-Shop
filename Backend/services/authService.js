import bcrypt from "bcryptjs";
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import { generateToken } from "../Utils/jwt.js";

export const registerService = async (userData) => {
    const existingUser = await User.findOne({
        email: userData.email,
    });

    if (existingUser) {
        throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    userData.password = hashedPassword;

    const user = await User.create(userData);

    const userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

export const loginService = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Invalid email or password");
    }

    const token = generateToken(user._id);



    const userObject = user.toObject();
    delete userObject.password;

    return {
    token,
    user: {
        _id: user._id,
        name: user.name,
        email: user.email,
    },
};
};


export const getProfileService = async (userId) => {

    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw new Error("User not found");
    }

    return user;

};

export const resetPasswordService = async (email, newPassword) => {

    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("User not found");
    }

    const hashedPassword = await bcrypt.hash(
        newPassword,
        10
    );

    user.password = hashedPassword;

    await user.save();

    return {
        message: "Password reset successfully",
    };
};