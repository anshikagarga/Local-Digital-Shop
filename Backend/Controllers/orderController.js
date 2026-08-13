import {
    createOrderService,
    getMyOrdersService,
    getOrderByIdService,
    cancelOrderService,
    updateOrderStatusService, updatePaymentStatusService
} from "../services/orderService.js";


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

export const createOrder = async(req, res) => {
    try{
        const userId = req.user._id;
        const order = await createOrderService(userId, req.body);

        return res.status(201).json({
            success: true,
            message: "Order created successfully",
            data: order,
        });
    }catch(error){
        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
        }

        export const updateOrderStatus = async (req, res) => {

    try {

        const { status } = req.body;

        const order = await updateOrderStatusService(
            req.params.orderId,
            status
        );

        return res.status(200).json({
            success: true,
            message: "Order status updated successfully",
            data: order,
        });

    } catch (error) {

        return res.status(400).json({
            success: false,
            message: error.message,
        });
    }
};

export const updatePaymentStatus = async(req, res)=>{
    try{
        const order = await updatePaymentStatusService(req.params.orderId, req.body.paymentStatus);

        return res.status(200).json({
            success: true,
            message: "Payment status updated successfully",
            data: order,
        });
    }catch(error){
        return res.status(400).json({
            success: false,
            message: error.message,
        })
    }
}
        