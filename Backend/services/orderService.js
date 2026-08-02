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