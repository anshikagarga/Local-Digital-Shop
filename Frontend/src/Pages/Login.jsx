import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import "./Login.css";

function Login() {
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        setError("");

        try {
            await login(email, password);
            navigate("/");
        } catch (err) {
            if (err.message.includes("Failed to fetch") || err.message.includes("ERR_CONNECTION_REFUSED")) {
                setError("Unable to connect to the server. Please check if the backend is running at http://localhost:5000.");
            } else {
                setError(err.message || "Invalid credentials. Please try again.");
            }
        }
    };

    return (
        <div className="auth-page">
            <div className="auth-card">
                <div className="auth-header">
                    <div className="auth-logo-badge">📍🛍️</div>
                    <h1 className="auth-title">Local Digital Shop</h1>
                    <p className="auth-subtitle">Welcome back! Log in to your account</p>
                </div>

                {error && <div className="auth-error-banner">⚠️ {error}</div>}

                <form onSubmit={handleLogin} className="auth-form">
                    <div className="form-group">
                        <label>Email Address</label>
                        <input
                            type="email"
                            placeholder="e.g. user@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-button" disabled={loading}>
                        {loading ? "Logging in..." : "Log In to Account →"}
                    </button>
                </form>

                <p className="auth-footer">
                    Don't have an account? <Link to="/register">Create an Account</Link>
                </p>
            </div>
        </div>
    );
}

export default Login;