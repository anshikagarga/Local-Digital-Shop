import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiRequest } from "../Services/api";
import "./Register.css";

function Register() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: "customer",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError("");
        setSuccessMessage("");

        try {
            await apiRequest("/auth/register", {
                method: "POST",
                body: JSON.stringify(formData),
            });

            setSuccessMessage("Account created successfully! Redirecting to login...");
            setTimeout(() => {
                navigate("/login");
            }, 1500);
        } catch (err) {
            if (err.message.includes("Failed to fetch") || err.message.includes("ERR_CONNECTION_REFUSED")) {
                setError("Unable to connect to the server. Please check if the backend is running at http://localhost:5000.");
            } else {
                setError(err.message || "Registration failed. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo-badge">🛍️✨</div>
                    <h1 className="auth-title">Create Account</h1>
                    <p className="auth-subtitle">Join your local neighborhood digital shop marketplace</p>
                </div>

                {successMessage && <div className="auth-success-banner">✓ {successMessage}</div>}
                {error && <div className="auth-error-banner">⚠️ {error}</div>}

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            name="email"
                            placeholder="Enter your email address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="Create a strong password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Register As</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            style={{ padding: "0.875rem 1rem", borderRadius: "0.75rem", border: "1.5px solid #cbd5e1", fontSize: "0.95rem", background: "#fff" }}
                        >
                            <option value="customer">Customer / Buyer</option>
                            <option value="seller">Local Shopkeeper / Seller</option>
                        </select>
                    </div>

                    <button className="login-button" type="submit" disabled={loading}>
                        {loading ? "Creating Account..." : "Create Account →"}
                    </button>
                </form>

                <p className="auth-footer">
                    Already have an account? <Link to="/login">Log In</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;