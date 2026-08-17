import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../Services/api";
import { useAuth } from "../Context/AuthContext";
import "./Checkout.css";

function Checkout() {
    const { user } = useAuth();
    const navigate = useNavigate();

    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const [shippingAddress, setShippingAddress] = useState({
        fullName: user?.name || "",
        phone: user?.phone || "",
        address: user?.address || "",
        city: user?.city || "",
        state: user?.state || "",
        pincode: user?.pincode || "",
    });

    const [paymentMethod, setPaymentMethod] = useState("COD");

    useEffect(() => {
        const fetchCart = async () => {
            try {
                const response = await apiRequest("/cart");
                setCart(response.data);
                if (!response.data?.items || response.data.items.length === 0) {
                    setError("Your cart is empty. Please add items before checking out.");
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, []);

    // Update form when user context updates
    useEffect(() => {
        if (user) {
            setShippingAddress((prev) => ({
                fullName: prev.fullName || user.name || "",
                phone: prev.phone || user.phone || "",
                address: prev.address || user.address || "",
                city: prev.city || user.city || "",
                state: prev.state || user.state || "",
                pincode: prev.pincode || user.pincode || "",
            }));
        }
    }, [user]);

    const handleChange = (e) => {
        setShippingAddress({
            ...shippingAddress,
            [e.target.name]: e.target.value,
        });
    };

    const handlePlaceOrder = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        // Basic validation
        if (
            !shippingAddress.fullName ||
            !shippingAddress.phone ||
            !shippingAddress.address ||
            !shippingAddress.city ||
            !shippingAddress.state ||
            !shippingAddress.pincode
        ) {
            setError("Please fill in all required shipping address fields.");
            setSubmitting(false);
            return;
        }

        try {
            const response = await apiRequest("/orders", {
                method: "POST",
                body: JSON.stringify({
                    shippingAddress,
                    paymentMethod,
                }),
            });

            if (response.success && response.data) {
                navigate(`/orders/${response.data._id}`);
            } else {
                throw new Error("Failed to place order. Please try again.");
            }
        } catch (err) {
            setError(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="checkout-loading">
                <h2>Loading checkout details...</h2>
            </div>
        );
    }

    const items = cart?.items || [];
    const subtotal = items.reduce((acc, item) => {
        const price = item.product?.price || item.price || 0;
        return acc + price * item.quantity;
    }, 0);

    if (items.length === 0) {
        return (
            <div className="empty-checkout">
                <div className="empty-icon">🛒</div>
                <h2>Your Cart is Empty</h2>
                <p>Add some products to your cart before proceeding to checkout.</p>
                <Link to="/products" className="primary-btn">
                    Explore Products
                </Link>
            </div>
        );
    }

    return (
        <div className="checkout-page">
            <div className="checkout-header">
                <h1>Complete Your Order 🛍️</h1>
                <p>Provide your delivery details to place order</p>
            </div>

            {error && <div className="checkout-error">⚠️ {error}</div>}

            <div className="checkout-grid">
                {/* Form Column */}
                <form className="checkout-form" onSubmit={handlePlaceOrder}>
                    <div className="form-section">
                        <h2>1. Shipping Address</h2>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Full Name *</label>
                                <input
                                    type="text"
                                    name="fullName"
                                    value={shippingAddress.fullName}
                                    onChange={handleChange}
                                    placeholder="Enter full name"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={shippingAddress.phone}
                                    onChange={handleChange}
                                    placeholder="Enter 10-digit mobile number"
                                    required
                                />
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Street Address / House No. *</label>
                            <input
                                type="text"
                                name="address"
                                value={shippingAddress.address}
                                onChange={handleChange}
                                placeholder="Street address, apartment, locality"
                                required
                            />
                        </div>

                        <div className="form-row three-cols">
                            <div className="form-group">
                                <label>City *</label>
                                <input
                                    type="text"
                                    name="city"
                                    value={shippingAddress.city}
                                    onChange={handleChange}
                                    placeholder="City / Area"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>State *</label>
                                <input
                                    type="text"
                                    name="state"
                                    value={shippingAddress.state}
                                    onChange={handleChange}
                                    placeholder="State"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label>Pincode *</label>
                                <input
                                    type="text"
                                    name="pincode"
                                    value={shippingAddress.pincode}
                                    onChange={handleChange}
                                    placeholder="6-digit pincode"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <h2>2. Payment Method</h2>
                        <div className="payment-options">
                            <label className={`payment-option ${paymentMethod === "COD" ? "active" : ""}`}>
                                <input
                                    type="radio"
                                    name="paymentMethod"
                                    value="COD"
                                    checked={paymentMethod === "COD"}
                                    onChange={(e) => setPaymentMethod(e.target.value)}
                                />
                                <div className="option-details">
                                    <strong>💵 Cash on Delivery (COD)</strong>
                                    <p>Pay in cash upon doorstep delivery from local seller</p>
                                </div>
                            </label>
                        </div>
                    </div>

                    <button type="submit" className="place-order-btn" disabled={submitting}>
                        {submitting ? "Placing Order..." : `Confirm Order (₹${subtotal}) →`}
                    </button>
                </form>

                {/* Summary Column */}
                <div className="checkout-summary">
                    <h2>Order Summary ({items.length} items)</h2>
                    <div className="summary-items">
                        {items.map((item) => {
                            const name = item.product?.productName || item.productName;
                            const price = item.product?.price || item.price;
                            const image = item.product?.image;

                            return (
                                <div className="summary-item" key={item._id}>
                                    <div className="item-img-box">
                                        {image ? <img src={image} alt={name} /> : <span>🛍️</span>}
                                    </div>
                                    <div className="item-details">
                                        <h4>{name}</h4>
                                        <p>Qty: {item.quantity} × ₹{price}</p>
                                    </div>
                                    <span className="item-price">₹{price * item.quantity}</span>
                                </div>
                            );
                        })}
                    </div>

                    <div className="summary-breakdown">
                        <div className="breakdown-row">
                            <span>Subtotal</span>
                            <span>₹{subtotal}</span>
                        </div>
                        <div className="breakdown-row">
                            <span>Local Shipping</span>
                            <span className="free-badge">FREE</span>
                        </div>
                        <hr />
                        <div className="breakdown-row total-row">
                            <span>Total Payable</span>
                            <strong>₹{subtotal}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Checkout;