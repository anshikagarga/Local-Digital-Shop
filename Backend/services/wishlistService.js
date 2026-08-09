import Wishlist from "../models/wishlist.js";
import Product from "../models/Product.js";

export const addToWishlistService = async (productId, userId) => {
    const Product = await Product.findById(productId);
    if(!product){
        throw new Error("Product not found");
    }
    let wishlist = await Wishlist.findOne({
        user: userId,
    });

    if(!wishlist){
        wishlist = await Wishlist.create({
            user: userId,
            products: [productId],
        });
        return wishlist;
    }

    const alreadyExists = wishlist.products.some(
        (id) => id.toString() === productId.toString()
    );

    wishlist.products.push(productId);
    await wishlist.save();
    return wishlist;
};