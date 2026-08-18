import {
    addToCartService,
    getCartService,
    updateCartQuantityService,
    removeFromCartService,
    clearCartService,
} from "../services/cartService.js";

export const addToCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const { productId, quantity } = req.body;

        if (!productId) {
            return res.status(400).json({
                success: false,
                message: "Product ID is required",
            });
        }

        const cart = await addToCartService(
            userId,
            productId,
            quantity
        );

        return res.status(201).json({
            success: true,
            message: "Product added to cart",
            data: cart,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const getCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await getCartService(userId);

        return res.status(200).json({
            success: true,
            data: cart,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const updateCartQuantity = async (req, res) => {
    try {
        const userId = req.user._id;

        const { productId, quantity } = req.body;

        const cart = await updateCartQuantityService(
            userId,
            productId,
            quantity
        );

        return res.status(200).json({
            success: true,
            message: "Cart quantity updated",
            data: cart,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const removeFromCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const { productId } = req.params;

        const cart = await removeFromCartService(
            userId,
            productId
        );

        return res.status(200).json({
            success: true,
            message: "Product removed from cart",
            data: cart,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const clearCart = async (req, res) => {
    try {
        const userId = req.user._id;

        const cart = await clearCartService(userId);

        return res.status(200).json({
            success: true,
            message: "Cart cleared successfully",
            data: cart,
        });
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};