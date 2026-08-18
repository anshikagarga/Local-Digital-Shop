import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest, isAuthError } from "../Services/api";
import { useAuth } from "../Context/AuthContext";
import "./Checkout.css";

const INITIAL_ADDRESS = {
    fullName: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
};

function Checkout() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [fieldErrors, setFieldErrors] = useState({});

    const [shippingAddress, setShippingAddress] =
        useState(INITIAL_ADDRESS);

    const [paymentMethod, setPaymentMethod] =
        useState("COD");

    /* =========================================
       INITIAL USER ADDRESS
    ========================================= */

    useEffect(() => {
        if (!user) return;

        setShippingAddress((previous) => ({
            fullName:
                previous.fullName ||
                user.name ||
                "",
            phone:
                previous.phone ||
                user.phone ||
                "",
            address:
                previous.address ||
                user.address ||
                "",
            city:
                previous.city ||
                user.city ||
                "",
            state:
                previous.state ||
                user.state ||
                "",
            pincode:
                previous.pincode ||
                user.pincode ||
                "",
        }));
    }, [user]);

    /* =========================================
       FETCH CART
    ========================================= */

    useEffect(() => {
        let mounted = true;

        const fetchCart = async () => {
            try {
                setLoading(true);
                setError("");

                const response =
                    await apiRequest("/cart");

                if (!mounted) return;

                setCart(response?.data || {
                    items: [],
                });
            } catch (err) {
                if (!mounted) return;

                if (isAuthError(err)) {
                    navigate("/login", {
                        state: {
                            from: "/checkout",
                        },
                    });
                    return;
                }

                setError(
                    err?.message ||
                        "Unable to load your cart."
                );
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };

        fetchCart();

        return () => {
            mounted = false;
        };
    }, [navigate]);

    /* =========================================
       FORM CHANGE
    ========================================= */

    const handleChange = (event) => {
        const {
            name,
            value,
        } = event.target;

        setShippingAddress((previous) => ({
            ...previous,
            [name]: value,
        }));

        if (fieldErrors[name]) {
            setFieldErrors((previous) => {
                const updated = {
                    ...previous,
                };

                delete updated[name];

                return updated;
            });
        }

        if (error) {
            setError("");
        }
    };

    /* =========================================
       VALIDATION
    ========================================= */

    const validateForm = () => {
        const errors = {};

        const fullName =
            shippingAddress.fullName.trim();

        const phone =
            shippingAddress.phone.trim();

        const address =
            shippingAddress.address.trim();

        const city =
            shippingAddress.city.trim();

        const state =
            shippingAddress.state.trim();

        const pincode =
            shippingAddress.pincode.trim();

        if (!fullName) {
            errors.fullName =
                "Full name is required.";
        } else if (fullName.length < 2) {
            errors.fullName =
                "Please enter a valid name.";
        }

        if (!phone) {
            errors.phone =
                "Phone number is required.";
        } else if (!/^[6-9]\d{9}$/.test(phone)) {
            errors.phone =
                "Enter a valid 10-digit mobile number.";
        }

        if (!address) {
            errors.address =
                "Delivery address is required.";
        }

        if (!city) {
            errors.city =
                "City is required.";
        }

        if (!state) {
            errors.state =
                "State is required.";
        }

        if (!pincode) {
            errors.pincode =
                "Pincode is required.";
        } else if (!/^\d{6}$/.test(pincode)) {
            errors.pincode =
                "Enter a valid 6-digit pincode.";
        }

        setFieldErrors(errors);

        return Object.keys(errors).length === 0;
    };

    /* =========================================
       CART DATA
    ========================================= */

    const items = useMemo(() => {
        return Array.isArray(cart?.items)
            ? cart.items
            : [];
    }, [cart]);

    const getProduct = (item) => {
        return item?.product || {};
    };

    const getProductName = (item) => {
        const product = getProduct(item);

        return (
            product?.productName ||
            product?.name ||
            product?.title ||
            item?.productName ||
            item?.name ||
            "Product"
        );
    };

    const getProductPrice = (item) => {
        const product = getProduct(item);

        return Number(
            product?.price ??
                item?.price ??
                0
        );
    };

    const getProductImage = (item) => {
        const product = getProduct(item);

        if (
            Array.isArray(product?.images) &&
            product.images.length > 0
        ) {
            return product.images[0];
        }

        return (
            product?.image ||
            product?.imageUrl ||
            item?.image ||
            ""
        );
    };

    const getQuantity = (item) => {
        return Number(item?.quantity || 1);
    };

    const subtotal = useMemo(() => {
        return items.reduce(
            (total, item) => {
                return (
                    total +
                    getProductPrice(item) *
                        getQuantity(item)
                );
            },
            0
        );
    }, [items]);

    const shipping = 0;

    const total = subtotal + shipping;

    /* =========================================
       FORMAT PRICE
    ========================================= */

    const formatPrice = (amount) => {
        return Number(amount || 0).toLocaleString(
            "en-IN"
        );
    };

    /* =========================================
       PLACE ORDER
    ========================================= */

    const handlePlaceOrder = async (event) => {
        event.preventDefault();

        setError("");

        if (!validateForm()) {
            return;
        }

        if (items.length === 0) {
            setError(
                "Your cart is empty. Please add products before checkout."
            );
            return;
        }

        try {
            setSubmitting(true);

            const response =
                await apiRequest("/orders", {
                    method: "POST",
                    body: JSON.stringify({
                        shippingAddress: {
                            fullName:
                                shippingAddress.fullName.trim(),
                            phone:
                                shippingAddress.phone.trim(),
                            address:
                                shippingAddress.address.trim(),
                            city:
                                shippingAddress.city.trim(),
                            state:
                                shippingAddress.state.trim(),
                            pincode:
                                shippingAddress.pincode.trim(),
                        },
                        paymentMethod,
                    }),
                });

            if (
                response?.success &&
                response?.data?._id
            ) {
                navigate(
                    `/orders/${response.data._id}`
                );
                return;
            }

            if (response?.data?._id) {
                navigate(
                    `/orders/${response.data._id}`
                );
                return;
            }

            throw new Error(
                "Order could not be placed. Please try again."
            );
        } catch (err) {
            console.error(
                "Checkout error:",
                err
            );

            if (isAuthError(err)) {
                navigate("/login", {
                    state: {
                        from: "/checkout",
                    },
                });
                return;
            }

            setError(
                err?.message ||
                    "Unable to place your order. Please try again."
            );
        } finally {
            setSubmitting(false);
        }
    };

    /* =========================================
       IMAGE FALLBACK
    ========================================= */

    const handleImageError = (event) => {
        const image =
            event.currentTarget;

        if (
            image.dataset.fallback ===
            "true"
        ) {
            return;
        }

        image.dataset.fallback = "true";

        image.style.display = "none";

        const fallback =
            image.parentElement?.querySelector(
                ".checkout-image-fallback"
            );

        if (fallback) {
            fallback.style.display = "grid";
        }
    };

    /* =========================================
       LOADING
    ========================================= */

    if (loading) {
        return (
            <main className="checkout-page">
                <CheckoutSkeleton />
            </main>
        );
    }

    /* =========================================
       ERROR WITHOUT CART
    ========================================= */

    if (error && !cart) {
        return (
            <main className="checkout-page">
                <section className="checkout-error-page">
                    <div className="checkout-error-icon">
                        !
                    </div>

                    <h1>
                        Unable to load checkout
                    </h1>

                    <p>{error}</p>

                    <Link
                        to="/cart"
                        className="checkout-secondary-button"
                    >
                        Back to Cart
                    </Link>
                </section>
            </main>
        );
    }

    /* =========================================
       EMPTY CART
    ========================================= */

    if (items.length === 0) {
        return (
            <main className="checkout-page">
                <section className="empty-checkout">
                    <div className="empty-checkout-icon">
                        🛒
                    </div>

                    <span className="checkout-eyebrow">
                        CHECKOUT
                    </span>

                    <h1>
                        Your cart is empty
                    </h1>

                    <p>
                        Add some products from
                        local sellers before
                        proceeding to checkout.
                    </p>

                    <Link
                        to="/products"
                        className="checkout-primary-button"
                    >
                        Explore Products
                    </Link>
                </section>
            </main>
        );
    }

    return (
        <main className="checkout-page">

            <div className="checkout-container">

                {/* =================================
                    HEADER
                ================================= */}

                <header className="checkout-header">

                    <Link
                        to="/cart"
                        className="checkout-back-link"
                    >
                        ← Back to Cart
                    </Link>

                    <span className="checkout-eyebrow">
                        SECURE CHECKOUT
                    </span>

                    <h1>
                        Complete your order
                    </h1>

                    <p>
                        Enter your delivery
                        details and review your
                        order before placing it.
                    </p>

                </header>

                {/* =================================
                    ERROR
                ================================= */}

                {error && (
                    <div
                        className="checkout-error"
                        role="alert"
                    >
                        <span className="checkout-error-symbol">
                            !
                        </span>

                        <div>
                            <strong>
                                Something went wrong
                            </strong>

                            <p>
                                {error}
                            </p>
                        </div>
                    </div>
                )}

                <div className="checkout-grid">

                    {/* =================================
                        LEFT
                    ================================= */}

                    <form
                        className="checkout-form"
                        onSubmit={
                            handlePlaceOrder
                        }
                        noValidate
                    >

                        {/* ADDRESS */}

                        <section className="checkout-card">

                            <div className="checkout-section-header">
                                <div className="checkout-step-number">
                                    01
                                </div>

                                <div>
                                    <span>
                                        DELIVERY
                                    </span>

                                    <h2>
                                        Shipping address
                                    </h2>

                                    <p>
                                        Where should we
                                        deliver your
                                        order?
                                    </p>
                                </div>
                            </div>

                            <div className="checkout-fields">

                                {/* NAME */}

                                <div className="checkout-field">
                                    <label htmlFor="fullName">
                                        Full name
                                        <span>
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="fullName"
                                        name="fullName"
                                        type="text"
                                        value={
                                            shippingAddress.fullName
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Enter your full name"
                                        autoComplete="name"
                                        className={
                                            fieldErrors.fullName
                                                ? "input-error"
                                                : ""
                                        }
                                    />

                                    {fieldErrors.fullName && (
                                        <small>
                                            {
                                                fieldErrors.fullName
                                            }
                                        </small>
                                    )}
                                </div>

                                {/* PHONE */}

                                <div className="checkout-field">
                                    <label htmlFor="phone">
                                        Phone number
                                        <span>
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="phone"
                                        name="phone"
                                        type="tel"
                                        inputMode="numeric"
                                        maxLength={10}
                                        value={
                                            shippingAddress.phone
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="10-digit mobile number"
                                        autoComplete="tel"
                                        className={
                                            fieldErrors.phone
                                                ? "input-error"
                                                : ""
                                        }
                                    />

                                    {fieldErrors.phone && (
                                        <small>
                                            {
                                                fieldErrors.phone
                                            }
                                        </small>
                                    )}
                                </div>

                                {/* ADDRESS */}

                                <div className="checkout-field full-width">
                                    <label htmlFor="address">
                                        Address
                                        <span>
                                            *
                                        </span>
                                    </label>

                                    <textarea
                                        id="address"
                                        name="address"
                                        value={
                                            shippingAddress.address
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="House no., street, locality"
                                        rows={3}
                                        autoComplete="street-address"
                                        className={
                                            fieldErrors.address
                                                ? "input-error"
                                                : ""
                                        }
                                    />

                                    {fieldErrors.address && (
                                        <small>
                                            {
                                                fieldErrors.address
                                            }
                                        </small>
                                    )}
                                </div>

                                {/* CITY */}

                                <div className="checkout-field">
                                    <label htmlFor="city">
                                        City
                                        <span>
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="city"
                                        name="city"
                                        type="text"
                                        value={
                                            shippingAddress.city
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Your city"
                                        autoComplete="address-level2"
                                        className={
                                            fieldErrors.city
                                                ? "input-error"
                                                : ""
                                        }
                                    />

                                    {fieldErrors.city && (
                                        <small>
                                            {
                                                fieldErrors.city
                                            }
                                        </small>
                                    )}
                                </div>

                                {/* STATE */}

                                <div className="checkout-field">
                                    <label htmlFor="state">
                                        State
                                        <span>
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="state"
                                        name="state"
                                        type="text"
                                        value={
                                            shippingAddress.state
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="Your state"
                                        autoComplete="address-level1"
                                        className={
                                            fieldErrors.state
                                                ? "input-error"
                                                : ""
                                        }
                                    />

                                    {fieldErrors.state && (
                                        <small>
                                            {
                                                fieldErrors.state
                                            }
                                        </small>
                                    )}
                                </div>

                                {/* PINCODE */}

                                <div className="checkout-field">
                                    <label htmlFor="pincode">
                                        Pincode
                                        <span>
                                            *
                                        </span>
                                    </label>

                                    <input
                                        id="pincode"
                                        name="pincode"
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={6}
                                        value={
                                            shippingAddress.pincode
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        placeholder="6-digit pincode"
                                        autoComplete="postal-code"
                                        className={
                                            fieldErrors.pincode
                                                ? "input-error"
                                                : ""
                                        }
                                    />

                                    {fieldErrors.pincode && (
                                        <small>
                                            {
                                                fieldErrors.pincode
                                            }
                                        </small>
                                    )}
                                </div>

                            </div>

                        </section>

                        {/* PAYMENT */}

                        <section className="checkout-card">

                            <div className="checkout-section-header">
                                <div className="checkout-step-number">
                                    02
                                </div>

                                <div>
                                    <span>
                                        PAYMENT
                                    </span>

                                    <h2>
                                        Payment method
                                    </h2>

                                    <p>
                                        Choose how you
                                        want to pay.
                                    </p>
                                </div>
                            </div>

                            <div className="payment-options">

                                <label
                                    className={`payment-option ${
                                        paymentMethod ===
                                        "COD"
                                            ? "active"
                                            : ""
                                    }`}
                                >

                                    <input
                                        type="radio"
                                        name="paymentMethod"
                                        value="COD"
                                        checked={
                                            paymentMethod ===
                                            "COD"
                                        }
                                        onChange={(event) =>
                                            setPaymentMethod(
                                                event.target
                                                    .value
                                            )
                                        }
                                    />

                                    <span className="payment-radio">
                                        <span />
                                    </span>

                                    <div className="payment-details">
                                        <strong>
                                            Cash on Delivery
                                        </strong>

                                        <p>
                                            Pay when your
                                            order arrives
                                            at your
                                            doorstep.
                                        </p>
                                    </div>

                                    <span className="payment-available">
                                        Available
                                    </span>

                                </label>

                            </div>

                        </section>

                        {/* SECURITY NOTE */}

                        <div className="checkout-security-note">
                            <span className="security-icon">
                                ✓
                            </span>

                            <div>
                                <strong>
                                    Safe & secure
                                </strong>

                                <p>
                                    Your delivery
                                    information is
                                    used only to
                                    process your
                                    order.
                                </p>
                            </div>
                        </div>

                        {/* PLACE ORDER */}

                        <button
                            type="submit"
                            className="place-order-btn"
                            disabled={submitting}
                        >
                            {submitting ? (
                                <>
                                    <span className="button-spinner" />
                                    Placing order...
                                </>
                            ) : (
                                <>
                                    Place order
                                    <span>
                                        →
                                    </span>
                                </>
                            )}
                        </button>

                    </form>

                    {/* =================================
                        RIGHT SUMMARY
                    ================================= */}

                    <aside className="checkout-summary">

                        <div className="summary-header">
                            <div>
                                <span>
                                    YOUR CART
                                </span>

                                <h2>
                                    Order summary
                                </h2>
                            </div>

                            <span className="summary-count">
                                {items.length}
                            </span>
                        </div>

                        <div className="summary-items">

                            {items.map(
                                (
                                    item,
                                    index
                                ) => {
                                    const name =
                                        getProductName(
                                            item
                                        );

                                    const price =
                                        getProductPrice(
                                            item
                                        );

                                    const quantity =
                                        getQuantity(
                                            item
                                        );

                                    const image =
                                        getProductImage(
                                            item
                                        );

                                    return (
                                        <div
                                            className="summary-item"
                                            key={
                                                item?._id ||
                                                item?.product?._id ||
                                                index
                                            }
                                        >

                                            <div className="item-img-box">

                                                {image && (
                                                    <img
                                                        src={
                                                            image
                                                        }
                                                        alt={
                                                            name
                                                        }
                                                        onError={
                                                            handleImageError
                                                        }
                                                    />
                                                )}

                                                <span className="checkout-image-fallback">
                                                    🛍
                                                </span>

                                                <span className="item-quantity">
                                                    {quantity}
                                                </span>

                                            </div>

                                            <div className="item-details">

                                                <h3>
                                                    {name}
                                                </h3>

                                                <p>
                                                    ₹
                                                    {formatPrice(
                                                        price
                                                    )}{" "}
                                                    each
                                                </p>

                                            </div>

                                            <strong className="item-price">
                                                ₹
                                                {formatPrice(
                                                    price *
                                                        quantity
                                                )}
                                            </strong>

                                        </div>
                                    );
                                }
                            )}

                        </div>

                        <div className="summary-breakdown">

                            <div className="breakdown-row">
                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ₹
                                    {formatPrice(
                                        subtotal
                                    )}
                                </strong>
                            </div>

                            <div className="breakdown-row">
                                <span>
                                    Local delivery
                                </span>

                                <strong className="free">
                                    FREE
                                </strong>
                            </div>

                            <div className="summary-divider" />

                            <div className="breakdown-row total-row">
                                <span>
                                    Total
                                </span>

                                <strong>
                                    ₹
                                    {formatPrice(
                                        total
                                    )}
                                </strong>
                            </div>

                        </div>

                        <div className="summary-note">
                            <span>
                                ✓
                            </span>

                            <p>
                                No hidden delivery
                                charges.
                            </p>
                        </div>

                    </aside>

                </div>

            </div>
        </main>
    );
}


/* =============================================
   LOADING SKELETON
============================================= */

function CheckoutSkeleton() {
    return (
        <div className="checkout-container checkout-skeleton">

            <div className="skeleton-back" />

            <div className="skeleton-heading">
                <div />
                <div />
                <div />
            </div>

            <div className="skeleton-grid">

                <div className="skeleton-left">

                    <div className="skeleton-card">
                        <div className="skeleton-line large" />
                        <div className="skeleton-line" />
                        <div className="skeleton-inputs">
                            <div />
                            <div />
                            <div />
                            <div />
                        </div>
                    </div>

                    <div className="skeleton-card">
                        <div className="skeleton-line large" />
                        <div className="skeleton-payment" />
                    </div>

                </div>

                <div className="skeleton-summary">
                    <div className="skeleton-line large" />
                    <div className="skeleton-products">
                        <div />
                        <div />
                        <div />
                    </div>
                </div>

            </div>

        </div>
    );
}

export default Checkout;