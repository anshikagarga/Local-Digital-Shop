import {
    updateProfileService,
    changePasswordService,
} from "../services/userService.js";

export const updateProfile = async (req, res) => {

    try {

        const user = await updateProfileService(
            req.user._id,
            req.body
        );

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: user,
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const changePassword = async (req, res) => {

    try {

        await changePasswordService(
            req.user._id,
            req.body.currentPassword,
            req.body.newPassword
        );

        return res.status(200).json({
            success: true,
            message: "Password changed successfully",
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};