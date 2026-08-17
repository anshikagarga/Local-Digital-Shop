import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../Services/api";
import "./Wishlist.css";

function Wishlist() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [actionId, setActionId] = useState(null);
    const [message, setMessage] = useState("");

    const fetchWishlist = async () => {
        try {
            const data = await apiRequest("/wishlist");
            if (data.data && Array.isArray(data.data.products)) {
                setProducts(data.data.products);
            } else if (Array.isArray(data.data)) {
                setProducts(data.data);
            } else {
                setProducts([]);
            }
            setError("");
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchWishlist();
    }, []);

    const handleRemove = async (productId) => {
        try {
            setActionId(productId);
            const response = await apiRequest(`/wishlist/${productId}`, {
                method: "DELETE",
            });
            if (response.data && Array.isArray(response.data.products)) {
                setProducts(response.data.products);
            } else {
                setProducts((prev) => prev.filter((p) => p._id !== productId));
            }
            setMessage("Removed from wishlist");
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setActionId(null);
        }
    };

    const handleAddToCart = async (product) => {
        try {
            setActionId(product._id);
            await apiRequest("/cart", {
                method: "POST",
                body: JSON.stringify({
                    productId: product._id,
                    quantity: 1,
                }),
            });
            setMessage(`"${product.productName}" added to cart! 🛒`);
            setTimeout(() => setMessage(""), 3000);
        } catch (err) {
            setError(err.message);
        } finally {
            setActionId(null);
        }
    };

    if (loading) {
        return (
            <div className="wishlist-loading">
                <h2>Loading your wishlist... ❤️</h2>
            </div>
        );
    }

    if (error) {
        return (
            <div className="wishlist-error">
                <h2>Error: {error}</h2>
                <Link to="/" className="back-btn">
                    Back to Home
                </Link>
            </div>
        );
    }

    return (
        <main className="wishlist-page">
            <div className="wishlist-header">
                <span>SAVED ITEMS</span>
                <h1>My Wishlist ❤️</h1>
                <p>Keep track of products you love and want to purchase</p>
            </div>

            {message && <div className="wishlist-toast">✓ {message}</div>}

            {products.length === 0 ? (
                <div className="empty-wishlist">
                    <div className="empty-heart-icon">💖</div>
                    <h2>Your Wishlist is Empty</h2>
                    <p>Explore our local marketplace and save items you like!</p>
                    <Link to="/products" className="explore-btn">
                        Explore Products →
                    </Link>
                </div>
            ) : (
                <div className="wishlist-grid">
                    {products.map((product) => (
                        <div key={product._id} className="wishlist-card">
                            <div className="wishlist-image-box">
                                {product.image ? (
                                    <img src={product.image} alt={product.productName} />
                                ) : (
                                    <div className="image-placeholder">🛍️</div>
                                )}
                                <span className="wishlist-category">{product.category}</span>
                            </div>

                            <div className="wishlist-content">
                                <h3 className="wishlist-title">{product.productName}</h3>
                                <p className="wishlist-desc">{product.description}</p>
                                <div className="wishlist-price-stock">
                                    <span className="wishlist-price">₹{product.price}</span>
                                    <span className={`stock-badge ${product.stock > 0 ? "in-stock" : "out-of-stock"}`}>
                                        {product.stock > 0 ? `${product.stock} in stock` : "Out of Stock"}
                                    </span>
                                </div>

                                <div className="wishlist-actions">
                                    <button
                                        type="button"
                                        className="add-cart-btn"
                                        disabled={actionId === product._id || product.stock <= 0}
                                        onClick={() => handleAddToCart(product)}
                                    >
                                        Add to Cart 🛒
                                    </button>
                                    <button
                                        type="button"
                                        className="remove-wishlist-btn"
                                        disabled={actionId === product._id}
                                        onClick={() => handleRemove(product._id)}
                                    >
                                        🗑️
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}

export default Wishlist;