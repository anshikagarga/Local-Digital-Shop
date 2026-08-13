import { useState } from "react";
import { useAuth } from "./context/AuthContext";
import "./index.css";

function App() {

    const { user, login, logout, loading } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleLogin = async (e) => {

        e.preventDefault();

        try {

            await login(email, password);

        } catch (error) {

            alert(error.message);
        }
    };

    if (user) {

        return (
            <div className="auth-page">

                <div className="auth-card">

                    <h1 className="auth-title">
                        Local Digital Shop
                    </h1>

                    <p className="auth-subtitle">
                        Welcome back, {user.name}
                    </p>

                    <p>
                        {user.email}
                    </p>

                    <br />

                    <button
                        className="login-button"
                        onClick={logout}
                    >
                        Logout
                    </button>

                </div>

            </div>
        );
    }

    return (
        <div className="auth-page">

            <div className="auth-card">

                <h1 className="auth-title">
                    Local Digital Shop
                </h1>

                <p className="auth-subtitle">
                    Login to your account
                </p>

                <form onSubmit={handleLogin}>

                    <div className="form-group">

                        <label>Email</label>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </div>

                    <button
                        className="login-button"
                        type="submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Logging in..."
                            : "Login"}
                    </button>

                </form>

                <p className="auth-footer">
                    Don't have an account? Register
                </p>

            </div>

        </div>
    );
}

export default App;