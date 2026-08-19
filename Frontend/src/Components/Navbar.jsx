import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import "./Navbar.css";

function Navbar() {
    const { user, logout, loading } = useAuth();
    const navigate = useNavigate();

    const [menuOpen, setMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setMenuOpen(false);
        navigate("/login");
    };

    const closeMenu = () => {
        setMenuOpen(false);
    };

    return (
        <nav className="navbar">

            {/* Logo */}

            <Link
                to="/"
                className="navbar-logo"
                onClick={closeMenu}
            >
                <span className="logo-icon">
                    📍
                </span>

                <span>
                    Local Digital Shop
                </span>
            </Link>


            {/* Mobile Menu Button */}

            <button
                className="mobile-menu-btn"
                onClick={() =>
                    setMenuOpen(!menuOpen)
                }
                aria-label="Toggle navigation"
            >
                {menuOpen ? "✕" : "☰"}
            </button>


            {/* Navigation */}

            <div
                className={`navbar-content ${
                    menuOpen ? "open" : ""
                }`}
            >

                <div className="navbar-links">

                    <Link
                        to="/"
                        onClick={closeMenu}
                    >
                        Home
                    </Link>


                    <Link
                        to="/products"
                        onClick={closeMenu}
                    >
                        Products
                    </Link>


                    {user && (
                        <>
                            <Link
                                to="/cart"
                                onClick={closeMenu}
                            >
                                🛒 Cart
                            </Link>


                            <Link
                                to="/orders"
                                onClick={closeMenu}
                            >
                                📦 Orders
                            </Link>
                        </>
                    )}

                </div>


                {/* Right Side */}

                <div className="navbar-actions">

                    {loading ? (

                        <span className="navbar-loading">
                            Loading...
                        </span>

                    ) : user ? (

                        <>

                            <Link
                                to="/profile"
                                className="profile-link"
                                onClick={closeMenu}
                            >
                                <span className="profile-avatar">
                                    {user.name
                                        ? user.name
                                            .charAt(0)
                                            .toUpperCase()
                                        : "U"}
                                </span>

                                <span>
                                    {user.name || "Profile"}
                                </span>
                            </Link>


                            <button
                                className="logout-btn"
                                onClick={handleLogout}
                            >
                                Logout
                            </button>

                        </>

                    ) : (

                        <>

                            <Link
                                to="/login"
                                className="login-link"
                                onClick={closeMenu}
                            >
                                Login
                            </Link>


                            <Link
                                to="/register"
                                className="register-link"
                                onClick={closeMenu}
                            >
                                Register
                            </Link>

                        </>

                    )}

                </div>

            </div>

        </nav>
    );
}

export default Navbar;