import Cart from "../models/Cart.js";
import Order from "../models/Order.js";

export const placeOrderService = async (userId, orderData) => {

    const cartItems = await Cart.find({ user: userId })
        .populate("product");

    if (cartItems.length === 0) {
        throw new Error("Cart is empty");
    }

    let totalAmount = 0;

    const items = cartItems.map((item) => {

        totalAmount += item.product.price * item.quantity;

        return {
            product: item.product._id,
            productName: item.product.productName,
            price: item.product.price,
            quantity: item.quantity,
        };
    });

    const order = await Order.create({
        user: userId,
        items,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
        totalAmount,
    });

    await Cart.deleteMany({ user: userId });

    return order;
};

export const getMyOrdersService = async (userId) => {

    const orders = await Order.find({
        user: userId,
    })
    .populate("items.product", "productName price image")
    .sort({ createdAt: -1 });

    return orders;

};

export const getOrderByIdService = async (orderId, userId) => {
    const order = await Order.findById(orderId)
    .populate("items.product", "productName price image");

    if (!order) {
        throw new Error("Order not found");
    }

    if(order.user.toString() != userId.toString()){
        throw new Error("Not authorized to view this order");
    }

    return order;
}

export const cancelOrderService = async (orderId, userId) => {
    const order = await Order.findById(orderId);
    if(!order){
        throw new Error("Order not found");
    }

    if(order.user.toString() != userId.toString()){
        throw new Error("Not authorized to cancel this order");
    }

    if(order.orderStatus === "cancelled"){
        throw new Error("Order is already cancelled");

    }

    if(order.orderStatus === "delivered"){
        throw new Error("Order is already delivered and cannot be cancelled");
    }

    order.orderStatus = "cancelled";
    await order.save();

    return order;

}