import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
        },
        email: {
            type: String,
            require: [true, "Email is required"],
            unique : true,
            lowercase: true,
            trim: true
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: 6,
        },
        phone: {
            type: String,
            required: true,
        },
        role: {
            type: String,
            enum: ["customer", "shopOwner", "admin"],
            default: "customer"
        },
        profileImage: {
            type: String,
            default: "",
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
    }, {
        timeStamps: true
    }
);

const User = mongoose.model("User", userSchema);

module.exports = mongoose.model("user, userSchema");