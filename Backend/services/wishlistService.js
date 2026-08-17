import Wishlist from "../models/Wishlist.js";
import Product from "../models/Product.js";

export const addToWishlistService = async (productId, userId) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new Error("Product not found");
    }
    let wishlist = await Wishlist.findOne({
        user: userId,
    });

    if (!wishlist) {
        wishlist = await Wishlist.create({
            user: userId,
            products: [productId],
        });
        return wishlist;
    }

    const alreadyExists = wishlist.products.some(
        (id) => id.toString() === productId.toString()
    );

    if (alreadyExists) {
        throw new Error("Product already in wishlist");
    }

    wishlist.products.push(productId);
    await wishlist.save();
    return wishlist;
};

export const getWishlistService = async (userId) => {

    const wishlist = await Wishlist.findOne({
        user: userId,
    }).populate({
        path: "products",
        select: "productName price image category stock description",
        populate: {
            path: "seller",
            select: "shopName city state pincode",
        },
    });

    if (!wishlist) {
        return {
            user: userId,
            products: [],
        };
    }

    return wishlist;
};

export const removeFromWishlistService = async (productId, userId) => {
    const wishlist = await Wishlist.findOne({
        user: userId,
    });

    if (!wishlist) {
        return {
            user: userId,
            products: [],
        };
    }

    const productExists = wishlist.products.some(
        (id) => id.toString() === productId.toString()
    );

    if (!productExists) {
        throw new Error("Product not found in wishlist");
    }

    wishlist.products = wishlist.products.filter(
        (id) => id.toString() !== productId.toString()
    );

    await wishlist.save();
    return wishlist;
};