import mongoose from "mongoose";

const productSchema =
    new mongoose.Schema(
        {
            productName: {
                type: String,
                required: true,
                trim: true,
            },

            description: {
                type: String,
                required: true,
                trim: true,
            },

            category: {
                type: String,
                required: true,
                trim: true,
            },

            price: {
                type: Number,
                required: true,
                min: 0,
            },

            stock: {
                type: Number,
                required: true,
                default: 0,
                min: 0,
            },

            image: {
                type: String,
                default: "",
            },

            seller: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
                required: true,
            },
        },
        {
            timestamps: true,
        }
    );

const Product =
    mongoose.model(
        "Product",
        productSchema
    );

export default Product;