import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import "./Products.css";

const API_URL =
    import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const FALLBACK_IMAGE = "/images/product-placeholder.png";

const containerVariants = {
    hidden: {},
    visible: {
        transition: {
            staggerChildren: 0.06,
        },
    },
};

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 25,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration: 0.45,
            ease: "easeOut",
        },
    },
};

function Products() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [sort, setSort] = useState("default");

    const [wishlist, setWishlist] = useState(() => {
        try {
            const saved = localStorage.getItem("wishlist");
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    const [cartLoading, setCartLoading] = useState(null);

    // ==========================================
    // PRODUCT NAME
    // ==========================================

    const getProductName = (product) => {
        return (
            product?.productName ||
            product?.name ||
            "Unnamed Product"
        );
    };

    // ==========================================
    // PRODUCT ID
    // ==========================================

    const getProductId = (product) => {
        return product?._id || product?.id;
    };

    // ==========================================
    // FETCH PRODUCTS
    // ==========================================

    useEffect(() => {
        let cancelled = false;

        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    `${API_URL}/products`
                );

                if (!response.ok) {
                    throw new Error(
                        `Request failed: ${response.status}`
                    );
                }

                const result = await response.json();

                console.log("PRODUCT API RESPONSE:", result);

                const receivedProducts =
                    result?.data?.products ||
                    result?.data ||
                    result?.products ||
                    [];

                if (!Array.isArray(receivedProducts)) {
                    throw new Error(
                        "Invalid products response"
                    );
                }

                if (!cancelled) {
                    setProducts(receivedProducts);
                }
            } catch (err) {
                console.error(
                    "Products fetch error:",
                    err
                );

                if (!cancelled) {
                    setError(
                        "Unable to load products right now."
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        };

        fetchProducts();

        return () => {
            cancelled = true;
        };
    }, []);

    // ==========================================
    // CATEGORIES
    // ==========================================

    const categories = useMemo(() => {
        const uniqueCategories = products
            .map((product) => product.category)
            .filter(Boolean)
            .map((item) => String(item).trim())
            .filter(Boolean);

        return [
            "All",
            ...Array.from(
                new Set(uniqueCategories)
            ),
        ];
    }, [products]);

    // ==========================================
    // FILTER + SORT
    // ==========================================

    const filteredProducts = useMemo(() => {
        let result = [...products];

        const searchValue =
            search.trim().toLowerCase();

        if (searchValue) {
            result = result.filter((product) => {
                const name =
                    getProductName(product).toLowerCase();

                const description =
                    product.description?.toLowerCase() || "";

                const productCategory =
                    product.category?.toLowerCase() || "";

                return (
                    name.includes(searchValue) ||
                    description.includes(searchValue) ||
                    productCategory.includes(searchValue)
                );
            });
        }

        if (category !== "All") {
            result = result.filter(
                (product) =>
                    String(product.category || "")
                        .toLowerCase() ===
                    category.toLowerCase()
            );
        }

        switch (sort) {
            case "price-low":
                result.sort(
                    (a, b) =>
                        Number(a.price || 0) -
                        Number(b.price || 0)
                );
                break;

            case "price-high":
                result.sort(
                    (a, b) =>
                        Number(b.price || 0) -
                        Number(a.price || 0)
                );
                break;

            case "name":
                result.sort((a, b) =>
                    getProductName(a).localeCompare(
                        getProductName(b)
                    )
                );
                break;

            default:
                break;
        }

        return result;
    }, [products, search, category, sort]);

    // ==========================================
    // WISHLIST
    // ==========================================

    useEffect(() => {
        try {
            localStorage.setItem(
                "wishlist",
                JSON.stringify(wishlist)
            );
        } catch {
            // Ignore localStorage errors
        }
    }, [wishlist]);

    const isWishlisted = (product) => {
        const id = getProductId(product);

        return wishlist.some(
            (item) =>
                String(
                    item?._id ||
                    item?.id ||
                    item
                ) === String(id)
        );
    };

    const toggleWishlist = (product) => {
        const id = getProductId(product);

        if (!id) return;

        setWishlist((previous) => {
            const exists = previous.some(
                (item) =>
                    String(
                        item?._id ||
                        item?.id ||
                        item
                    ) === String(id)
            );

            if (exists) {
                return previous.filter(
                    (item) =>
                        String(
                            item?._id ||
                            item?.id ||
                            item
                        ) !== String(id)
                );
            }

            return [...previous, product];
        });
    };

    // ==========================================
    // ADD TO CART
    // ==========================================

    const addToCart = async (product) => {
        const id = getProductId(product);

        if (!id) return;

        try {
            setCartLoading(id);

            const token =
                localStorage.getItem("token");

            const headers = {
                "Content-Type":
                    "application/json",
            };

            if (token) {
                headers.Authorization =
                    `Bearer ${token}`;
            }

            const response = await fetch(
                `${API_URL}/cart`,
                {
                    method: "POST",
                    headers,
                    body: JSON.stringify({
                        productId: id,
                        quantity: 1,
                    }),
                }
            );

            const result =
                await response.json();

            if (!response.ok) {
                throw new Error(
                    result?.message ||
                    "Unable to add product to cart."
                );
            }

            window.dispatchEvent(
                new CustomEvent("cartUpdated")
            );

            alert("Product added to cart!");
        } catch (err) {
            console.error(
                "Add to cart error:",
                err
            );

            alert(
                err.message ||
                "Unable to add this product to cart."
            );
        } finally {
            setCartLoading(null);
        }
    };

    // ==========================================
    // IMAGE
    // ==========================================

    const getProductImage = (product) => {
        return (
            product?.image ||
            product?.imageUrl ||
            product?.images?.[0] ||
            FALLBACK_IMAGE
        );
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
        image.src = FALLBACK_IMAGE;
    };

    // ==========================================
    // STOCK
    // ==========================================

    const getStock = (product) => {
        if (
            product.stock === undefined ||
            product.stock === null
        ) {
            return null;
        }

        return Number(product.stock);
    };

    const isOutOfStock = (product) => {
        const stock = getStock(product);

        return (
            stock !== null &&
            stock <= 0
        );
    };

    const getStockText = (product) => {
        const stock = getStock(product);

        if (stock === null) {
            return "Available";
        }

        if (stock <= 0) {
            return "Out of stock";
        }

        if (stock <= 5) {
            return `${stock} left`;
        }

        return "In stock";
    };

    // ==========================================
    // SELLER
    // ==========================================

    const getSellerName = (product) => {
        if (product.seller?.shopName) {
            return product.seller.shopName;
        }

        if (product.shopName) {
            return product.shopName;
        }

        if (
            typeof product.seller === "string"
        ) {
            return product.seller;
        }

        return "Local Seller";
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <main className="products-page">
                <div className="products-container">
                    <div className="products-grid">
                        {Array.from({
                            length: 8,
                        }).map((_, index) => (
                            <ProductSkeleton
                                key={index}
                            />
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    // ==========================================
    // RENDER
    // ==========================================

    return (
        <main className="products-page">

            {/* HEADER */}

            <section className="products-header">
                <div className="products-container">

                    <motion.div
                        className="products-heading"
                        initial={{
                            opacity: 0,
                            y: 25,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            duration: 0.55,
                        }}
                    >
                        <span>
                            LOCAL MARKETPLACE
                        </span>

                        <h1>
                            Discover products
                            <br />
                            <strong>near you.</strong>
                        </h1>

                        <p>
                            Explore products from
                            local sellers and businesses.
                        </p>
                    </motion.div>

                    {/* SEARCH */}

                    <motion.div
                        className="products-search"
                        initial={{
                            opacity: 0,
                            y: 20,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        transition={{
                            delay: 0.15,
                            duration: 0.55,
                        }}
                    >
                        <span
                            className="search-icon"
                            aria-hidden="true"
                        >
                            🔍
                        </span>

                        <input
                            type="search"
                            value={search}
                            onChange={(event) =>
                                setSearch(
                                    event.target.value
                                )
                            }
                            placeholder="Search products..."
                            aria-label="Search products"
                        />

                        {search && (
                            <button
                                type="button"
                                className="clear-search"
                                onClick={() =>
                                    setSearch("")
                                }
                            >
                                ×
                            </button>
                        )}
                    </motion.div>

                </div>
            </section>

            {/* FILTER BAR */}

            <section className="products-controls">
                <div className="products-container">

                    <div className="filter-row">

                        <div className="filter-group">
                            <label htmlFor="category">
                                Category
                            </label>

                            <select
                                id="category"
                                value={category}
                                onChange={(event) =>
                                    setCategory(
                                        event.target.value
                                    )
                                }
                            >
                                {categories.map(
                                    (item) => (
                                        <option
                                            key={item}
                                            value={item}
                                        >
                                            {item}
                                        </option>
                                    )
                                )}
                            </select>
                        </div>

                        <div className="filter-group">
                            <label htmlFor="sort">
                                Sort by
                            </label>

                            <select
                                id="sort"
                                value={sort}
                                onChange={(event) =>
                                    setSort(
                                        event.target.value
                                    )
                                }
                            >
                                <option value="default">
                                    Recommended
                                </option>

                                <option value="price-low">
                                    Price: Low to High
                                </option>

                                <option value="price-high">
                                    Price: High to Low
                                </option>

                                <option value="name">
                                    Name
                                </option>
                            </select>
                        </div>

                        <button
                            type="button"
                            className="location-filter"
                        >
                            📍
                            <span>Nearby</span>
                            <small>
                                Coming soon
                            </small>
                        </button>

                        <div className="result-count">
                            {filteredProducts.length}{" "}
                            {filteredProducts.length === 1
                                ? "product"
                                : "products"}
                        </div>

                    </div>
                </div>
            </section>

            {/* CONTENT */}

            <section className="products-content">
                <div className="products-container">

                    {/* ERROR */}

                    {error && (
                        <div className="products-state">
                            <div className="state-icon">
                                ⚠️
                            </div>

                            <h2>
                                Products unavailable
                            </h2>

                            <p>{error}</p>

                            <button
                                onClick={() =>
                                    window.location.reload()
                                }
                            >
                                Try Again
                            </button>
                        </div>
                    )}

                    {/* EMPTY */}

                    {!error &&
                        filteredProducts.length ===
                            0 && (
                            <div className="products-state">
                                <div className="state-icon">
                                    🔎
                                </div>

                                <h2>
                                    No products found
                                </h2>

                                <p>
                                    Try changing your
                                    search or category.
                                </p>

                                <button
                                    onClick={() => {
                                        setSearch("");
                                        setCategory("All");
                                        setSort("default");
                                    }}
                                >
                                    Clear Filters
                                </button>
                            </div>
                        )}

                    {/* PRODUCT GRID */}

                    {!error &&
                        filteredProducts.length >
                            0 && (
                            <motion.div
                                className="products-grid"
                                variants={
                                    containerVariants
                                }
                                initial="hidden"
                                animate="visible"
                            >
                                {filteredProducts.map(
                                    (product) => {

                                        const id =
                                            getProductId(
                                                product
                                            );

                                        const productName =
                                            getProductName(
                                                product
                                            );

                                        const image =
                                            getProductImage(
                                                product
                                            );

                                        const outOfStock =
                                            isOutOfStock(
                                                product
                                            );

                                        const wished =
                                            isWishlisted(
                                                product
                                            );

                                        return (
                                            <motion.article
                                                className="product-card"
                                                key={id}
                                                variants={
                                                    cardVariants
                                                }
                                                whileHover={{
                                                    y: -6,
                                                }}
                                            >

                                                {/* IMAGE */}

                                                <div className="product-image">

                                                    <Link
                                                        to={`/products/${id}`}
                                                        className="product-image-link"
                                                    >
                                                        <img
                                                            src={
                                                                image
                                                            }
                                                            alt={
                                                                productName
                                                            }
                                                            loading="lazy"
                                                            onError={
                                                                handleImageError
                                                            }
                                                        />
                                                    </Link>

                                                    {product.category && (
                                                        <span className="product-category">
                                                            {
                                                                product.category
                                                            }
                                                        </span>
                                                    )}

                                                    <button
                                                        type="button"
                                                        className={`wishlist-button ${
                                                            wished
                                                                ? "active"
                                                                : ""
                                                        }`}
                                                        onClick={() =>
                                                            toggleWishlist(
                                                                product
                                                            )
                                                        }
                                                        aria-label={
                                                            wished
                                                                ? `Remove ${productName} from wishlist`
                                                                : `Add ${productName} to wishlist`
                                                        }
                                                    >
                                                        {wished
                                                            ? "♥"
                                                            : "♡"}
                                                    </button>

                                                </div>

                                                {/* CONTENT */}

                                                <div className="product-card-content">

                                                    <div className="product-meta">

                                                        <span
                                                            className={
                                                                outOfStock
                                                                    ? "out"
                                                                    : "in"
                                                            }
                                                        >
                                                            {getStockText(
                                                                product
                                                            )}
                                                        </span>

                                                    </div>

                                                    <Link
                                                        to={`/products/${id}`}
                                                        className="product-name"
                                                    >
                                                        {
                                                            productName
                                                        }
                                                    </Link>

                                                    <div className="seller-name">
                                                        {getSellerName(
                                                            product
                                                        )}
                                                    </div>

                                                    {product.seller
                                                        ?.city && (
                                                        <div className="product-location">
                                                            📍{" "}
                                                            {
                                                                product
                                                                    .seller
                                                                    .city
                                                            }
                                                        </div>
                                                    )}

                                                    <div className="product-bottom">

                                                        <strong className="product-price">
                                                            ₹
                                                            {Number(
                                                                product.price ||
                                                                    0
                                                            ).toLocaleString(
                                                                "en-IN"
                                                            )}
                                                        </strong>

                                                        <button
                                                            type="button"
                                                            className="add-cart-button"
                                                            disabled={
                                                                outOfStock ||
                                                                cartLoading ===
                                                                    id
                                                            }
                                                            onClick={() =>
                                                                addToCart(
                                                                    product
                                                                )
                                                            }
                                                        >
                                                            {cartLoading ===
                                                            id
                                                                ? "Adding..."
                                                                : outOfStock
                                                                ? "Unavailable"
                                                                : "Add to Cart"}
                                                        </button>

                                                    </div>

                                                </div>

                                            </motion.article>
                                        );
                                    }
                                )}
                            </motion.div>
                        )}

                </div>
            </section>

        </main>
    );
}

// ==========================================
// SKELETON
// ==========================================

function ProductSkeleton() {
    return (
        <div className="product-skeleton">

            <div className="skeleton-product-image" />

            <div className="skeleton-product-content">

                <div className="skeleton-small" />

                <div className="skeleton-title" />

                <div className="skeleton-title short" />

                <div className="skeleton-bottom" />

            </div>

        </div>
    );
}

export default Products;