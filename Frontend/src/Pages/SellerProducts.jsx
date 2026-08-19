import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { apiRequest } from "../Services/api";
import "./SellerProducts.css";

function SellerProducts() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    const [deleteLoading, setDeleteLoading] = useState(null);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await apiRequest("/products/my-products");

            setProducts(response?.data || []);
        } catch (err) {
            console.error("MY PRODUCTS ERROR:", err);
            setError(
                err?.message ||
                    "Unable to load your products."
            );
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) return;

        try {
            setDeleteLoading(id);
            setError("");
            setMessage("");

            await apiRequest(`/products/${id}`, {
                method: "DELETE",
            });

            setProducts((prev) =>
                prev.filter((product) => product._id !== id)
            );

            setMessage("Product deleted successfully.");

            setTimeout(() => {
                setMessage("");
            }, 3000);
        } catch (err) {
            console.error("DELETE PRODUCT ERROR:", err);

            setError(
                err?.message ||
                    "Unable to delete product."
            );
        } finally {
            setDeleteLoading(null);
        }
    };

    const filteredProducts = useMemo(() => {
        return products.filter((product) => {
            const searchText = search.toLowerCase().trim();

            const matchesSearch =
                !searchText ||
                product.productName
                    ?.toLowerCase()
                    .includes(searchText) ||
                product.category
                    ?.toLowerCase()
                    .includes(searchText);

            const stock = Number(product.stock || 0);

            let matchesFilter = true;

            if (filter === "active") {
                matchesFilter = stock > 0;
            }

            if (filter === "out-of-stock") {
                matchesFilter = stock === 0;
            }

            return matchesSearch && matchesFilter;
        });
    }, [products, search, filter]);

    const totalStock = products.reduce(
        (total, product) =>
            total + Number(product.stock || 0),
        0
    );

    const totalValue = products.reduce(
        (total, product) =>
            total +
            Number(product.price || 0) *
                Number(product.stock || 0),
        0
    );

    const outOfStock = products.filter(
        (product) =>
            Number(product.stock || 0) === 0
    ).length;

    return (
        <main className="seller-products-page">

            {/* BACKGROUND DECORATION */}

            <div className="products-bg-orb products-orb-one" />
            <div className="products-bg-orb products-orb-two" />


            {/* HEADER */}

            <motion.header
                className="products-page-header"
                initial={{ opacity: 0, y: -25 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
            >
                <div className="products-title-area">

                    <span className="products-eyebrow">
                        SELLER INVENTORY
                    </span>

                    <h1>
                        My Products
                        <span className="title-dot">.</span>
                    </h1>

                    <p>
                        Manage, monitor and grow your
                        local product inventory.
                    </p>
                </div>

                <Link
                    to="/seller/products/add"
                    className="add-product-btn"
                >
                    <span className="add-btn-icon">
                        +
                    </span>

                    <span>
                        Add Product
                    </span>
                </Link>
            </motion.header>


            {/* SUMMARY */}

            <motion.section
                className="inventory-summary"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{
                    duration: 0.5,
                    delay: 0.15,
                }}
            >

                <div className="summary-card">
                    <div className="summary-icon purple">
                        📦
                    </div>

                    <div>
                        <span>
                            Total Products
                        </span>

                        <strong>
                            {products.length}
                        </strong>
                    </div>
                </div>


                <div className="summary-card">
                    <div className="summary-icon blue">
                        📊
                    </div>

                    <div>
                        <span>
                            Total Stock
                        </span>

                        <strong>
                            {totalStock}
                        </strong>
                    </div>
                </div>


                <div className="summary-card">
                    <div className="summary-icon green">
                        ₹
                    </div>

                    <div>
                        <span>
                            Inventory Value
                        </span>

                        <strong>
                            ₹{totalValue.toLocaleString("en-IN")}
                        </strong>
                    </div>
                </div>


                <div className="summary-card">
                    <div className="summary-icon orange">
                        ⚠
                    </div>

                    <div>
                        <span>
                            Out of Stock
                        </span>

                        <strong>
                            {outOfStock}
                        </strong>
                    </div>
                </div>

            </motion.section>


            {/* ALERTS */}

            <AnimatePresence>
                {message && (
                    <motion.div
                        className="products-alert success"
                        initial={{
                            opacity: 0,
                            y: -10,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            y: -10,
                        }}
                    >
                        ✓ {message}
                    </motion.div>
                )}

                {error && (
                    <motion.div
                        className="products-alert error"
                        initial={{
                            opacity: 0,
                            y: -10,
                        }}
                        animate={{
                            opacity: 1,
                            y: 0,
                        }}
                        exit={{
                            opacity: 0,
                            y: -10,
                        }}
                    >
                        ⚠ {error}
                    </motion.div>
                )}
            </AnimatePresence>


            {/* TOOLBAR */}

            <motion.section
                className="products-toolbar"
                initial={{
                    opacity: 0,
                    y: 20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    duration: 0.5,
                    delay: 0.25,
                }}
            >

                <div className="toolbar-left">

                    <div className="product-search">

                        <span>
                            🔍
                        </span>

                        <input
                            type="text"
                            placeholder="Search your products..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                        {search && (
                            <button
                                type="button"
                                onClick={() =>
                                    setSearch("")
                                }
                            >
                                ×
                            </button>
                        )}
                    </div>

                </div>


                <div className="toolbar-right">

                    <div className="filter-label">
                        Filter
                    </div>

                    <select
                        className="product-filter"
                        value={filter}
                        onChange={(e) =>
                            setFilter(e.target.value)
                        }
                    >
                        <option value="all">
                            All Products
                        </option>

                        <option value="active">
                            In Stock
                        </option>

                        <option value="out-of-stock">
                            Out of Stock
                        </option>
                    </select>

                </div>

            </motion.section>


            {/* CONTENT */}

            <section className="products-content">

                <div className="products-content-header">

                    <div>
                        <span>
                            YOUR INVENTORY
                        </span>

                        <h2>
                            {filteredProducts.length}{" "}
                            {filteredProducts.length === 1
                                ? "Product"
                                : "Products"}
                        </h2>
                    </div>

                    <div className="inventory-status">
                        <span className="status-dot" />
                        Inventory synced
                    </div>

                </div>


                {/* LOADING */}

                {loading && (
                    <div className="products-loading">

                        <div className="loading-spinner" />

                        <h3>
                            Loading your products...
                        </h3>

                        <p>
                            Fetching your latest inventory.
                        </p>

                    </div>
                )}


                {/* EMPTY */}

                {!loading &&
                    products.length === 0 && (
                        <motion.div
                            className="products-empty"
                            initial={{
                                opacity: 0,
                                scale: 0.96,
                            }}
                            animate={{
                                opacity: 1,
                                scale: 1,
                            }}
                        >

                            <div className="empty-icon-wrapper">
                                <div className="products-empty-icon">
                                    📦
                                </div>
                            </div>

                            <span className="empty-eyebrow">
                                YOUR INVENTORY IS EMPTY
                            </span>

                            <h2>
                                Start building your shop
                            </h2>

                            <p>
                                Add your first product and
                                start reaching customers
                                around you.
                            </p>

                            <Link
                                to="/seller/products/add"
                                className="empty-add-product-btn"
                            >
                                <span>+</span>
                                Add Your First Product
                            </Link>

                        </motion.div>
                    )}


                {/* NO SEARCH RESULT */}

                {!loading &&
                    products.length > 0 &&
                    filteredProducts.length === 0 && (
                        <motion.div
                            className="products-empty search-empty"
                            initial={{
                                opacity: 0,
                            }}
                            animate={{
                                opacity: 1,
                            }}
                        >
                            <div className="products-empty-icon">
                                🔍
                            </div>

                            <h2>
                                No products found
                            </h2>

                            <p>
                                Try changing your search
                                or filter.
                            </p>

                            <button
                                type="button"
                                className="clear-filter-btn"
                                onClick={() => {
                                    setSearch("");
                                    setFilter("all");
                                }}
                            >
                                Clear Filters
                            </button>
                        </motion.div>
                    )}


                {/* PRODUCTS */}

                {!loading &&
                    filteredProducts.length > 0 && (
                        <div className="products-grid">

                            {filteredProducts.map(
                                (product, index) => {

                                    const stock = Number(
                                        product.stock || 0
                                    );

                                    const isOutOfStock =
                                        stock === 0;

                                    return (
                                        <motion.article
                                            key={product._id}
                                            className="product-card"
                                            initial={{
                                                opacity: 0,
                                                y: 30,
                                            }}
                                            animate={{
                                                opacity: 1,
                                                y: 0,
                                            }}
                                            transition={{
                                                duration: 0.45,
                                                delay:
                                                    index *
                                                    0.06,
                                            }}
                                            whileHover={{
                                                y: -8,
                                            }}
                                        >

                                            {/* IMAGE */}

                                            <div className="product-image-container">

                                                {product.image ? (
                                                    <img
                                                        src={
                                                            product.image
                                                        }
                                                        alt={
                                                            product.productName
                                                        }
                                                        className="product-image"
                                                    />
                                                ) : (
                                                    <div className="product-image-placeholder">
                                                        <span>
                                                            📦
                                                        </span>
                                                    </div>
                                                )}

                                                <div className="product-category">
                                                    {product.category ||
                                                        "Other"}
                                                </div>

                                                <div
                                                    className={`stock-badge ${
                                                        isOutOfStock
                                                            ? "out"
                                                            : "available"
                                                    }`}
                                                >
                                                    <span />
                                                    {isOutOfStock
                                                        ? "Out of Stock"
                                                        : `${stock} in stock`}
                                                </div>

                                            </div>


                                            {/* INFO */}

                                            <div className="product-card-body">

                                                <h3>
                                                    {
                                                        product.productName
                                                    }
                                                </h3>

                                                <p>
                                                    {
                                                        product.description
                                                    }
                                                </p>


                                                <div className="product-price-row">

                                                    <strong>
                                                        ₹
                                                        {Number(
                                                            product.price ||
                                                                0
                                                        ).toLocaleString(
                                                            "en-IN"
                                                        )}
                                                    </strong>

                                                    <span>
                                                        per item
                                                    </span>

                                                </div>


                                                <div className="product-card-actions">

                                                    <Link
                                                        to={`/products/${product._id}`}
                                                        className="view-product-btn"
                                                    >
                                                        View
                                                    </Link>

                                                    <button
                                                        type="button"
                                                        className="delete-product-btn"
                                                        disabled={
                                                            deleteLoading ===
                                                            product._id
                                                        }
                                                        onClick={() =>
                                                            handleDelete(
                                                                product._id
                                                            )
                                                        }
                                                    >
                                                        {deleteLoading ===
                                                        product._id
                                                            ? "..."
                                                            : "Delete"}
                                                    </button>

                                                </div>

                                            </div>

                                        </motion.article>
                                    );
                                }
                            )}

                        </div>
                    )}

            </section>

        </main>
    );
}

export default SellerProducts;