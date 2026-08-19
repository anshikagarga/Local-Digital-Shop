import bcrypt from "bcryptjs";
import User from "../models/User.js";

export const updateProfileService = async (userId, updateData) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    if (updateData.email) {

        const existingUser = await User.findOne({
            email: updateData.email,
            _id: { $ne: userId },
        });

        if (existingUser) {
            throw new Error("Email already exists");
        }
    }

    if (updateData.name) user.name = updateData.name;
    if (updateData.email) user.email = updateData.email;
    if (updateData.phone !== undefined) user.phone = updateData.phone;
    if (updateData.address !== undefined) user.address = updateData.address;
    if (updateData.city !== undefined) user.city = updateData.city;
    if (updateData.state !== undefined) user.state = updateData.state;
    if (updateData.pincode !== undefined) user.pincode = updateData.pincode;
    if (updateData.shopName !== undefined) user.shopName = updateData.shopName;
    if (updateData.role && ["customer", "seller"].includes(updateData.role)) {
        user.role = updateData.role;
    }

    await user.save();

    const userObject = user.toObject();

    delete userObject.password;

    return userObject;
};


export const changePasswordService = async (
    userId,
    currentPassword,
    newPassword
) => {

    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(
        currentPassword,
        user.password
    );

    if (!isMatch) {
        throw new Error("Current password is incorrect");
    }

    if (currentPassword === newPassword) {
        throw new Error(
            "New password must be different from current password"
        );
    }

    user.password = await bcrypt.hash(
        newPassword,
        10
    );

    await user.save();

    return true;
};

// ==========================================
// GET SELLER SETTINGS
// ==========================================

export const getSellerSettingsService = async (userId) => {
    const user = await User.findById(userId).select(
        "sellerSettings role"
    );

    if (!user) {
        throw new Error("User not found");
    }

    if (user.role !== "seller") {
        throw new Error("Only sellers can access seller settings");
    }

    return {
        online: user.sellerSettings?.online ?? true,
        notifications:
            user.sellerSettings?.notifications ?? true,
        orderAlerts:
            user.sellerSettings?.orderAlerts ?? true,
        emailUpdates:
            user.sellerSettings?.emailUpdates ?? false,
    };
};


// ==========================================
// UPDATE SELLER SETTINGS
// ==========================================

export const updateSellerSettingsService = async (
    userId,
    settings
) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new Error("User not found");
    }

    if (user.role !== "seller") {
        throw new Error(
            "Only sellers can update seller settings"
        );
    }

    user.sellerSettings = {
        online:
            typeof settings.online === "boolean"
                ? settings.online
                : user.sellerSettings?.online ?? true,

        notifications:
            typeof settings.notifications === "boolean"
                ? settings.notifications
                : user.sellerSettings?.notifications ?? true,

        orderAlerts:
            typeof settings.orderAlerts === "boolean"
                ? settings.orderAlerts
                : user.sellerSettings?.orderAlerts ?? true,

        emailUpdates:
            typeof settings.emailUpdates === "boolean"
                ? settings.emailUpdates
                : user.sellerSettings?.emailUpdates ?? false,
    };

    await user.save();

    return user.sellerSettings;
};