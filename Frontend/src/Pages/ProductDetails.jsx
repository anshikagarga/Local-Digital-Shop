import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { apiRequest } from "../services/api";
import Navbar from "../components/Navbar";
import "./ProductDetails.css";

function ProductDetails() {
    const { id } = useParams();

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await apiRequest(`/products/${id}`);
                setProduct(response.data);
            } catch (error) {
                console.error("PRODUCT DETAILS ERROR:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <>
                <Navbar />

                <main className="product-details-page">
                    <div className="product-details-loading">
                        <div className="details-skeleton-image"></div>

                        <div className="details-skeleton-content">
                            <div className="skeleton-line small"></div>
                            <div className="skeleton-line large"></div>
                            <div className="skeleton-line"></div>
                            <div className="skeleton-line"></div>
                            <div className="skeleton-price"></div>
                        </div>
                    </div>
                </main>
            </>
        );
    }

    if (error || !product) {
        return (
            <>
                <Navbar />

                <main className="product-details-page">
                    <div className="product-details-error">
                        <div className="error-icon">🛍️</div>

                        <h2>
                            {error || "Product not found"}
                        </h2>

                        <p>
                            We couldn't load this product.
                        </p>

                        <Link
                            to="/products"
                            className="details-back-button"
                        >
                            ← Back to Products
                        </Link>
                    </div>
                </main>
            </>
        );
    }

    const isInStock = product.stock > 0;

    return (
        <>
            <Navbar />

            <main className="product-details-page">

                {/* Breadcrumb */}

                <div className="product-breadcrumb">
                    <Link to="/">
                        Home
                    </Link>

                    <span> / </span>

                    <Link to="/products">
                        Products
                    </Link>

                    <span> / </span>

                    <span>
                        {product.productName}
                    </span>
                </div>


                {/* Product Details */}

                <section className="product-details-container">

                    {/* Image */}

                    <div className="product-details-image-wrapper">

                        <div className="product-details-image">

                            {product.image ? (
                                <img
                                    src={product.image}
                                    alt={product.productName}
                                />
                            ) : (
                                <div className="product-image-placeholder">
                                    🛍️
                                </div>
                            )}

                        </div>

                        {isInStock && (
                            <span className="available-badge">
                                ● Available
                            </span>
                        )}

                    </div>


                    {/* Information */}

                    <div className="product-details-content">

                        <span className="details-category">
                            {product.category}
                        </span>

                        <h1>
                            {product.productName}
                        </h1>

                        <div className="details-rating">
                            <span>★★★★★</span>
                            <span className="rating-text">
                                Local seller product
                            </span>
                        </div>

                        <p className="details-description">
                            {product.description ||
                                "Quality product available from a local seller."}
                        </p>


                        {/* Price */}

                        <div className="details-price">
                            ₹{product.price}
                        </div>


                        {/* Stock */}

                        <div className="details-stock">

                            {isInStock ? (
                                <>
                                    <span className="stock-dot"></span>

                                    <span>
                                        {product.stock} units available
                                    </span>
                                </>
                            ) : (
                                <span className="out-of-stock">
                                    Currently out of stock
                                </span>
                            )}

                        </div>


                        {/* Seller */}

                        {product.seller && (
                            <div className="seller-card">

                                <div className="seller-avatar">
                                    {product.seller.name
                                        ?.charAt(0)
                                        ?.toUpperCase() || "S"}
                                </div>

                                <div>
                                    <span>
                                        Sold by
                                    </span>

                                    <strong>
                                        {product.seller.name}
                                    </strong>
                                </div>

                            </div>
                        )}


                        {/* Actions */}

                        <div className="details-actions">

                            {isInStock ? (
                                <Link
                                    to="/cart"
                                    className="details-add-cart"
                                >
                                    <span>🛒</span>
                                    Add to Cart
                                </Link>
                            ) : (
                                <button
                                    className="details-add-cart disabled"
                                    disabled
                                >
                                    Out of Stock
                                </button>
                            )}

                            <button
                                type="button"
                                className="details-wishlist"
                                aria-label="Add to wishlist"
                            >
                                ♡
                            </button>

                        </div>


                        {/* Features */}

                        <div className="product-features">

                            <div className="feature-item">
                                <span>🚚</span>

                                <div>
                                    <strong>
                                        Local Delivery
                                    </strong>

                                    <p>
                                        Convenient delivery from nearby sellers
                                    </p>
                                </div>
                            </div>


                            <div className="feature-item">
                                <span>🔒</span>

                                <div>
                                    <strong>
                                        Secure Shopping
                                    </strong>

                                    <p>
                                        Your personal information stays private
                                    </p>
                                </div>
                            </div>


                            <div className="feature-item">
                                <span>↩️</span>

                                <div>
                                    <strong>
                                        Easy Support
                                    </strong>

                                    <p>
                                        Get help whenever you need it
                                    </p>
                                </div>
                            </div>

                        </div>

                    </div>

                </section>

            </main>
        </>
    );
}

export default ProductDetails;