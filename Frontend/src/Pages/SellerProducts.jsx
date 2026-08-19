import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import { apiRequest } from "../Services/api";

import "./SellerProducts.css";

function SellerProducts() {
    const [products, setProducts] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [search, setSearch] = useState("");
    const [filter, setFilter] = useState("all");

    // ==========================================
    // FETCH SELLER PRODUCTS
    // ==========================================

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await apiRequest(
                    "/products/my-products"
                );

                setProducts(response.data || []);
            } catch (err) {
                console.error(
                    "FETCH SELLER PRODUCTS ERROR:",
                    err
                );

                setError(
                    err.message ||
                        "Unable to load products."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    // ==========================================
    // SEARCH + FILTER
    // ==========================================

    const filteredProducts = products.filter(
        (product) => {
            const searchText =
                search.toLowerCase();

            const matchesSearch =
                product.productName
                    ?.toLowerCase()
                    .includes(searchText) ||
                product.category
                    ?.toLowerCase()
                    .includes(searchText);

            const matchesFilter =
                filter === "all"
                    ? true
                    : filter === "active"
                    ? product.stock > 0
                    : product.stock === 0;

            return (
                matchesSearch &&
                matchesFilter
            );
        }
    );

    // ==========================================
    // DELETE PRODUCT
    // ==========================================

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this product?"
        );

        if (!confirmed) return;

        try {
            await apiRequest(
                `/products/${id}`,
                {
                    method: "DELETE",
                }
            );

            setProducts((prev) =>
                prev.filter(
                    (product) =>
                        product._id !== id
                )
            );
        } catch (err) {
            alert(
                err.message ||
                    "Unable to delete product."
            );
        }
    };

    // ==========================================
    // LOADING
    // ==========================================

    if (loading) {
        return (
            <main className="seller-products-page">

                <div className="products-loading">

                    <div className="products-loader" />

                    <h2>
                        Loading your products...
                    </h2>

                    <p>
                        Preparing your inventory.
                    </p>

                </div>

            </main>
        );
    }

    return (
        <main className="seller-products-page">

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <motion.header
                className="products-page-header"
                initial={{
                    opacity: 0,
                    y: -20,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
            >

                <div>

                    <span className="products-eyebrow">
                        INVENTORY
                    </span>

                    <h1>
                        My Products
                    </h1>

                    <p>
                        Manage everything you're
                        selling in your local shop.
                    </p>

                </div>

                <Link
                    to="/seller/products/add"
                    className="add-product-btn"
                >
                    <span>+</span>
                    Add Product
                </Link>

            </motion.header>


            {/* ================================= */}
            {/* ERROR */}
            {/* ================================= */}

            {error && (
                <motion.div
                    className="products-error"
                    initial={{
                        opacity: 0,
                        y: -10,
                    }}
                    animate={{
                        opacity: 1,
                        y: 0,
                    }}
                >
                    ⚠️ {error}
                </motion.div>
            )}


            {/* ================================= */}
            {/* TOOLBAR */}
            {/* ================================= */}

            <motion.section
                className="products-toolbar"
                initial={{
                    opacity: 0,
                    y: 15,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    delay: 0.1,
                }}
            >

                <div className="product-search">

                    <span>
                        🔍
                    </span>

                    <input
                        type="text"
                        placeholder="Search products..."
                        value={search}
                        onChange={(e) =>
                            setSearch(
                                e.target.value
                            )
                        }
                    />

                </div>

                <select
                    className="product-filter"
                    value={filter}
                    onChange={(e) =>
                        setFilter(
                            e.target.value
                        )
                    }
                >

                    <option value="all">
                        All Products
                    </option>

                    <option value="active">
                        Active
                    </option>

                    <option value="out">
                        Out of Stock
                    </option>

                </select>

            </motion.section>


            {/* ================================= */}
            {/* CONTENT */}
            {/* ================================= */}

            <section className="products-content">

                <div className="products-count">

                    <div>
                        <span>
                            YOUR INVENTORY
                        </span>

                        <h2>
                            Products
                        </h2>
                    </div>

                    <strong>
                        {filteredProducts.length}{" "}
                        Products
                    </strong>

                </div>


                {/* ================================= */}
                {/* EMPTY STATE */}
                {/* ================================= */}

                {products.length === 0 ? (

                    <motion.div
                        className="products-empty"
                        initial={{
                            opacity: 0,
                            scale: 0.95,
                        }}
                        animate={{
                            opacity: 1,
                            scale: 1,
                        }}
                    >

                        <div className="products-empty-icon">
                            📦
                        </div>

                        <h2>
                            No products yet
                        </h2>

                        <p>
                            Start building your
                            inventory by adding
                            your first product.
                        </p>

                        <Link
                            to="/seller/products/add"
                            className="empty-add-product-btn"
                        >
                            + Add Your First Product
                        </Link>

                    </motion.div>

                ) : filteredProducts.length === 0 ? (

                    <div className="products-empty">

                        <div className="products-empty-icon">
                            🔍
                        </div>

                        <h2>
                            No matching products
                        </h2>

                        <p>
                            Try changing your search
                            or filter.
                        </p>

                    </div>

                ) : (

                    /* ================================= */
                    /* PRODUCT GRID */
                    /* ================================= */

                    <div className="products-grid">

                        <AnimatePresence>

                            {filteredProducts.map(
                                (product, index) => (

                                    <motion.article
                                        className="seller-product-card"
                                        key={product._id}
                                        initial={{
                                            opacity: 0,
                                            y: 25,
                                        }}
                                        animate={{
                                            opacity: 1,
                                            y: 0,
                                        }}
                                        exit={{
                                            opacity: 0,
                                            scale: 0.9,
                                        }}
                                        transition={{
                                            delay:
                                                index *
                                                0.06,
                                        }}
                                        whileHover={{
                                            y: -7,
                                        }}
                                    >

                                        {/* IMAGE */}

                                        <div className="product-image-wrapper">

                                            {product.image ? (
                                                <img
                                                    src={
                                                        product.image
                                                    }
                                                    alt={
                                                        product.productName
                                                    }
                                                />
                                            ) : (
                                                <div className="product-image-placeholder">
                                                    📦
                                                </div>
                                            )}

                                            <span
                                                className={
                                                    product.stock >
                                                    0
                                                        ? "stock-badge active"
                                                        : "stock-badge out"
                                                }
                                            >
                                                {product.stock >
                                                0
                                                    ? "Active"
                                                    : "Out of Stock"}
                                            </span>

                                        </div>


                                        {/* DETAILS */}

                                        <div className="product-card-body">

                                            <span className="product-category">
                                                {product.category}
                                            </span>

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


                                            <div className="product-meta">

                                                <strong>
                                                    ₹
                                                    {
                                                        product.price
                                                    }
                                                </strong>

                                                <span>
                                                    Stock:{" "}
                                                    {
                                                        product.stock
                                                    }
                                                </span>

                                            </div>


                                            {/* ACTIONS */}

                                            <div className="product-actions">

                                                <Link
                                                    to={`/seller/products/edit/${product._id}`}
                                                    className="edit-product-btn"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    className="delete-product-btn"
                                                    onClick={() =>
                                                        handleDelete(
                                                            product._id
                                                        )
                                                    }
                                                >
                                                    Delete
                                                </button>

                                            </div>

                                        </div>

                                    </motion.article>

                                )
                            )}

                        </AnimatePresence>

                    </div>

                )}

            </section>

        </main>
    );
}

export default SellerProducts;