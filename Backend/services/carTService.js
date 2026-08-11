import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

export const addToCartService = async (userId, productId, quantity) => {

    // 1. Product check
    const product = await Product.findById(productId);

    if (!product) {
        throw new Error("Product not found");
    }

    // 2. Quantity validation
    if (quantity < 1) {
        throw new Error("Quantity must be at least 1");
    }

    // 3. Stock check
    if (product.stock < quantity) {
        throw new Error("Insufficient stock");
    }

    // 4. Find user's cart
    let cart = await Cart.findOne({
        user: userId,
    });

    // 5. Cart doesn't exist → create
    if (!cart) {
        cart = await Cart.create({
            user: userId,
            items: [
                {
                    product: productId,
                    productName: product.productName,
                    price: product.price,
                    quantity: quantity,
                },
            ],
        });

        return cart;
    }

    // 6. Check whether product already exists
    const existingItem = cart.items.find(
        (item) => item.product.toString() === productId.toString()
    );

    // 7. Product already in cart
    if (existingItem) {

        const newQuantity = existingItem.quantity + quantity;

        if (newQuantity > product.stock) {
            throw new Error("Insufficient stock");
        }

        existingItem.quantity = newQuantity;

    } else {

        // 8. Add new product
        cart.items.push({
            product: productId,
            productName: product.productName,
            price: product.price,
            quantity: quantity,
        });
    }

    // 9. Save cart
    await cart.save();

    return cart;
};

export const getCartService = async (userId) => {
    const cart = await Cart.findOne({
        user: userId,
    }).populate(
        "items.product",
        "productName price image category stock"
    );

    if (!cart) {
        throw new Error("Cart not found");
    }

    return cart;
};

export const updateCartQuantityService = async (
    userId,
    productId,
    quantity
) => {

    const cart = await Cart.findOne({
        user: userId,
    });

    if (!cart) {
        throw new Error("Cart not found");
    }

    const item = cart.items.find(
        (item) => item.product.toString() === productId.toString()
    );

    if (!item) {
        throw new Error("Product not found in cart");
    }

    const product = await Product.findById(productId);

    if (!product) {
        throw new Error("Product not found");
    }

    if (quantity < 1) {
        throw new Error("Quantity must be at least 1");
    }

    if (quantity > product.stock) {
        throw new Error("Insufficient stock");
    }

    item.quantity = quantity;

    await cart.save();

    return cart;
};

export const removeFromCartService = async (userId, productId) => {

    const cart = await Cart.findOne({
        user: userId,
    });

    if (!cart) {
        throw new Error("Cart not found");
    }

    const productExists = cart.items.some(
        (item) => item.product.toString() === productId.toString()
    );

    if (!productExists) {
        throw new Error("Product not found in cart");
    }

    cart.items = cart.items.filter(
        (item) => item.product.toString() !== productId.toString()
    );

    await cart.save();

    return cart;
};

export const clearCartService = async (userId) => {

    const cart = await Cart.findOne({
        user: userId,
    });

    if (!cart) {
        throw new Error("Cart not found");
    }

    cart.items = [];

    await cart.save();

    return cart;
};