import { useState } from "react";
import { apiRequest } from "../Services/api";
import "./AddProduct.css";

function AddProduct() {

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
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleImageChange = (e) => {

        const file = e.target.files[0];

        if (!file) {
            return;
        }

        setImage(file);

        setPreview(
            URL.createObjectURL(file)
        );
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {

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

            if (image) {
                data.append("image", image);
            }

            const response = await apiRequest(
                "/products",
                {
                    method: "POST",
                    body: data,
                }
            );

            console.log(
                "PRODUCT RESPONSE:",
                response
            );

            setMessage(
                "Product added successfully 🎉"
            );

            setFormData({
                productName: "",
                description: "",
                category: "",
                price: "",
                stock: "",
            });

            setImage(null);
            setPreview("");

        } catch (error) {

            console.error(
                "PRODUCT ERROR:",
                error
            );

            setError(error.message);

        } finally {

            setLoading(false);
        }
    };

    return (

        <div className="add-product-page">

            <div className="add-product-card">

                <div className="add-product-header">

                    <h1>
                        Add New Product
                    </h1>

                    <p>
                        List your product in the
                        local marketplace
                    </p>

                </div>

                {message && (
                    <div className="success-message">
                        {message}
                    </div>
                )}

                {error && (
                    <div className="error-message">
                        {error}
                    </div>
                )}

                <form
                    onSubmit={handleSubmit}
                    className="product-form"
                >

                    <div className="form-group">

                        <label>
                            Product Name
                        </label>

                        <input
                            type="text"
                            name="productName"
                            value={
                                formData.productName
                            }
                            onChange={handleChange}
                            placeholder="e.g. Basmati Rice"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Description
                        </label>

                        <textarea
                            name="description"
                            value={
                                formData.description
                            }
                            onChange={handleChange}
                            placeholder="Describe your product..."
                            rows="4"
                            required
                        />

                    </div>


                    <div className="form-group">

                        <label>
                            Category
                        </label>

                        <select
                            name="category"
                            value={
                                formData.category
                            }
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Category
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
                                Home
                            </option>

                            <option value="Beauty">
                                Beauty
                            </option>

                            <option value="Other">
                                Other
                            </option>

                        </select>

                    </div>


                    <div className="form-row">

                        <div className="form-group">

                            <label>
                                Price (₹)
                            </label>

                            <input
                                type="number"
                                name="price"
                                value={
                                    formData.price
                                }
                                onChange={handleChange}
                                placeholder="Enter Price"
                                min="0"
                                required
                            />

                        </div>


                        <div className="form-group">

                            <label>
                                Stock
                            </label>

                            <input
                                type="number"
                                name="stock"
                                value={
                                    formData.stock
                                }
                                onChange={handleChange}
                                placeholder="Enter Stock"
                                min="0"
                                required
                            />

                        </div>

                    </div>


                    <div className="form-group">

                        <label>
                            Product Image
                        </label>

                        <div className="image-upload">

                            <input
                                type="file"
                                accept="image/*"
                                onChange={
                                    handleImageChange
                                }
                            />

                            <p>
                                Choose JPG, PNG or WEBP
                            </p>

                        </div>

                    </div>


                    {preview && (

                        <div className="image-preview">

                            <img
                                src={preview}
                                alt="Product preview"
                            />

                        </div>

                    )}


                    <button
                        type="submit"
                        className="add-product-btn"
                        disabled={loading}
                    >

                        {loading
                            ? "Uploading..."
                            : "Add Product"
                        }

                    </button>

                </form>

            </div>

        </div>
    );
}

export default AddProduct;