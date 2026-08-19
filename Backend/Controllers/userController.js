import {
    updateProfileService,
    changePasswordService,getSellerSettingsService,
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
        const user = await User.findById(req.user._id).select(
            "sellerSettings"
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        res.status(200).json({
            success: true,
            data: user.sellerSettings,
        });
    } catch (error) {
        console.error("GET SELLER SETTINGS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};


// ==========================================
// UPDATE SELLER SETTINGS
// ==========================================

export const updateSellerSettings = async (req, res) => {
    try {
        const {
            online,
            notifications,
            orderAlerts,
            emailUpdates,
        } = req.body;

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found",
            });
        }

        if (user.role !== "seller") {
            return res.status(403).json({
                success: false,
                message: "Only sellers can update seller settings",
            });
        }

        user.sellerSettings = {
            online:
                typeof online === "boolean"
                    ? online
                    : user.sellerSettings?.online ?? true,

            notifications:
                typeof notifications === "boolean"
                    ? notifications
                    : user.sellerSettings?.notifications ?? true,

            orderAlerts:
                typeof orderAlerts === "boolean"
                    ? orderAlerts
                    : user.sellerSettings?.orderAlerts ?? true,

            emailUpdates:
                typeof emailUpdates === "boolean"
                    ? emailUpdates
                    : user.sellerSettings?.emailUpdates ?? false,
        };

        await user.save();

        res.status(200).json({
            success: true,
            message: "Seller settings updated successfully",
            data: user.sellerSettings,
        });
    } catch (error) {
        console.error("UPDATE SELLER SETTINGS ERROR:", error);

        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};