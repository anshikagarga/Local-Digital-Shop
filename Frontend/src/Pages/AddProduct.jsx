import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { apiRequest } from "../Services/api";

import "./AddProduct.css";

function AddProduct() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        productName: "",
        description: "",
        category: "",
        price: "",
        stock: "",
    });

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // ==========================================
    // INPUT CHANGE
    // ==========================================

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setError("");
    };

    // ==========================================
    // IMAGE CHANGE
    // ==========================================

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        if (!file.type.startsWith("image/")) {
            setError(
                "Please select a valid image file."
            );
            return;
        }

        if (file.size > 5 * 1024 * 1024) {
            setError(
                "Image size should be less than 5MB."
            );
            return;
        }

        setImage(file);

        setPreview(
            URL.createObjectURL(file)
        );

        setError("");
    };

    // ==========================================
    // SUBMIT
    // ==========================================

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        if (!image) {
            setError(
                "Please upload a product image."
            );
            return;
        }

        if (
            Number(formData.price) < 0 ||
            Number(formData.stock) < 0
        ) {
            setError(
                "Price and stock cannot be negative."
            );
            return;
        }

        try {
            setLoading(true);

            const data = new FormData();

            data.append(
                "productName",
                formData.productName
            );

            data.append(
                "description",
                formData.description
            );

            data.append(
                "category",
                formData.category
            );

            data.append(
                "price",
                formData.price
            );

            data.append(
                "stock",
                formData.stock
            );

            data.append(
                "image",
                image
            );

            await apiRequest(
                "/products",
                {
                    method: "POST",
                    body: data,
                }
            );

            navigate(
                "/seller/products"
            );

        } catch (err) {
            console.error(
                "ADD PRODUCT ERROR:",
                err
            );

            setError(
                err.message ||
                    "Unable to add product."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="add-product-page">

            {/* ================================= */}
            {/* HEADER */}
            {/* ================================= */}

            <motion.header
                className="add-product-header"
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

                    <span>
                        INVENTORY
                    </span>

                    <h1>
                        Add New Product
                    </h1>

                    <p>
                        Add a new product to your
                        local shop inventory.
                    </p>

                </div>

                <div className="add-product-header-icon">
                    📦
                </div>

            </motion.header>


            {/* ================================= */}
            {/* ERROR */}
            {/* ================================= */}

            {error && (
                <motion.div
                    className="add-product-error"
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
            {/* FORM */}
            {/* ================================= */}

            <motion.form
                className="add-product-form"
                onSubmit={handleSubmit}
                initial={{
                    opacity: 0,
                    y: 25,
                }}
                animate={{
                    opacity: 1,
                    y: 0,
                }}
                transition={{
                    delay: 0.1,
                }}
            >

                {/* ================================= */}
                {/* LEFT SIDE */}
                {/* ================================= */}

                <section className="add-product-card">

                    <div className="add-card-heading">

                        <div>
                            <span>
                                PRODUCT INFORMATION
                            </span>

                            <h2>
                                Product Details
                            </h2>
                        </div>

                    </div>


                    {/* PRODUCT NAME */}

                    <div className="add-form-group">

                        <label>
                            Product Name
                        </label>

                        <input
                            type="text"
                            name="productName"
                            value={
                                formData.productName
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="e.g. Wireless Headphones"
                            required
                        />

                    </div>


                    {/* CATEGORY */}

                    <div className="add-form-group">

                        <label>
                            Category
                        </label>

                        <select
                            name="category"
                            value={
                                formData.category
                            }
                            onChange={
                                handleChange
                            }
                            required
                        >

                            <option value="">
                                Select category
                            </option>

                            <option value="Electronics">
                                Electronics
                            </option>

                            <option value="Grocery">
                                Grocery
                            </option>

                            <option value="Clothing">
                                Clothing
                            </option>

                            <option value="Beauty">
                                Beauty
                            </option>

                            <option value="Home">
                                Home & Kitchen
                            </option>

                            <option value="Stationery">
                                Stationery
                            </option>

                            <option value="Other">
                                Other
                            </option>

                        </select>

                    </div>


                    {/* DESCRIPTION */}

                    <div className="add-form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={
                                formData.description
                            }
                            onChange={
                                handleChange
                            }
                            placeholder="Describe your product..."
                            rows="6"
                            required
                        />

                    </div>


                    {/* PRICE + STOCK */}

                    <div className="add-form-row">

                        <div className="add-form-group">

                            <label>
                                Price
                            </label>

                            <div className="input-with-prefix">
                                <span>
                                    ₹
                                </span>

                                <input
                                    type="number"
                                    name="price"
                                    value={
                                        formData.price
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    placeholder="0"
                                    required
                                />

                            </div>

                        </div>


                        <div className="add-form-group">

                            <label>
                                Stock
                            </label>

                            <input
                                type="number"
                                name="stock"
                                value={
                                    formData.stock
                                }
                                onChange={
                                    handleChange
                                }
                                min="0"
                                placeholder="0"
                                required
                            />

                        </div>

                    </div>

                </section>


                {/* ================================= */}
                {/* RIGHT SIDE */}
                {/* ================================= */}

                <section className="add-product-card image-card">

                    <div className="add-card-heading">

                        <div>
                            <span>
                                PRODUCT MEDIA
                            </span>

                            <h2>
                                Product Image
                            </h2>
                        </div>

                    </div>


                    {/* IMAGE UPLOAD */}

                    <label
                        className={`image-upload-area ${
                            preview
                                ? "has-image"
                                : ""
                        }`}
                    >

                        {preview ? (

                            <div className="image-preview">

                                <img
                                    src={preview}
                                    alt="Product preview"
                                />

                                <div className="image-preview-overlay">
                                    <strong>
                                        Change Image
                                    </strong>

                                    <span>
                                        Click to upload another
                                    </span>
                                </div>

                            </div>

                        ) : (

                            <div className="image-upload-content">

                                <div className="upload-icon">
                                    ☁️
                                </div>

                                <h3>
                                    Upload Product Image
                                </h3>

                                <p>
                                    Click to browse your
                                    computer
                                </p>

                                <span>
                                    PNG, JPG or WEBP • Max 5MB
                                </span>

                            </div>

                        )}

                        <input
                            type="file"
                            accept="image/png,image/jpeg,image/webp"
                            onChange={
                                handleImageChange
                            }
                        />

                    </label>


                    {/* TIP */}

                    <div className="image-tip">
                        <span>
                            💡
                        </span>

                        <p>
                            Use a clear and attractive
                            product image to help
                            customers understand
                            what you're selling.
                        </p>
                    </div>

                </section>


                {/* ================================= */}
                {/* ACTIONS */}
                {/* ================================= */}

                <div className="add-product-actions">

                    <button
                        type="button"
                        className="cancel-product-btn"
                        onClick={() =>
                            navigate(
                                "/seller/products"
                            )
                        }
                        disabled={loading}
                    >
                        Cancel
                    </button>

                    <motion.button
                        type="submit"
                        className="save-product-btn"
                        disabled={loading}
                        whileHover={{
                            y: -3,
                        }}
                        whileTap={{
                            scale: 0.97,
                        }}
                    >

                        {loading ? (
                            <>
                                <span className="add-button-spinner" />
                                Adding Product...
                            </>
                        ) : (
                            <>
                                Add Product
                                <span>→</span>
                            </>
                        )}

                    </motion.button>

                </div>

            </motion.form>

        </main>
    );
}

export default AddProduct;