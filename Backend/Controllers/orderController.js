import { placeOrderService } from "../services/orderService.js";

export const placeOrder = async (req, res) => {

    try {

        const order = await placeOrderService(
            req.user._id,
            req.body
        );

        res.status(201).json({
            success: true,
            message: "Order placed successfully",
            data: order,
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};