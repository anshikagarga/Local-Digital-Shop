import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../Services/api";
import "./Cart.css";

function Cart() {

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionLoading, setActionLoading] = useState(false);


    // Fetch Cart
    const fetchCart = async () => {

        try {

            const response = await apiRequest("/cart");

            setCart(response.data);
            setError("");

        } catch (error) {

            console.error("CART ERROR:", error);

            // User has no cart yet
            if (error.message === "Cart not found") {

                setCart({
                    items: []
                });

                setError("");

            } else {

                setError(error.message);

            }

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        fetchCart();

    }, []);


    // Update Quantity
    const updateQuantity = async (productId, quantity) => {

        try {

            setActionLoading(true);

            const response = await apiRequest("/cart", {
                method: "PUT",
                body: JSON.stringify({
                    productId,
                    quantity
                })
            });

            setCart(response.data);

        } catch (error) {

            console.error("UPDATE CART ERROR:", error);

            setError(error.message);

        } finally {

            setActionLoading(false);

        }
    };


    // Increase Quantity
    const increaseQuantity = (item) => {

        const productId =
            item.product?._id || item.product;

        updateQuantity(
            productId,
            item.quantity + 1
        );
    };


    // Decrease Quantity
    const decreaseQuantity = (item) => {

        const productId =
            item.product?._id || item.product;

        if (item.quantity > 1) {

            updateQuantity(
                productId,
                item.quantity - 1
            );

        } else {

            removeItem(productId);

        }
    };


    // Remove Item
    const removeItem = async (productId) => {

        try {

            setActionLoading(true);

            const response = await apiRequest(
                `/cart/${productId}`,
                {
                    method: "DELETE"
                }
            );

            setCart(response.data);

        } catch (error) {

            console.error("REMOVE CART ERROR:", error);

            setError(error.message);

        } finally {

            setActionLoading(false);

        }
    };


    // Clear Cart
    const clearCart = async () => {

        try {

            setActionLoading(true);

            const response = await apiRequest(
                "/cart",
                {
                    method: "DELETE"
                }
            );

            setCart(response.data);

        } catch (error) {

            console.error("CLEAR CART ERROR:", error);

            setError(error.message);

        } finally {

            setActionLoading(false);

        }
    };


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

                <h2>
                    Error: {error}
                </h2>

                <button onClick={fetchCart}>
                    Try Again
                </button>

            </div>
        );

    }


    // Empty Cart
    if (!cart || !cart.items || cart.items.length === 0) {

        return (
            <div className="empty-cart">

                <div className="empty-cart-icon">
                    🛒
                </div>

                <h1>
                    Your Cart is Empty
                </h1>

                <p>
                    Looks like you haven't added anything yet.
                </p>

                <Link
                    to="/products"
                    className="continue-shopping-btn"
                >
                    Explore Products
                </Link>

            </div>
        );

    }


    // Calculate Subtotal
    const subtotal = cart.items.reduce(
        (total, item) => {

            const price =
                item.product?.price || item.price;

            return total + price * item.quantity;

        },
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

                        const productId =
                            item.product?._id || item.product;

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
                                            disabled={actionLoading}
                                            onClick={() =>
                                                decreaseQuantity(item)
                                            }
                                        >
                                            −
                                        </button>

                                        <span>
                                            {item.quantity}
                                        </span>

                                        <button
                                            type="button"
                                            disabled={actionLoading}
                                            onClick={() =>
                                                increaseQuantity(item)
                                            }
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
                                        disabled={actionLoading}
                                        onClick={() =>
                                            removeItem(productId)
                                        }
                                    >
                                        Remove
                                    </button>

                                </div>

                            </div>
                        );

                    })}


                    {/* Clear Cart */}

                    <button
                        type="button"
                        className="clear-cart-btn"
                        disabled={actionLoading}
                        onClick={clearCart}
                    >
                        Clear Cart
                    </button>

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


                    <Link
                        to="/checkout"
                        className="checkout-btn"
                    >
                        Proceed to Checkout
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default Cart;