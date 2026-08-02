import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const addToCartService = async (userId, productId) => {

    // Check product exists
    const product = await Product.findById(productId);

    if (!product) {
        throw new Error("Product not found");
    }

    // Check if already in cart
    const existingCartItem = await Cart.findOne({
        user: userId,
        product: productId,
    });

    if (existingCartItem) {

        existingCartItem.quantity += 1;

        await existingCartItem.save();

        return existingCartItem;
    }

    // Create new cart item
    const cart = await Cart.create({
        user: userId,
        product: productId,
        quantity: 1,
    });

    return cart;
};