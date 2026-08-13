import Cart from "../models/Cart.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";



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

    if (!order) {
        throw new Error("Order not found");
    }

    if (order.user.toString() !== userId.toString()) {
        throw new Error("Not authorized to cancel this order");
    }

    if (order.orderStatus === "cancelled") {
        throw new Error("Order is already cancelled");
    }

    if (order.orderStatus === "delivered") {
        throw new Error(
            "Order is already delivered and cannot be cancelled"
        );
    }

    // Restore product stock
    for (const item of order.items) {
        await Product.findByIdAndUpdate(
            item.product,
            {
                $inc: {
                    stock: item.quantity,
                },
            }
        );
    }

    // Cancel order
    order.orderStatus = "cancelled";

    await order.save();

    return order;
};

export const createOrderService = async (userId, orderData) => {

    // 1. Find user's cart
    const cart = await Cart.findOne({
        user: userId,
    });

    if (!cart || cart.items.length === 0) {
        throw new Error("Cart is empty");
    }

    // 2. Check all products and stock
    for (const item of cart.items) {

        const product = await Product.findById(item.product);

        if (!product) {
            throw new Error(
                `Product not found: ${item.productName}`
            );
        }

        if (product.stock < item.quantity) {
            throw new Error(
                `Insufficient stock for ${product.productName}`
            );
        }
    }

    // 3. Calculate total
    const totalAmount = cart.items.reduce(
        (total, item) => {
            return total + item.price * item.quantity;
        },
        0
    );

    // 4. Create order items
    const orderItems = cart.items.map((item) => ({
        product: item.product,
        productName: item.productName,
        price: item.price,
        quantity: item.quantity,
    }));

    // 5. Create order
    const order = await Order.create({
        user: userId,
        items: orderItems,
        totalAmount,
        shippingAddress: orderData.shippingAddress,
        paymentMethod: orderData.paymentMethod,
    });

    // 6. Reduce stock
    for (const item of cart.items) {

        await Product.findByIdAndUpdate(
            item.product,
            {
                $inc: {
                    stock: -item.quantity,
                },
            }
        );
    }

    // 7. Clear cart
    cart.items = [];
    await cart.save();

    return order;
};

export const updateOrderStatusService = async (
    orderId,
    status
) => {

    const order = await Order.findById(orderId);

    if (!order) {
        throw new Error("Order not found");
    }

    const allowedStatuses = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
        throw new Error("Invalid order status");
    }

    if (order.orderStatus === "cancelled") {
        throw new Error(
            "Cancelled order status cannot be changed"
        );
    }

    if (order.orderStatus === "delivered") {
        throw new Error(
            "Delivered order status cannot be changed"
        );
    }

    order.orderStatus = status;

    await order.save();

    return order;
};

export const updatePaymentStatusService = async (
    orderId,
    paymentStatus
) => {

    const order = await Order.findById(orderId);

    if (!order) {
        throw new Error("Order not found");
    }

    const allowedStatuses = [
        "pending",
        "completed",
        "failed",
    ];

    if (!allowedStatuses.includes(paymentStatus)) {
        throw new Error("Invalid payment status");
    }

    if (order.paymentStatus === "completed") {
        throw new Error("Payment is already completed");
    }

    order.paymentStatus = paymentStatus;

    await order.save();

    return order;
};