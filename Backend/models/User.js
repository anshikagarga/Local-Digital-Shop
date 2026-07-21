const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            require: true,
            unique : true
        },
        password: {
            type: String,
            required: true
        },
        phone: {
            type: String
        },
        role: {
            type: String,
            enum: ["customer", "shopOwner", "admin"],
            default: "customer"
        }
    }, {
        timeStamps: true
    }
);

module.exports = mongoose.model("user, userSchema");