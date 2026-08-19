import { useState } from "react";
import "./ShopProfile.css";

function ShopProfile() {
    const [formData, setFormData] = useState({
        shopName: "",
        ownerName: "",
        phone: "",
        email: "",
        address: "",
        description: "",
    });

    const [saved, setSaved] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setSaved(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setSaved(true);

        setTimeout(() => {
            setSaved(false);
        }, 3000);
    };

    return (
        <main className="shop-profile-page">

            <header className="shop-profile-header">
                <div>
                    <span className="profile-eyebrow">
                        SHOP MANAGEMENT
                    </span>

                    <h1>Shop Profile</h1>

                    <p>
                        Manage your shop information and make your
                        local business easier to discover.
                    </p>
                </div>

                <div className="shop-profile-badge">
                    🏪
                </div>
            </header>


            {saved && (
                <div className="profile-success">
                    <span>✓</span>
                    Shop profile updated successfully.
                </div>
            )}


            <section className="profile-layout">

                {/* PROFILE PREVIEW */}

                <aside className="profile-preview-card">

                    <div className="shop-avatar">
                        🏪
                    </div>

                    <h2>
                        {formData.shopName || "Your Shop"}
                    </h2>

                    <p>
                        {formData.ownerName || "Shop Owner"}
                    </p>

                    <div className="profile-preview-line" />

                    <div className="preview-item">
                        <span>📍</span>
                        <div>
                            <small>Location</small>
                            <strong>
                                {formData.address || "Not added"}
                            </strong>
                        </div>
                    </div>

                    <div className="preview-item">
                        <span>📞</span>
                        <div>
                            <small>Phone</small>
                            <strong>
                                {formData.phone || "Not added"}
                            </strong>
                        </div>
                    </div>

                    <div className="preview-item">
                        <span>✉️</span>
                        <div>
                            <small>Email</small>
                            <strong>
                                {formData.email || "Not added"}
                            </strong>
                        </div>
                    </div>

                </aside>


                {/* FORM */}

                <section className="profile-form-card">

                    <div className="profile-section-heading">
                        <span>01</span>

                        <div>
                            <h2>Basic Information</h2>
                            <p>
                                Tell customers about your local shop.
                            </p>
                        </div>
                    </div>


                    <form onSubmit={handleSubmit}>

                        <div className="profile-form-grid">

                            <div className="profile-field">
                                <label>
                                    Shop Name
                                </label>

                                <input
                                    type="text"
                                    name="shopName"
                                    value={formData.shopName}
                                    onChange={handleChange}
                                    placeholder="e.g. Garg General Store"
                                />
                            </div>


                            <div className="profile-field">
                                <label>
                                    Owner Name
                                </label>

                                <input
                                    type="text"
                                    name="ownerName"
                                    value={formData.ownerName}
                                    onChange={handleChange}
                                    placeholder="Enter owner name"
                                />
                            </div>


                            <div className="profile-field">
                                <label>
                                    Phone Number
                                </label>

                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="+91 XXXXX XXXXX"
                                />
                            </div>


                            <div className="profile-field">
                                <label>
                                    Email Address
                                </label>

                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="shop@example.com"
                                />
                            </div>


                            <div className="profile-field full-width">
                                <label>
                                    Shop Address
                                </label>

                                <input
                                    type="text"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="Enter your complete shop address"
                                />
                            </div>


                            <div className="profile-field full-width">
                                <label>
                                    Shop Description
                                </label>

                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    placeholder="Tell customers what makes your shop special..."
                                    rows="5"
                                />
                            </div>

                        </div>


                        <div className="profile-form-footer">

                            <p>
                                Keep your shop information updated
                                for customers.
                            </p>

                            <button type="submit">
                                Save Changes
                                <span>→</span>
                            </button>

                        </div>

                    </form>

                </section>

            </section>

        </main>
    );
}

export default ShopProfile;