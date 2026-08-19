import {
    updateProfileService,
    changePasswordService,
    getSellerSettingsService,
    updateSellerSettingsService
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

// ==========================================
// GET SELLER SETTINGS
// ==========================================

export const getSellerSettings = async (req, res) => {
    try {
        const settings =
            await getSellerSettingsService(
                req.user._id
            );

        res.status(200).json({
            success: true,
            data: settings,
        });
    } catch (error) {
        console.error(
            "GET SELLER SETTINGS ERROR:",
            error
        );

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ==========================================
// UPDATE SELLER SETTINGS
// ==========================================

export const updateSellerSettings = async (
    req,
    res
) => {
    try {
        const settings =
            await updateSellerSettingsService(
                req.user._id,
                req.body
            );

        res.status(200).json({
            success: true,
            message:
                "Seller settings updated successfully",
            data: settings,
        });
    } catch (error) {
        console.error(
            "UPDATE SELLER SETTINGS ERROR:",
            error
        );

        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};