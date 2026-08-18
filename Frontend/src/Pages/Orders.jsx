import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { apiRequest, isAuthError } from "../services/api";
import "./Orders.css";

const Orders = () => {
    const navigate = useNavigate();

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchOrders = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiRequest("/orders");

            const data =
                response?.data ||
                response?.orders ||
                response;

            if (Array.isArray(data)) {
                setOrders(data);
            } else if (Array.isArray(data?.orders)) {
                setOrders(data.orders);
            } else {
                setOrders([]);
            }
        } catch (err) {
            console.error("Orders error:", err);

            if (isAuthError(err)) {
                navigate("/login", {
                    state: {
                        from: "/orders",
                    },
                });
                return;
            }

            setError(
                err?.message ||
                    "Unable to load your orders."
            );
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);

    const getOrderId = (order) =>
        order?._id ||
        order?.id ||
        order?.orderId;

    const getStatus = (order) =>
        String(
            order?.status ||
                order?.orderStatus ||
                "Pending"
        ).toLowerCase();

    const getTotal = (order) =>
        Number(
            order?.totalAmount ??
                order?.total ??
                order?.amount ??
                0
        );

    const getDate = (order) =>
        order?.createdAt ||
        order?.created_at ||
        order?.date;

    const formatPrice = (amount) =>
        Number(amount || 0).toLocaleString(
            "en-IN"
        );

    const formatDate = (date) => {
        if (!date) return "Date unavailable";

        const parsedDate = new Date(date);

        if (Number.isNaN(parsedDate.getTime())) {
            return "Date unavailable";
        }

        return parsedDate.toLocaleDateString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
            }
        );
    };

    const formatStatus = (status) => {
        if (!status) return "Pending";

        return (
            status.charAt(0).toUpperCase() +
            status.slice(1)
        );
    };

    if (loading) {
        return (
            <main className="orders-page">
                <div className="orders-container">
                    <OrdersSkeleton />
                </div>
            </main>
        );
    }

    if (!orders.length && !error) {
        return (
            <main className="orders-page">
                <div className="orders-container">
                    <motion.section
                        className="orders-empty"
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                    >
                        <div className="orders-empty-icon">
                            <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    d="M6 3h12v18H6z"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                />
                                <path
                                    d="M9 7h6M9 11h6M9 15h4"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                />
                            </svg>
                        </div>

                        <h1>No orders yet</h1>

                        <p>
                            Your completed orders will
                            appear here.
                        </p>

                        <Link
                            to="/products"
                            className="orders-shop-button"
                        >
                            Start Shopping
                        </Link>
                    </motion.section>
                </div>
            </main>
        );
    }

    return (
        <main className="orders-page">
            <div className="orders-container">

                <motion.header
                    className="orders-header"
                    initial={{
                        opacity: 0,
                        y: 15,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                >
                    <div>
                        <span className="orders-eyebrow">
                            PURCHASE HISTORY
                        </span>

                        <h1>My Orders</h1>

                        <p>
                            Track and manage your
                            recent purchases.
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="orders-shop-link"
                    >
                        Continue Shopping
                    </Link>
                </motion.header>

                {error && (
                    <div
                        className="orders-error"
                        role="alert"
                    >
                        <span>{error}</span>

                        <button
                            type="button"
                            onClick={fetchOrders}
                        >
                            Retry
                        </button>
                    </div>
                )}

                <section
                    className="orders-list"
                    aria-label="Your orders"
                >
                    {orders.map(
                        (order, index) => {
                            const orderId =
                                getOrderId(order);

                            const status =
                                getStatus(order);

                            return (
                                <motion.article
                                    className="order-card"
                                    key={
                                        orderId ||
                                        index
                                    }
                                    initial={{
                                        opacity: 0,
                                        y: 15,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        delay:
                                            index *
                                            0.05,
                                    }}
                                >
                                    <div className="order-card-main">

                                        <div className="order-icon">
                                            <svg
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M6 3h12v18H6z"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                />
                                                <path
                                                    d="M9 7h6M9 11h6"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </div>

                                        <div className="order-info">

                                            <span className="order-label">
                                                ORDER
                                            </span>

                                            <h2>
                                                #
                                                {String(
                                                    orderId ||
                                                        "N/A"
                                                ).slice(
                                                    -8
                                                )}
                                            </h2>

                                            <span className="order-date">
                                                {formatDate(
                                                    getDate(
                                                        order
                                                    )
                                                )}
                                            </span>

                                        </div>

                                    </div>

                                    <div className="order-meta">

                                        <div className="order-total">
                                            <span>
                                                TOTAL
                                            </span>

                                            <strong>
                                                ₹
                                                {formatPrice(
                                                    getTotal(
                                                        order
                                                    )
                                                )}
                                            </strong>
                                        </div>

                                        <span
                                            className={`order-status status-${status}`}
                                        >
                                            <span className="status-dot" />
                                            {formatStatus(
                                                status
                                            )}
                                        </span>

                                        <Link
                                            to={`/orders/${orderId}`}
                                            className="order-details-button"
                                        >
                                            View Details
                                        </Link>

                                    </div>
                                </motion.article>
                            );
                        }
                    )}
                </section>

            </div>
        </main>
    );
};


const OrdersSkeleton = () => {
    return (
        <div className="orders-skeleton">

            <div className="orders-skeleton-heading" />

            <div className="orders-skeleton-list">

                {[1, 2, 3, 4].map(
                    (item) => (
                        <div
                            className="orders-skeleton-card"
                            key={item}
                        >
                            <div className="orders-skeleton-circle" />

                            <div className="orders-skeleton-content">
                                <div className="orders-skeleton-line large" />
                                <div className="orders-skeleton-line small" />
                            </div>

                            <div className="orders-skeleton-right" />
                        </div>
                    )
                )}

            </div>
        </div>
    );
};

export default Orders;