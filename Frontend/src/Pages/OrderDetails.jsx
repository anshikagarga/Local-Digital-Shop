import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { apiRequest, isAuthError } from "../services/api";
import "./OrderDetails.css";

const STATUS_STEPS = [
    {
        key: "pending",
        label: "Order Placed",
    },
    {
        key: "processing",
        label: "Processing",
    },
    {
        key: "shipped",
        label: "Shipped",
    },
    {
        key: "delivered",
        label: "Delivered",
    },
];

const OrderDetails = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrder = useCallback(async () => {
        if (!orderId) {
            setError("Order could not be found.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            /*
             * IMPORTANT:
             * Backend must verify:
             *
             * order.user === req.user._id
             *
             * Frontend route protection is NOT enough.
             */

            const response = await apiRequest(
                `/orders/${orderId}`
            );

            const data =
                response?.data ||
                response?.order ||
                response;

            setOrder(data);
        } catch (err) {
            console.error(
                "Order details error:",
                err
            );

            if (isAuthError(err)) {
                navigate("/login", {
                    state: {
                        from: `/orders/${orderId}`,
                    },
                });

                return;
            }

            setError(
                err?.status === 404
                    ? "Order not found."
                    : err?.message ||
                          "Unable to load order details."
            );
        } finally {
            setLoading(false);
        }
    }, [orderId, navigate]);

    useEffect(() => {
        fetchOrder();
    }, [fetchOrder]);

    const getStatus = () => {
        return String(
            order?.status ||
                order?.orderStatus ||
                "pending"
        ).toLowerCase();
    };

    const getItems = () => {
        if (Array.isArray(order?.items)) {
            return order.items;
        }

        if (Array.isArray(order?.orderItems)) {
            return order.orderItems;
        }

        return [];
    };

    const getItemProduct = (item) => {
        return (
            item?.product ||
            item?.productId ||
            item
        );
    };

    const getItemName = (item) => {
        const product = getItemProduct(item);

        return (
            item?.name ||
            item?.productName ||
            product?.name ||
            product?.title ||
            "Product"
        );
    };

    const getItemImage = (item) => {
        const product = getItemProduct(item);

        if (
            Array.isArray(product?.images) &&
            product.images.length
        ) {
            return product.images[0];
        }

        return (
            item?.image ||
            item?.imageUrl ||
            product?.image ||
            "/images/product-placeholder.png"
        );
    };

    const getItemQuantity = (item) => {
        return Number(
            item?.quantity ||
                item?.qty ||
                1
        );
    };

    const getItemPrice = (item) => {
        return Number(
            item?.price ||
                item?.unitPrice ||
                getItemProduct(item)?.price ||
                0
        );
    };

    const getTotal = () => {
        return Number(
            order?.totalAmount ??
                order?.total ??
                order?.amount ??
                0
        );
    };

    const getSubtotal = () => {
        if (order?.subtotal != null) {
            return Number(order.subtotal);
        }

        return getItems().reduce(
            (total, item) =>
                total +
                getItemPrice(item) *
                    getItemQuantity(item),
            0
        );
    };

    const getDeliveryCharge = () => {
        return Number(
            order?.deliveryCharge ??
                order?.shippingCharge ??
                order?.deliveryFee ??
                0
        );
    };

    const formatPrice = (value) => {
        return Number(value || 0).toLocaleString(
            "en-IN"
        );
    };

    const formatDate = (value) => {
        if (!value) return "Date unavailable";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "Date unavailable";
        }

        return date.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "long",
                year: "numeric",
            }
        );
    };

    const formatDateTime = (value) => {
        if (!value) return "";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        return date.toLocaleString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
            }
        );
    };

    const getOrderDate = () => {
        return (
            order?.createdAt ||
            order?.created_at ||
            order?.date
        );
    };

    const getShippingAddress = () => {
        return (
            order?.shippingAddress ||
            order?.deliveryAddress ||
            order?.address ||
            null
        );
    };

    const getAddressLine = () => {
        const address =
            getShippingAddress();

        if (!address) {
            return null;
        }

        if (typeof address === "string") {
            return address;
        }

        return [
            address.address,
            address.addressLine,
            address.street,
            address.area,
            address.city,
            address.state,
            address.pincode ||
                address.zipCode,
        ]
            .filter(Boolean)
            .join(", ");
    };

    const handleImageError = (event) => {
        const image = event.currentTarget;

        if (
            image.dataset.fallbackApplied ===
            "true"
        ) {
            return;
        }

        image.dataset.fallbackApplied = "true";

        image.src =
            "/images/product-placeholder.png";
    };

    /* ============================================
       LOADING
    ============================================ */

    if (loading) {
        return (
            <main className="order-details-page">
                <div className="order-details-container">
                    <OrderDetailsSkeleton />
                </div>
            </main>
        );
    }

    /* ============================================
       ERROR
    ============================================ */

    if (error || !order) {
        return (
            <main className="order-details-page">
                <div className="order-details-container">

                    <section className="order-error-state">
                        <div className="order-error-icon">
                            !
                        </div>

                        <h1>
                            {error ||
                                "Order not found"}
                        </h1>

                        <p>
                            We couldn't load this
                            order. It may not exist
                            or you may not have
                            permission to view it.
                        </p>

                        <div className="order-error-actions">
                            <button
                                type="button"
                                onClick={
                                    fetchOrder
                                }
                                className="order-retry-button"
                            >
                                Try Again
                            </button>

                            <Link
                                to="/orders"
                                className="order-back-button"
                            >
                                Back to Orders
                            </Link>
                        </div>
                    </section>

                </div>
            </main>
        );
    }

    const status = getStatus();

    const isCancelled =
        status === "cancelled" ||
        status === "canceled";

    const currentStepIndex =
        STATUS_STEPS.findIndex(
            (step) =>
                step.key === status
        );

    const effectiveStepIndex =
        currentStepIndex >= 0
            ? currentStepIndex
            : 0;

    const items = getItems();

    const shippingAddress =
        getShippingAddress();

    return (
        <main className="order-details-page">

            <div className="order-details-container">

                {/* =================================
                    TOP
                ================================= */}

                <motion.div
                    className="order-details-top"
                    initial={{
                        opacity: 0,
                        y: 15,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                >
                    <Link
                        to="/orders"
                        className="order-back-link"
                    >
                        ← Back to Orders
                    </Link>

                    <div className="order-title-row">

                        <div>
                            <span className="order-details-eyebrow">
                                ORDER DETAILS
                            </span>

                            <h1>
                                Order #
                                {String(
                                    orderId
                                ).slice(-8)}
                            </h1>

                            <p>
                                Placed on{" "}
                                {formatDate(
                                    getOrderDate()
                                )}
                            </p>
                        </div>

                        <span
                            className={`order-main-status status-${status}`}
                        >
                            <span className="status-dot" />

                            {isCancelled
                                ? "Cancelled"
                                : status
                                      .charAt(0)
                                      .toUpperCase() +
                                  status.slice(
                                      1
                                  )}
                        </span>

                    </div>
                </motion.div>

                {/* =================================
                    TRACKING
                ================================= */}

                <motion.section
                    className="order-tracking-card"
                    initial={{
                        opacity: 0,
                        y: 15,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                    transition={{
                        delay: 0.05,
                    }}
                >

                    <div className="section-heading">
                        <div>
                            <span>
                                DELIVERY
                            </span>

                            <h2>
                                Order Tracking
                            </h2>
                        </div>
                    </div>

                    {isCancelled ? (
                        <div className="cancelled-state">

                            <div className="cancelled-icon">
                                ×
                            </div>

                            <div>
                                <h3>
                                    Order Cancelled
                                </h3>

                                <p>
                                    This order has
                                    been cancelled
                                    and will not be
                                    delivered.
                                </p>
                            </div>

                        </div>
                    ) : (
                        <div className="tracking-wrapper">

                            <div className="tracking-line">
                                <div
                                    className="tracking-progress"
                                    style={{
                                        width: `${
                                            effectiveStepIndex ===
                                            0
                                                ? 0
                                                : (
                                                      effectiveStepIndex /
                                                      (STATUS_STEPS.length -
                                                          1)
                                                  ) *
                                                  100
                                        }%`,
                                    }}
                                />
                            </div>

                            <div className="tracking-steps">

                                {STATUS_STEPS.map(
                                    (
                                        step,
                                        index
                                    ) => {

                                        const completed =
                                            index <=
                                            effectiveStepIndex;

                                        const active =
                                            index ===
                                            effectiveStepIndex;

                                        return (
                                            <div
                                                className={`tracking-step ${
                                                    completed
                                                        ? "completed"
                                                        : ""
                                                } ${
                                                    active
                                                        ? "active"
                                                        : ""
                                                }`}
                                                key={
                                                    step.key
                                                }
                                            >

                                                <div className="tracking-circle">
                                                    {completed
                                                        ? "✓"
                                                        : index +
                                                          1}
                                                </div>

                                                <strong>
                                                    {
                                                        step.label
                                                    }
                                                </strong>

                                                {active && (
                                                    <span>
                                                        Current
                                                        status
                                                    </span>
                                                )}

                                            </div>
                                        );
                                    }
                                )}

                            </div>

                        </div>
                    )}

                </motion.section>

                {/* =================================
                    MAIN GRID
                ================================= */}

                <div className="order-details-grid">

                    {/* ITEMS */}

                    <motion.section
                        className="order-items-card"
                        initial={{
                            opacity: 0,
                            y: 15,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 0.1,
                        }}
                    >

                        <div className="section-heading">
                            <div>
                                <span>
                                    PURCHASE
                                </span>

                                <h2>
                                    Order Items
                                </h2>
                            </div>

                            <span className="item-count">
                                {items.length}{" "}
                                {items.length ===
                                1
                                    ? "item"
                                    : "items"}
                            </span>
                        </div>

                        <div className="order-items">

                            {items.length ===
                            0 ? (
                                <p className="no-items">
                                    No item details
                                    available.
                                </p>
                            ) : (
                                items.map(
                                    (
                                        item,
                                        index
                                    ) => (
                                        <div
                                            className="order-item"
                                            key={
                                                item?._id ||
                                                item?.productId ||
                                                index
                                            }
                                        >

                                            <div className="order-item-image">
                                                <img
                                                    src={getItemImage(
                                                        item
                                                    )}
                                                    alt={getItemName(
                                                        item
                                                    )}
                                                    onError={
                                                        handleImageError
                                                    }
                                                />
                                            </div>

                                            <div className="order-item-info">

                                                <h3>
                                                    {getItemName(
                                                        item
                                                    )}
                                                </h3>

                                                <span>
                                                    Qty:{" "}
                                                    {getItemQuantity(
                                                        item
                                                    )}
                                                </span>

                                            </div>

                                            <strong className="order-item-price">
                                                ₹
                                                {formatPrice(
                                                    getItemPrice(
                                                        item
                                                    ) *
                                                        getItemQuantity(
                                                            item
                                                        )
                                                )}
                                            </strong>

                                        </div>
                                    )
                                )
                            )}

                        </div>

                    </motion.section>

                    {/* SUMMARY */}

                    <motion.aside
                        className="order-summary-card"
                        initial={{
                            opacity: 0,
                            y: 15,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 0.15,
                        }}
                    >

                        <div className="section-heading">
                            <div>
                                <span>
                                    PAYMENT
                                </span>

                                <h2>
                                    Order Summary
                                </h2>
                            </div>
                        </div>

                        <div className="summary-rows">

                            <div>
                                <span>
                                    Subtotal
                                </span>

                                <strong>
                                    ₹
                                    {formatPrice(
                                        getSubtotal()
                                    )}
                                </strong>
                            </div>

                            <div>
                                <span>
                                    Delivery
                                </span>

                                <strong>
                                    ₹
                                    {formatPrice(
                                        getDeliveryCharge()
                                    )}
                                </strong>
                            </div>

                            <div className="summary-total">
                                <span>
                                    Total
                                </span>

                                <strong>
                                    ₹
                                    {formatPrice(
                                        getTotal()
                                    )}
                                </strong>
                            </div>

                        </div>

                        <div className="payment-method">

                            <span>
                                PAYMENT METHOD
                            </span>

                            <strong>
                                {order?.paymentMethod ||
                                    "Cash on Delivery"}
                            </strong>

                        </div>

                    </motion.aside>

                </div>

                {/* =================================
                    DELIVERY
                ================================= */}

                {(shippingAddress ||
                    getAddressLine()) && (
                    <motion.section
                        className="delivery-card"
                        initial={{
                            opacity: 0,
                            y: 15,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 0.2,
                        }}
                    >

                        <div className="section-heading">
                            <div>
                                <span>
                                    DELIVERY
                                </span>

                                <h2>
                                    Delivery Address
                                </h2>
                            </div>
                        </div>

                        <div className="address-box">

                            {typeof shippingAddress ===
                            "object" ? (
                                <>
                                    {shippingAddress.name && (
                                        <strong>
                                            {
                                                shippingAddress.name
                                            }
                                        </strong>
                                    )}

                                    <p>
                                        {getAddressLine()}
                                    </p>

                                    {shippingAddress.phone && (
                                        <span>
                                            {
                                                shippingAddress.phone
                                            }
                                        </span>
                                    )}
                                </>
                            ) : (
                                <p>
                                    {getAddressLine()}
                                </p>
                            )}

                        </div>

                    </motion.section>
                )}

                {/* FOOTER ACTION */}

                <div className="order-footer-actions">

                    <Link
                        to="/orders"
                        className="order-footer-button secondary"
                    >
                        View All Orders
                    </Link>

                    <Link
                        to="/products"
                        className="order-footer-button primary"
                    >
                        Continue Shopping
                    </Link>

                </div>

            </div>
        </main>
    );
};


/* ================================================
   SKELETON
================================================ */

const OrderDetailsSkeleton = () => {
    return (
        <div className="order-details-skeleton">

            <div className="skeleton-back" />

            <div className="skeleton-title" />

            <div className="skeleton-tracking" />

            <div className="skeleton-main">

                <div className="skeleton-large" />

                <div className="skeleton-small" />

            </div>

        </div>
    );
};

export default OrderDetails;