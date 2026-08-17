import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import "./Navbar.css";

function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        setMobileMenuOpen(false);
        navigate("/login");
    };

    const closeMobileMenu = () => {
        setMobileMenuOpen(false);
    };

    return (
        <header className="navbar-header">
            <div className="navbar-container">
                {/* Brand Logo */}
                <Link to="/" className="navbar-logo" onClick={closeMobileMenu}>
                    <div className="logo-icon-badge">
                        <span className="location-pin">📍</span>
                        <span className="basket-icon">🛍️</span>
                    </div>
                    <div className="logo-text-box">
                        <span className="logo-brand">LOCAL</span>
                        <span className="logo-sub">DIGITAL SHOP</span>
                    </div>
                </Link>

                {/* Mobile Menu Toggle Button */}
                <button
                    className={`mobile-menu-btn ${mobileMenuOpen ? "open" : ""}`}
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    aria-label="Toggle menu"
                >
                    <span className="bar"></span>
                    <span className="bar"></span>
                    <span className="bar"></span>
                </button>

                {/* Navigation Links */}
                <nav className={`navbar-links ${mobileMenuOpen ? "mobile-active" : ""}`}>
                    <NavLink to="/" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={closeMobileMenu}>
                        Home
                    </NavLink>

                    <NavLink to="/products" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={closeMobileMenu}>
                        Products
                    </NavLink>

                    <NavLink to="/wishlist" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={closeMobileMenu}>
                        Wishlist ❤️
                    </NavLink>

                    <NavLink to="/cart" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={closeMobileMenu}>
                        Cart 🛒
                    </NavLink>

                    {user ? (
                        <>
                            <NavLink to="/orders" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={closeMobileMenu}>
                                My Orders
                            </NavLink>

                            <NavLink to="/profile" className={({ isActive }) => (isActive ? "nav-link active" : "nav-link")} onClick={closeMobileMenu}>
                                Profile 👤
                            </NavLink>

                            {(user.role === "seller" || user.shopName) && (
                                <NavLink to="/add-product" className={({ isActive }) => (isActive ? "nav-link seller-link active" : "nav-link seller-link")} onClick={closeMobileMenu}>
                                    + Add Product
                                </NavLink>
                            )}

                            <button onClick={handleLogout} className="logout-btn">
                                Logout
                            </button>
                        </>
                    ) : (
                        <div className="auth-buttons">
                            <Link to="/login" className="login-link-btn" onClick={closeMobileMenu}>
                                Login
                            </Link>
                            <Link to="/register" className="register-link-btn" onClick={closeMobileMenu}>
                                Register
                            </Link>
                        </div>
                    )}
                </nav>
            </div>
        </header>
    );
}

export default Navbar;