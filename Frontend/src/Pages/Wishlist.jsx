import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { apiRequest, isAuthError } from "../services/api";
import "./Wishlist.css";

const FALLBACK_IMAGE = "/images/product-placeholder.png";

const Wishlist = () => {
    const navigate = useNavigate();

    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [removingId, setRemovingId] = useState(null);
    const [cartLoadingId, setCartLoadingId] = useState(null);

    /* =====================================================
       FETCH WISHLIST
    ===================================================== */

    const fetchWishlist = useCallback(async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiRequest("/wishlist");

            const data =
                response?.data ||
                response?.wishlist ||
                response;

            let items = [];

            if (Array.isArray(data)) {
                items = data;
            } else if (Array.isArray(data?.items)) {
                items = data.items;
            } else if (Array.isArray(data?.products)) {
                items = data.products;
            }

            setWishlist(items);
        } catch (err) {
            console.error("Wishlist fetch error:", err);

            if (isAuthError(err)) {
                navigate("/login", {
                    state: {
                        from: "/wishlist",
                    },
                });

                return;
            }

            setError(
                err?.message ||
                    "Unable to load your wishlist."
            );
        } finally {
            setLoading(false);
        }
    }, [navigate]);

    useEffect(() => {
        fetchWishlist();
    }, [fetchWishlist]);

    /* =====================================================
       HELPERS
    ===================================================== */

    const getProduct = (item) => {
        return (
            item?.product ||
            item?.productId ||
            item
        );
    };

    const getProductId = (item) => {
        const product = getProduct(item);

        return (
            product?._id ||
            product?.id ||
            item?._id ||
            item?.id
        );
    };

    const getProductName = (item) => {
        const product = getProduct(item);

        return (
            product?.name ||
            product?.title ||
            "Unnamed Product"
        );
    };

    const getProductPrice = (item) => {
        const product = getProduct(item);

        return Number(
            product?.price ||
                item?.price ||
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
            FALLBACK_IMAGE
        );
    };

    const getStock = (item) => {
        const product = getProduct(item);

        return product?.stock;
    };

    const getCategory = (item) => {
        const product = getProduct(item);

        return product?.category || "";
    };

    const formatPrice = (price) => {
        return Number(price || 0).toLocaleString(
            "en-IN"
        );
    };

    /* =====================================================
       REMOVE FROM WISHLIST
    ===================================================== */

    const removeFromWishlist = async (item) => {
        const productId = getProductId(item);

        if (!productId) return;

        try {
            setRemovingId(productId);
            setError("");

            await apiRequest(
                `/wishlist/${productId}`,
                {
                    method: "DELETE",
                }
            );

            setWishlist((current) =>
                current.filter(
                    (wishlistItem) =>
                        String(
                            getProductId(
                                wishlistItem
                            )
                        ) !==
                        String(productId)
                )
            );

            window.dispatchEvent(
                new CustomEvent("wishlistUpdated")
            );
        } catch (err) {
            console.error(
                "Remove wishlist error:",
                err
            );

            if (isAuthError(err)) {
                navigate("/login", {
                    state: {
                        from: "/wishlist",
                    },
                });

                return;
            }

            setError(
                err?.message ||
                    "Unable to remove item."
            );
        } finally {
            setRemovingId(null);
        }
    };

    /* =====================================================
       ADD TO CART
    ===================================================== */

    const addToCart = async (item) => {
        const productId = getProductId(item);

        if (!productId) return;

        try {
            setCartLoadingId(productId);
            setError("");

            await apiRequest("/cart", {
                method: "POST",
                body: JSON.stringify({
                    productId,
                    quantity: 1,
                }),
            });

            window.dispatchEvent(
                new CustomEvent("cartUpdated")
            );

        } catch (err) {
            console.error(
                "Add wishlist item to cart error:",
                err
            );

            if (isAuthError(err)) {
                navigate("/login", {
                    state: {
                        from: "/wishlist",
                    },
                });

                return;
            }

            setError(
                err?.message ||
                    "Unable to add product to cart."
            );
        } finally {
            setCartLoadingId(null);
        }
    };

    /* =====================================================
       IMAGE FALLBACK
    ===================================================== */

    const handleImageError = (event) => {
        const image = event.currentTarget;

        if (
            image.dataset.fallbackApplied ===
            "true"
        ) {
            return;
        }

        image.dataset.fallbackApplied = "true";
        image.src = FALLBACK_IMAGE;
    };

    /* =====================================================
       LOADING
    ===================================================== */

    if (loading) {
        return (
            <main className="wishlist-page">
                <div className="wishlist-container">
                    <WishlistSkeleton />
                </div>
            </main>
        );
    }

    /* =====================================================
       EMPTY
    ===================================================== */

    if (!wishlist.length) {
        return (
            <main className="wishlist-page">
                <div className="wishlist-container">

                    <motion.section
                        className="wishlist-empty"
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                    >
                        <div className="wishlist-empty-icon">
                            <svg
                                viewBox="0 0 24 24"
                                aria-hidden="true"
                            >
                                <path
                                    d="M20.8 8.8c0 5.2-8.8 10.2-8.8 10.2S3.2 14 3.2 8.8A4.8 4.8 0 0 1 12 6.1a4.8 4.8 0 0 1 8.8 2.7Z"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.6"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>

                        <h1>
                            Your wishlist is empty
                        </h1>

                        <p>
                            Save products you love
                            and come back to them
                            whenever you are ready.
                        </p>

                        <Link
                            to="/products"
                            className="wishlist-browse-button"
                        >
                            Discover Products
                        </Link>
                    </motion.section>

                </div>
            </main>
        );
    }

    /* =====================================================
       MAIN
    ===================================================== */

    return (
        <main className="wishlist-page">

            <div className="wishlist-container">

                {/* HEADER */}

                <motion.header
                    className="wishlist-header"
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
                        <span className="wishlist-eyebrow">
                            SAVED FOR LATER
                        </span>

                        <h1>
                            My Wishlist
                        </h1>

                        <p>
                            {wishlist.length}{" "}
                            {wishlist.length === 1
                                ? "product"
                                : "products"}{" "}
                            saved.
                        </p>
                    </div>

                    <Link
                        to="/products"
                        className="wishlist-shop-link"
                    >
                        Continue Shopping
                    </Link>
                </motion.header>

                {/* ERROR */}

                {error && (
                    <div
                        className="wishlist-error"
                        role="alert"
                    >
                        <span>{error}</span>

                        <button
                            type="button"
                            onClick={() =>
                                setError("")
                            }
                            aria-label="Close error"
                        >
                            ×
                        </button>
                    </div>
                )}

                {/* GRID */}

                <section
                    className="wishlist-grid"
                    aria-label="Wishlist products"
                >
                    {wishlist.map(
                        (item, index) => {
                            const productId =
                                getProductId(item);

                            const stock =
                                getStock(item);

                            const outOfStock =
                                stock !== undefined &&
                                stock !== null &&
                                Number(stock) <= 0;

                            const isRemoving =
                                String(
                                    removingId
                                ) ===
                                String(productId);

                            const isAdding =
                                String(
                                    cartLoadingId
                                ) ===
                                String(productId);

                            return (
                                <motion.article
                                    className="wishlist-card"
                                    key={
                                        productId ||
                                        index
                                    }
                                    initial={{
                                        opacity: 0,
                                        y: 20,
                                    }}
                                    animate={{
                                        opacity: 1,
                                        y: 0,
                                    }}
                                    transition={{
                                        delay:
                                            index *
                                            0.04,
                                    }}
                                >

                                    {/* IMAGE */}

                                    <div className="wishlist-image-wrapper">

                                        <Link
                                            to={`/products/${productId}`}
                                            className="wishlist-image-link"
                                        >
                                            <img
                                                src={getProductImage(
                                                    item
                                                )}
                                                alt={getProductName(
                                                    item
                                                )}
                                                className="wishlist-image"
                                                onError={
                                                    handleImageError
                                                }
                                            />
                                        </Link>

                                        <button
                                            type="button"
                                            className="wishlist-remove"
                                            onClick={() =>
                                                removeFromWishlist(
                                                    item
                                                )
                                            }
                                            disabled={
                                                isRemoving
                                            }
                                            aria-label={`Remove ${getProductName(
                                                item
                                            )} from wishlist`}
                                        >
                                            <svg
                                                viewBox="0 0 24 24"
                                                aria-hidden="true"
                                            >
                                                <path
                                                    d="M18 6 6 18M6 6l12 12"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    strokeWidth="1.8"
                                                    strokeLinecap="round"
                                                />
                                            </svg>
                                        </button>

                                        {outOfStock && (
                                            <span className="wishlist-stock-badge out">
                                                Out of stock
                                            </span>
                                        )}

                                        {!outOfStock &&
                                            stock !==
                                                undefined &&
                                            stock !==
                                                null && (
                                                <span className="wishlist-stock-badge">
                                                    In stock
                                                </span>
                                            )}

                                    </div>

                                    {/* CONTENT */}

                                    <div className="wishlist-card-content">

                                        {getCategory(
                                            item
                                        ) && (
                                            <span className="wishlist-category">
                                                {
                                                    getCategory(
                                                        item
                                                    )
                                                }
                                            </span>
                                        )}

                                        <Link
                                            to={`/products/${productId}`}
                                            className="wishlist-product-name"
                                        >
                                            {getProductName(
                                                item
                                            )}
                                        </Link>

                                        <div className="wishlist-card-bottom">

                                            <strong className="wishlist-price">
                                                ₹
                                                {formatPrice(
                                                    getProductPrice(
                                                        item
                                                    )
                                                )}
                                            </strong>

                                        </div>

                                        <div className="wishlist-actions">

                                            <button
                                                type="button"
                                                className="wishlist-cart-button"
                                                disabled={
                                                    outOfStock ||
                                                    isAdding
                                                }
                                                onClick={() =>
                                                    addToCart(
                                                        item
                                                    )
                                                }
                                            >
                                                {isAdding
                                                    ? "Adding..."
                                                    : outOfStock
                                                    ? "Out of Stock"
                                                    : "Add to Cart"}
                                            </button>

                                            <Link
                                                to={`/products/${productId}`}
                                                className="wishlist-details-button"
                                            >
                                                View
                                            </Link>

                                        </div>

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


/* =====================================================
   SKELETON
===================================================== */

const WishlistSkeleton = () => {
    return (
        <div className="wishlist-skeleton">

            <div className="wishlist-skeleton-heading" />

            <div className="wishlist-skeleton-grid">

                {[1, 2, 3, 4].map(
                    (item) => (
                        <div
                            className="wishlist-skeleton-card"
                            key={item}
                        >
                            <div className="wishlist-skeleton-image" />

                            <div className="wishlist-skeleton-line large" />

                            <div className="wishlist-skeleton-line small" />

                            <div className="wishlist-skeleton-button" />
                        </div>
                    )
                )}

            </div>

        </div>
    );
};

export default Wishlist;