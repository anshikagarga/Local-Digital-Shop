import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../Services/api";
import "./Cart.css";

function Cart() {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [updatingId, setUpdatingId] = useState(null);
    const [error, setError] = useState("");

    const fetchCart = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiRequest("/cart");

            setCart(response.data);
        } catch (err) {
            setError(
                err.message ||
                    "Unable to load cart."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    const updateQuantity = async (
        productId,
        quantity
    ) => {
        if (quantity < 1) return;

        try {
            setUpdatingId(productId);
            setError("");

            const response =
                await apiRequest("/cart", {
                    method: "PUT",
                    body: JSON.stringify({
                        productId,
                        quantity,
                    }),
                });

            setCart(response.data);
        } catch (err) {
            setError(
                err.message ||
                    "Unable to update quantity."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const removeItem = async (productId) => {
        try {
            setUpdatingId(productId);
            setError("");

            const response =
                await apiRequest(
                    `/cart/${productId}`,
                    {
                        method: "DELETE",
                    }
                );

            setCart(response.data);
        } catch (err) {
            setError(
                err.message ||
                    "Unable to remove product."
            );
        } finally {
            setUpdatingId(null);
        }
    };

    const clearCart = async () => {
        const confirmed =
            window.confirm(
                "Are you sure you want to clear your cart?"
            );

        if (!confirmed) return;

        try {
            setLoading(true);
            setError("");

            const response =
                await apiRequest("/cart", {
                    method: "DELETE",
                });

            setCart(response.data);
        } catch (err) {
            setError(
                err.message ||
                    "Unable to clear cart."
            );
        } finally {
            setLoading(false);
        }
    };

    const items = cart?.items || [];

    const subtotal = useMemo(() => {
        return items.reduce(
            (total, item) => {
                const product =
                    item.product;

                const price =
                    product?.price ??
                    item.price ??
                    0;

                return (
                    total +
                    price *
                        item.quantity
                );
            },
            0
        );
    }, [items]);

    const totalItems = useMemo(() => {
        return items.reduce(
            (total, item) =>
                total + item.quantity,
            0
        );
    }, [items]);

    if (loading) {
        return (
            <main className="cart-page">
                <div className="cart-loading">
                    <div className="cart-spinner"></div>

                    <h2>
                        Loading your cart...
                    </h2>

                    <p>
                        Please wait a moment.
                    </p>
                </div>
            </main>
        );
    }

    if (error && !cart) {
        return (
            <main className="cart-page">
                <div className="cart-error">
                    <div className="cart-error-icon">
                        ⚠️
                    </div>

                    <h2>
                        Something went wrong
                    </h2>

                    <p>{error}</p>

                    <button
                        className="retry-btn"
                        onClick={fetchCart}
                    >
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    if (items.length === 0) {
        return (
            <main className="cart-page">
                <div className="cart-header">
                    <span className="cart-eyebrow">
                        SHOPPING CART
                    </span>

                    <h1>
                        Your Cart 🛒
                    </h1>

                    <p>
                        Review your products
                        before checkout.
                    </p>
                </div>

                <div className="empty-cart">
                    <div className="empty-cart-icon">
                        🛒
                    </div>

                    <h2>
                        Your cart is empty
                    </h2>

                    <p>
                        Looks like you haven't
                        added anything to your
                        cart yet.
                    </p>

                    <Link
                        to="/products"
                        className="shop-now-btn"
                    >
                        Explore Products →
                    </Link>
                </div>
            </main>
        );
    }

    return (
        <main className="cart-page">

            <div className="cart-header">

                <div>
                    <span className="cart-eyebrow">
                        SHOPPING CART
                    </span>

                    <h1>
                        Your Cart 🛒
                    </h1>

                    <p>
                        {totalItems}{" "}
                        {totalItems === 1
                            ? "item"
                            : "items"}{" "}
                        ready for checkout.
                    </p>
                </div>

                <button
                    className="clear-cart-btn"
                    onClick={clearCart}
                >
                    🗑️ Clear Cart
                </button>

            </div>

            {error && (
                <div className="cart-inline-error">
                    ⚠️ {error}
                </div>
            )}

            <div className="cart-layout">

                <section className="cart-items-section">

                    <div className="cart-section-header">
                        <div>
                            <h2>
                                Cart Items
                            </h2>

                            <p>
                                Products you've
                                selected
                            </p>
                        </div>

                        <span>
                            {items.length}{" "}
                            {items.length === 1
                                ? "product"
                                : "products"}
                        </span>
                    </div>

                    <div className="cart-items">

                        {items.map((item) => {

                            const product =
                                item.product;

                            const productId =
                                product?._id ||
                                product ||
                                item._id;

                            const productName =
                                product?.productName ||
                                item.productName ||
                                "Product";

                            const price =
                                product?.price ??
                                item.price ??
                                0;

                            const image =
                                product?.image ||
                                "";

                            const category =
                                product?.category ||
                                "Local Product";

                            const stock =
                                product?.stock;

                            const itemTotal =
                                price *
                                item.quantity;

                            const isUpdating =
                                updatingId ===
                                productId;

                            return (
                                <article
                                    className="cart-item-card"
                                    key={productId}
                                >

                                    <div className="cart-product-image">

                                        {image ? (
                                            <img
                                                src={
                                                    image
                                                }
                                                alt={
                                                    productName
                                                }
                                            />
                                        ) : (
                                            <div className="image-placeholder">
                                                🛍️
                                            </div>
                                        )}

                                    </div>

                                    <div className="cart-product-details">

                                        <span className="product-category">
                                            {category}
                                        </span>

                                        <h3>
                                            {
                                                productName
                                            }
                                        </h3>

                                        <p className="product-description">
                                            {product?.description ||
                                                "Quality local product"}
                                        </p>

                                        <p className="product-unit-price">
                                            ₹
                                            {price.toLocaleString(
                                                "en-IN"
                                            )}{" "}
                                            / item
                                        </p>

                                        {typeof stock ===
                                            "number" && (
                                            <p className="stock-info">
                                                {stock > 0
                                                    ? `${stock} available`
                                                    : "Out of stock"}
                                            </p>
                                        )}

                                    </div>

                                    <div className="quantity-control">

                                        <span>
                                            Quantity
                                        </span>

                                        <div className="quantity-box">

                                            <button
                                                type="button"
                                                disabled={
                                                    isUpdating ||
                                                    item.quantity <=
                                                        1
                                                }
                                                onClick={() =>
                                                    updateQuantity(
                                                        productId,
                                                        item.quantity -
                                                            1
                                                    )
                                                }
                                            >
                                                −
                                            </button>

                                            <strong>
                                                {
                                                    item.quantity
                                                }
                                            </strong>

                                            <button
                                                type="button"
                                                disabled={
                                                    isUpdating ||
                                                    (typeof stock ===
                                                        "number" &&
                                                        item.quantity >=
                                                            stock)
                                                }
                                                onClick={() =>
                                                    updateQuantity(
                                                        productId,
                                                        item.quantity +
                                                            1
                                                    )
                                                }
                                            >
                                                +
                                            </button>

                                        </div>

                                    </div>

                                    <div className="cart-item-price">

                                        <strong>
                                            ₹
                                            {itemTotal.toLocaleString(
                                                "en-IN"
                                            )}
                                        </strong>

                                        <button
                                            type="button"
                                            className="remove-item-btn"
                                            disabled={
                                                isUpdating
                                            }
                                            onClick={() =>
                                                removeItem(
                                                    productId
                                                )
                                            }
                                        >
                                            Remove
                                        </button>

                                    </div>

                                </article>
                            );
                        })}

                    </div>

                    <Link
                        to="/products"
                        className="continue-shopping"
                    >
                        ← Continue Shopping
                    </Link>

                </section>

                <aside className="cart-summary">

                    <div className="summary-heading">
                        <div>
                            <h2>
                                Order Summary
                            </h2>

                            <p>
                                Your purchase
                                details
                            </p>
                        </div>

                        <span>
                            {totalItems} items
                        </span>
                    </div>

                    <div className="summary-rows">

                        <div className="summary-row">
                            <span>
                                Subtotal
                            </span>

                            <strong>
                                ₹
                                {subtotal.toLocaleString(
                                    "en-IN"
                                )}
                            </strong>
                        </div>

                        <div className="summary-row">
                            <span>
                                Local Delivery
                            </span>

                            <span className="free-text">
                                FREE
                            </span>
                        </div>

                    </div>

                    <div className="summary-divider"></div>

                    <div className="summary-total">

                        <div>
                            <span>
                                Total
                            </span>

                            <small>
                                Inclusive of
                                listed prices
                            </small>
                        </div>

                        <strong>
                            ₹
                            {subtotal.toLocaleString(
                                "en-IN"
                            )}
                        </strong>

                    </div>

                    <Link
                        to="/checkout"
                        className="checkout-btn"
                    >
                        Proceed to Checkout

                        <span>
                            →
                        </span>
                    </Link>

                    <div className="secure-checkout">
                        🔒 Secure local checkout
                    </div>

                </aside>

            </div>
        </main>
    );
}

export default Cart;