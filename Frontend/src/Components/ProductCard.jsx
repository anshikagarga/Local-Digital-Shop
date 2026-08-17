import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {

    return (
        <div className="product-card">

            {/* Product Image */}

            <div className="product-image-container">

                {product.image ? (
                    <img
                        src={product.image}
                        alt={product.productName}
                        className="product-image"
                    />
                ) : (
                    <div className="product-image-placeholder">
                        🛍️
                    </div>
                )}

            </div>


            {/* Product Information */}

            <div className="product-card-content">

                <span className="product-category">
                    {product.category}
                </span>

                <h3 className="product-name">
                    {product.productName}
                </h3>

                <p className="product-description">
                    {product.description}
                </p>

                {product.seller && (
                    <div className="product-seller-badge" style={{ fontSize: "0.8rem", color: "#4f46e5", fontWeight: "600", marginBottom: "0.75rem" }}>
                        🏬 {product.seller.shopName || product.seller.name}{product.seller.city ? ` • 📍 ${product.seller.city}` : ""}
                    </div>
                )}


                <div className="product-card-bottom">

                    <div>

                        <span className="product-price">
                            ₹{product.price}
                        </span>

                        <p className="product-stock">
                            {product.stock > 0
                                ? `${product.stock} in stock`
                                : "Out of stock"
                            }
                        </p>

                    </div>

                    <Link
                        to={`/products/${product._id}`}
                        className="view-product-button"
                    >
                        View
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default ProductCard;