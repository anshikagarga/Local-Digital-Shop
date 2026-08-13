import {
    registerService,
    loginService, getProfileService,resetPasswordService
} from "../services/authService.js";

export const registerUser = async (req, res) => {
    try {

        const user = await registerService(req.body);

        res.status(201).json({
            success: true,
            message: "User Registered Successfully",
            data: user,
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }
};

export const loginUser = async (req, res) => {
    try {

        const { email, password } = req.body;

        const result = await loginService(email, password);

        res.status(200).json({
            success: true,
            message: "Login Successful",
            data: result,
        });

    } catch (error) {

        res.status(401).json({
            success: false,
            message: error.message,
        });

    }
};


export const getProfileUser = async (req, res) => {

    try {

        const user = await getProfileService(req.user.id);

        res.status(200).json({
            success: true,
            message: "Profile fetched successfully",
            data: user,
        });

    } catch (error) {

        res.status(404).json({
            success: false,
            message: error.message,
        });

    }

};

export const resetPassword = async (req, res) => {

    try {

        const { email, newPassword } = req.body;

        const result = await resetPasswordService(
            email,
            newPassword
        );

        return res.status(200).json({
            success: true,
            message: result.message,
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};