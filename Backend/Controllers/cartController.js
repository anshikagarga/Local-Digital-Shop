import { addToCartService } from "../services/cartService.js";

export const addToCart = async (req, res) => {
    try {

        const cart = await addToCartService(
            req.user._id,
            req.body.productId
        );

        res.status(200).json({
            success: true,
            message: "Product added to cart",
            data: cart,
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }
};