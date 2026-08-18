import { useEffect, useRef, useState } from "react";
import { apiRequest } from "../Services/api";
import "./AddProduct.css";

const INITIAL_FORM = {
    productName: "",
    description: "",
    category: "",
    price: "",
    stock: "",
};

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

function AddProduct() {
    const [formData, setFormData] = useState(INITIAL_FORM);

    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const fileInputRef = useRef(null);
    const previewUrlRef = useRef("");

    useEffect(() => {
        return () => {
            if (previewUrlRef.current) {
                URL.revokeObjectURL(previewUrlRef.current);
            }
        };
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setMessage("");
        setError("");
    };

    const handleImageChange = (e) => {
        const file = e.target.files?.[0];

        if (!file) return;

        setMessage("");
        setError("");

        if (!file.type.startsWith("image/")) {
            setError("Please select a valid image file.");
            e.target.value = "";
            return;
        }

        if (file.size > MAX_IMAGE_SIZE) {
            setError("Image size must be less than 5 MB.");
            e.target.value = "";
            return;
        }

        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
        }

        const objectUrl = URL.createObjectURL(file);

        previewUrlRef.current = objectUrl;

        setImage(file);
        setPreview(objectUrl);
    };

    const removeImage = () => {
        if (previewUrlRef.current) {
            URL.revokeObjectURL(previewUrlRef.current);
            previewUrlRef.current = "";
        }

        setImage(null);
        setPreview("");

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
        }
    };

    const validateForm = () => {
        const productName = formData.productName.trim();
        const description = formData.description.trim();
        const price = Number(formData.price);
        const stock = Number(formData.stock);

        if (!productName) {
            return "Product name is required.";
        }

        if (productName.length < 2) {
            return "Product name must contain at least 2 characters.";
        }

        if (!description) {
            return "Product description is required.";
        }

        if (!formData.category) {
            return "Please select a product category.";
        }

        if (formData.price === "" || Number.isNaN(price) || price < 0) {
            return "Please enter a valid product price.";
        }

        if (formData.stock === "" || Number.isNaN(stock) || stock < 0) {
            return "Please enter a valid stock quantity.";
        }

        return "";
    };

    const resetForm = () => {
        setFormData(INITIAL_FORM);
        removeImage();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");
        setError("");

        const validationError = validateForm();

        if (validationError) {
            setError(validationError);
            return;
        }

        setLoading(true);

        try {
            const data = new FormData();

            data.append("productName", formData.productName.trim());
            data.append("description", formData.description.trim());
            data.append("category", formData.category);
            data.append("price", formData.price);
            data.append("stock", formData.stock);

            if (image) {
                data.append("image", image);
            }

            const response = await apiRequest("/products", {
                method: "POST",
                body: data,
            });

            console.log("PRODUCT RESPONSE:", response);

            setMessage("Product added successfully.");

            resetForm();
        } catch (err) {
            console.error("PRODUCT ERROR:", err);

            setError(
                err?.message ||
                    "Unable to add the product. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <main className="add-product-page">
            <section className="add-product-card">
                <header className="add-product-header">
                    <div className="add-product-eyebrow">
                        SELLER DASHBOARD
                    </div>

                    <h1>Add New Product</h1>

                    <p>
                        Add your product to the local marketplace and
                        connect with nearby customers.
                    </p>
                </header>

                {message && (
                    <div
                        className="product-alert product-alert-success"
                        role="status"
                        aria-live="polite"
                    >
                        <span className="alert-icon">✓</span>
                        <span>{message}</span>
                    </div>
                )}

                {error && (
                    <div
                        className="product-alert product-alert-error"
                        role="alert"
                        aria-live="assertive"
                    >
                        <span className="alert-icon">!</span>
                        <span>{error}</span>
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="product-form"
                    noValidate
                >
                    <div className="form-section">
                        <div className="section-heading">
                            <div className="section-number">01</div>

                            <div>
                                <h2>Product Information</h2>
                                <p>
                                    Tell customers about the product you
                                    are selling.
                                </p>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="productName">
                                Product Name
                                <span>*</span>
                            </label>

                            <input
                                id="productName"
                                type="text"
                                name="productName"
                                value={formData.productName}
                                onChange={handleChange}
                                placeholder="e.g. Basmati Rice"
                                autoComplete="off"
                                maxLength={100}
                                required
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="description">
                                Description
                                <span>*</span>
                            </label>

                            <textarea
                                id="description"
                                name="description"
                                value={formData.description}
                                onChange={handleChange}
                                placeholder="Describe the quality, features and important details of your product..."
                                rows={5}
                                maxLength={1000}
                                required
                            />

                            <div className="field-helper">
                                {formData.description.length}/1000 characters
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="category">
                                Category
                                <span>*</span>
                            </label>

                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleChange}
                                required
                            >
                                <option value="">
                                    Select a category
                                </option>

                                <option value="Groceries">
                                    Groceries
                                </option>

                                <option value="Electronics">
                                    Electronics
                                </option>

                                <option value="Clothing">
                                    Clothing
                                </option>

                                <option value="Home">
                                    Home & Living
                                </option>

                                <option value="Beauty">
                                    Beauty
                                </option>

                                <option value="Other">
                                    Other
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="section-heading">
                            <div className="section-number">02</div>

                            <div>
                                <h2>Pricing & Inventory</h2>
                                <p>
                                    Set your selling price and available
                                    stock.
                                </p>
                            </div>
                        </div>

                        <div className="form-row">
                            <div className="form-group">
                                <label htmlFor="price">
                                    Price
                                    <span>*</span>
                                </label>

                                <div className="input-with-prefix">
                                    <span>₹</span>

                                    <input
                                        id="price"
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        placeholder="0"
                                        min="0"
                                        step="0.01"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="form-group">
                                <label htmlFor="stock">
                                    Available Stock
                                    <span>*</span>
                                </label>

                                <input
                                    id="stock"
                                    type="number"
                                    name="stock"
                                    value={formData.stock}
                                    onChange={handleChange}
                                    placeholder="0"
                                    min="0"
                                    step="1"
                                    required
                                />
                            </div>
                        </div>
                    </div>

                    <div className="form-section">
                        <div className="section-heading">
                            <div className="section-number">03</div>

                            <div>
                                <h2>Product Image</h2>
                                <p>
                                    Upload a clear image of your product.
                                </p>
                            </div>
                        </div>

                        <div
                            className={`image-upload ${
                                preview ? "has-image" : ""
                            }`}
                            onClick={() =>
                                fileInputRef.current?.click()
                            }
                            onKeyDown={(e) => {
                                if (
                                    e.key === "Enter" ||
                                    e.key === " "
                                ) {
                                    fileInputRef.current?.click();
                                }
                            }}
                            role="button"
                            tabIndex={0}
                            aria-label="Choose product image"
                        >
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/png,image/jpeg,image/webp"
                                onChange={handleImageChange}
                                className="image-input"
                            />

                            {!preview ? (
                                <div className="upload-content">
                                    <div className="upload-icon">
                                        ↑
                                    </div>

                                    <strong>
                                        Upload product image
                                    </strong>

                                    <span>
                                        PNG, JPG or WEBP · Maximum 5 MB
                                    </span>
                                </div>
                            ) : (
                                <div className="image-preview">
                                    <img
                                        src={preview}
                                        alt={`${formData.productName || "Product"} preview`}
                                    />

                                    <div className="image-overlay">
                                        <span>
                                            Click to replace image
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>

                        {preview && (
                            <button
                                type="button"
                                className="remove-image-btn"
                                onClick={removeImage}
                            >
                                Remove image
                            </button>
                        )}
                    </div>

                    <div className="form-footer">
                        <p>
                            Your product will be added to the marketplace
                            after successful submission.
                        </p>

                        <button
                            type="submit"
                            className="add-product-btn"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="button-spinner" />
                                    Adding Product...
                                </>
                            ) : (
                                <>
                                    Add Product
                                    <span>→</span>
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
}

export default AddProduct;