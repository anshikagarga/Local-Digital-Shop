import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const registerService = async (userData) => {

    const existingUser = await User.findOne({
        email: userData.email,
    });

    if (existingUser) {
        throw new Error("Email already exists");
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(userData.password, 10);

    // Replace original password
    userData.password = hashedPassword;

    // Save User
    const user = await User.create(userData);

    const userObject = user.toObject();
    delete userObject.password;

    return userObject;
};

