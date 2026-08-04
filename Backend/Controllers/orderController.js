import { placeOrderService, getMyOrdersService , getOrderByIdService, cancelOrderService} from "../services/orderService.js";

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

export const getMyOrders = async (req, res) => {

    try {

        const orders = await getMyOrdersService(req.user._id);

        res.status(200).json({
            success: true,
            count: orders.length,
            data: orders,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }

};

export const getOrderById = async (req, res) => {
    try{
        const order = await getOrderByIdService(req.params.id, req.user._id);

        res.status(200).json({
            success: true,
            data: order,
        });
    } catch (error){
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
}

export const cancelOrder = async (req, res) => {
    try{
        const order = await cancelOrderService(req.params.id, req.user._id);

        res.status(200).json({
            success: true,
            message: "Order cancelled successfully",
            data: order,
        });
    } catch (error){
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}