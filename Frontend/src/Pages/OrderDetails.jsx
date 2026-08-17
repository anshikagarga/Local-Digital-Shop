import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../Services/api";
import "./OrderDetails.css";

function OrderDetails() {
    const { id } = useParams();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelling, setCancelling] = useState(false);
    const [error, setError] = useState("");
    const [cancelMessage, setCancelMessage] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await apiRequest(`/orders/${id}`);
                setOrder(data.data);
            } catch (err) {
                if (err.message.includes("Failed to fetch") || err.message.includes("ERR_CONNECTION_REFUSED")) {
                    setError("Unable to connect to server. Please check backend connection.");
                } else {
                    setError(err.message);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id]);

    const handleCancelOrder = async () => {
        if (!window.confirm("Are you sure you want to cancel this order?")) {
            return;
        }

        try {
            setCancelling(true);
            setCancelMessage("");
            const response = await apiRequest(`/orders/${id}/cancel`, {
                method: "PATCH",
            });

            setOrder(response.data);
            setCancelMessage("Order has been cancelled successfully.");
        } catch (err) {
            alert(err.message);
        } finally {
            setCancelling(false);
        }
    };

    const getStepIndex = (status) => {
        switch (status?.toLowerCase()) {
            case "pending": return 0;
            case "processing": return 1;
            case "shipped": return 2;
            case "delivered": return 3;
            default: return -1;
        }
    };

    if (loading) {
        return (
            <div className="order-details-message">
                <h2>Loading order details... 📦</h2>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="order-details-message">
                <h2>{error || "Order not found"}</h2>
                <Link to="/orders" className="back-to-orders">
                    ← Back to Orders
                </Link>
            </div>
        );
    }

    const currentStep = getStepIndex(order.orderStatus);
    const isCancelled = order.orderStatus?.toLowerCase() === "cancelled";

    return (
        <main className="order-details-page">
            <Link to="/orders" className="back-to-orders">
                ← Back to All Orders
            </Link>

            <div className="order-details-header">
                <div>
                    <span>ORDER TRACKING</span>
                    <h1>Order #{order._id}</h1>
                    <p style={{ color: "#64748b", fontSize: "0.9rem" }}>
                        Placed on {new Date(order.createdAt).toLocaleDateString()}
                    </p>
                </div>

                <span className={`order-details-status ${order.orderStatus}`}>
                    {order.orderStatus}
                </span>
            </div>

            {/* Visual Order Progress Stepper */}
            <div className="order-stepper-card">
                <h3>Order Status Progress</h3>
                {isCancelled ? (
                    <div className="cancelled-stepper-badge">
                        ❌ This order was cancelled
                    </div>
                ) : (
                    <div className="stepper-wrapper">
                        {["Pending", "Processing", "Shipped", "Delivered"].map((stepLabel, idx) => {
                            const isCompleted = idx <= currentStep;
                            const isCurrent = idx === currentStep;

                            return (
                                <div key={stepLabel} className={`step-item ${isCompleted ? "completed" : ""} ${isCurrent ? "active" : ""}`}>
                                    <div className="step-circle">{isCompleted ? "✓" : idx + 1}</div>
                                    <div className="step-label">{stepLabel}</div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>

            {/* Order Items */}
            <section className="order-items-section">
                <h2>Purchased Items ({order.items.length})</h2>

                <div className="order-items">
                    {order.items.map((item, index) => (
                        <div className="order-item" key={item.product?._id || index}>
                            <div className="order-item-image">
                                {item.product?.image ? (
                                    <img src={item.product.image} alt={item.productName} />
                                ) : (
                                    <span>🛍️</span>
                                )}
                            </div>

                            <div className="order-item-info">
                                <h3>{item.productName}</h3>
                                <p>₹{item.price} × {item.quantity}</p>
                            </div>

                            <strong>₹{item.price * item.quantity}</strong>
                        </div>
                    ))}
                </div>
            </section>

            {/* Shipping & Payment Info Grid */}
            <section className="order-info-section">
                <div className="info-card">
                    <h2>📍 Delivery Address</h2>
                    <p><strong>{order.shippingAddress.fullName}</strong></p>
                    <p>📞 Phone: {order.shippingAddress.phone}</p>
                    <p>🏠 {order.shippingAddress.address}</p>
                    <p>🌆 {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                </div>

                <div className="info-card">
                    <h2>💳 Payment Details</h2>
                    <p><strong>Method:</strong> {order.paymentMethod}</p>
                    <p><strong>Payment Status:</strong> <span style={{ color: order.paymentStatus === 'Paid' ? '#16a34a' : '#d97706', fontWeight: 'bold' }}>{order.paymentStatus}</span></p>
                    <div style={{ marginTop: "1rem", paddingTop: "0.75rem", borderTop: "1px solid #e2e8f0" }}>
                        <span style={{ color: "#64748b", fontSize: "0.9rem" }}>Total Amount:</span>
                        <h3 style={{ fontSize: "1.5rem", color: "#4f46e5", margin: 0 }}>₹{order.totalAmount}</h3>
                    </div>
                </div>
            </section>

            {cancelMessage && (
                <div style={{ background: "#ecfdf5", border: "1px solid #a7f3d0", color: "#047857", padding: "0.875rem 1.25rem", borderRadius: "0.75rem", marginBottom: "1.5rem", fontWeight: "600" }}>
                    ✓ {cancelMessage}
                </div>
            )}

            {/* Actions */}
            {order.orderStatus !== "cancelled" && order.orderStatus !== "delivered" && (
                <button
                    className="cancel-order-button"
                    disabled={cancelling}
                    onClick={handleCancelOrder}
                >
                    {cancelling ? "Cancelling Order..." : "Cancel Order"}
                </button>
            )}
        </main>
    );
}

export default OrderDetails;