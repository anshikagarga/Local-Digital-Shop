import { Link } from "react-router-dom";
import "./ProductCard.css";

function ProductCard({ product }) {
    const image =
        product?.image ||
        product?.imageUrl ||
        product?.images?.[0];

    return (
        <article className="product-card">

            <Link
                to={`/products/${product._id}`}
                className="product-image-link"
            >
                <div className="product-image-container">

                    {image ? (
                        <img
                            src={image}
                            alt={product.productName}
                            className="product-image"
                        />
                    ) : (
                        <div className="product-image-placeholder">
                            <span>🛍️</span>
                            <p>No Image</p>
                        </div>
                    )}

                    <span className="product-category">
                        {product.category || "Local"}
                    </span>

                </div>
            </Link>

            <div className="product-card-content">

                <p className="product-shop">
                    📍 Local Seller
                </p>

                <Link
                    to={`/products/${product._id}`}
                    className="product-title"
                >
                    {product.productName}
                </Link>

                <p className="product-description">
                    {product.description
                        ? product.description.length > 75
                            ? `${product.description.slice(0, 75)}...`
                            : product.description
                        : "Quality product available from your local seller."}
                </p>

                <div className="product-card-bottom">

                    <div className="product-price">
                        ₹{product.price}
                    </div>

                    <span
                        className={
                            product.stock > 0
                                ? "stock available"
                                : "stock unavailable"
                        }
                    >
                        {product.stock > 0
                            ? `${product.stock} left`
                            : "Out of stock"}
                    </span>

                </div>

                <Link
                    to={`/products/${product._id}`}
                    className="view-product-btn"
                >
                    View Product →
                </Link>

            </div>
        </article>
    );
}

export default ProductCard;