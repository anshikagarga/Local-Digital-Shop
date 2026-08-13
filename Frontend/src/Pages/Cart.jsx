import { useEffect, useState } from "react";
import { apiRequest } from "../services/api";
import "./Cart.css";

function Cart() {

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchCart = async () => {

            try {

                const response = await apiRequest("/cart");

                console.log("CART RESPONSE:", response);

                setCart(response.data);

            } catch (error) {

                console.error("CART ERROR:", error);

                setError(error.message);

            } finally {

                setLoading(false);
            }
        };

        fetchCart();

    }, []);

    // Loading
    if (loading) {
        return (
            <div className="cart-loading">
                <h2>Loading cart...</h2>
            </div>
        );
    }

    // Error
    if (error) {
        return (
            <div className="cart-error">
                <h2>Error: {error}</h2>
            </div>
        );
    }

    // Empty cart
    if (!cart || cart.items.length === 0) {
        return (
            <div className="empty-cart">

                <div className="empty-cart-icon">
                    🛒
                </div>

                <h1>Your Cart is Empty</h1>

                <p>
                    Looks like you haven't added anything yet.
                </p>

            </div>
        );
    }

    // Calculate subtotal
    const subtotal = cart.items.reduce(
        (total, item) =>
            total +
            (item.product?.price || item.price) * item.quantity,
        0
    );

    return (
        <div className="cart-page">

            {/* Header */}

            <div className="cart-header">

                <h1>
                    Your Cart 🛒
                </h1>

                <p>
                    Review your selected products
                </p>

            </div>


            <div className="cart-container">

                {/* Cart Items */}

                <div className="cart-items">

                    {cart.items.map((item) => {

                        const productName =
                            item.product?.productName ||
                            item.productName;

                        const price =
                            item.product?.price ||
                            item.price;

                        const image =
                            item.product?.image ||
                            "https://placehold.co/300x300?text=Product";

                        return (

                            <div
                                className="cart-card"
                                key={item._id}
                            >

                                {/* Product Image */}

                                <div className="product-image">

                                    <img
                                        src={image}
                                        alt={productName}
                                    />

                                </div>


                                {/* Product Information */}

                                <div className="product-info">

                                    <h2>
                                        {productName}
                                    </h2>

                                    <p className="product-price">
                                        ₹{price}
                                    </p>


                                    {/* Quantity */}

                                    <div className="quantity-box">

                                        <button
                                            type="button"
                                        >
                                            −
                                        </button>

                                        <span>
                                            {item.quantity}
                                        </span>

                                        <button
                                            type="button"
                                        >
                                            +
                                        </button>

                                    </div>

                                </div>


                                {/* Item Total */}

                                <div className="item-total">

                                    <span>
                                        Total
                                    </span>

                                    <strong>
                                        ₹{price * item.quantity}
                                    </strong>

                                    <button
                                        type="button"
                                        className="remove-btn"
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>

                        );

                    })}

                </div>


                {/* Order Summary */}

                <div className="cart-summary">

                    <h2>
                        Order Summary
                    </h2>


                    <div className="summary-row">

                        <span>
                            Subtotal
                        </span>

                        <span>
                            ₹{subtotal}
                        </span>

                    </div>


                    <div className="summary-row">

                        <span>
                            Delivery
                        </span>

                        <span>
                            Free
                        </span>

                    </div>


                    <hr />


                    <div className="summary-total">

                        <span>
                            Total
                        </span>

                        <strong>
                            ₹{subtotal}
                        </strong>

                    </div>


                    <button
                        type="button"
                        className="checkout-btn"
                    >
                        Proceed to Checkout
                    </button>

                </div>

            </div>

        </div>
    );
}

export default Cart;