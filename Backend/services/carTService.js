import Cart from "../models/Cart.js";
import Product from "../models/Product.js";

// ==========================================
// ADD TO CART
// ==========================================

export const addToCartService = async (
    userId,
    productId,
    quantity
) => {
    const product =
        await Product.findById(
            productId
        );

    if (!product) {
        throw new Error(
            "Product not found"
        );
    }

    quantity = Number(quantity);

    if (quantity < 1) {
        throw new Error(
            "Quantity must be at least 1"
        );
    }

    if (
        product.stock < quantity
    ) {
        throw new Error(
            "Insufficient stock"
        );
    }

    let cart =
        await Cart.findOne({
            user: userId,
        });

    if (!cart) {
        cart =
            await Cart.create({
                user: userId,

                items: [
                    {
                        product:
                            productId,

                        productName:
                            product.productName,

                        price:
                            product.price,

                        quantity,
                    },
                ],
            });

        return cart;
    }

    const existingItem =
        cart.items.find(
            (item) =>
                item.product.toString() ===
                productId.toString()
        );

    if (existingItem) {
        const newQuantity =
            existingItem.quantity +
            quantity;

        if (
            newQuantity >
            product.stock
        ) {
            throw new Error(
                "Insufficient stock"
            );
        }

        existingItem.quantity =
            newQuantity;

        // Keep cart data synced
        existingItem.productName =
            product.productName;

        existingItem.price =
            product.price;
    } else {
        cart.items.push({
            product: productId,

            productName:
                product.productName,

            price:
                product.price,

            quantity,
        });
    }

    await cart.save();

    return cart;
};

// ==========================================
// GET CART
// ==========================================

export const getCartService = async (
    userId
) => {
    const cart =
        await Cart.findOne({
            user: userId,
        }).populate(
            "items.product",
            "productName price image category stock"
        );

    if (!cart) {
        return {
            user: userId,
            items: [],
        };
    }

    return cart;
};

// ==========================================
// UPDATE QUANTITY
// ==========================================

export const updateCartQuantityService =
    async (
        userId,
        productId,
        quantity
    ) => {
        const cart =
            await Cart.findOne({
                user: userId,
            });

        if (!cart) {
            throw new Error(
                "Cart not found"
            );
        }

        const item =
            cart.items.find(
                (item) =>
                    item.product.toString() ===
                    productId.toString()
            );

        if (!item) {
            throw new Error(
                "Product not found in cart"
            );
        }

        const product =
            await Product.findById(
                productId
            );

        if (!product) {
            throw new Error(
                "Product not found"
            );
        }

        quantity = Number(quantity);

        if (quantity < 1) {
            throw new Error(
                "Quantity must be at least 1"
            );
        }

        if (
            quantity >
            product.stock
        ) {
            throw new Error(
                "Insufficient stock"
            );
        }

        item.quantity = quantity;

        item.productName =
            product.productName;

        item.price =
            product.price;

        await cart.save();

        return cart;
    };

// ==========================================
// REMOVE FROM CART
// ==========================================

export const removeFromCartService =
    async (
        userId,
        productId
    ) => {
        const cart =
            await Cart.findOne({
                user: userId,
            });

        if (!cart) {
            throw new Error(
                "Cart not found"
            );
        }

        const productExists =
            cart.items.some(
                (item) =>
                    item.product.toString() ===
                    productId.toString()
            );

        if (!productExists) {
            throw new Error(
                "Product not found in cart"
            );
        }

        cart.items =
            cart.items.filter(
                (item) =>
                    item.product.toString() !==
                    productId.toString()
            );

        await cart.save();

        return cart;
    };

// ==========================================
// CLEAR CART
// ==========================================

export const clearCartService =
    async (userId) => {
        const cart =
            await Cart.findOne({
                user: userId,
            });

        if (!cart) {
            return {
                user: userId,
                items: [],
            };
        }

        cart.items = [];

        await cart.save();

        return cart;
    };