import { Link, useLocation } from "react-router-dom";
import "./SellerSidebar.css";

function SellerSidebar() {

    const location = useLocation();

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <aside className="seller-sidebar">

            {/* BRAND */}

            <div className="seller-brand">

                <div className="seller-brand-icon">
                    🛍️
                </div>

                <div>
                    <h2>Local Digital Shop</h2>
                    <span>Seller Panel</span>
                </div>

            </div>


            {/* NAVIGATION */}

            <nav className="seller-nav">

                <Link
                    to="/seller/dashboard"
                    className={`seller-nav-item ${
                        isActive("/seller/dashboard")
                            ? "active"
                            : ""
                    }`}
                >
                    <span>📊</span>
                    Dashboard
                </Link>


                <Link
                    to="/seller/products"
                    className={`seller-nav-item ${
                        isActive("/seller/products")
                            ? "active"
                            : ""
                    }`}
                >
                    <span>📦</span>
                    My Products
                </Link>


                <Link
                    to="/seller/orders"
                    className={`seller-nav-item ${
                        isActive("/seller/orders")
                            ? "active"
                            : ""
                    }`}
                >
                    <span>🛒</span>
                    Orders
                </Link>


                <Link
                    to="/seller/profile"
                    className={`seller-nav-item ${
                        isActive("/seller/profile")
                            ? "active"
                            : ""
                    }`}
                >
                    <span>🏪</span>
                    Shop Profile
                </Link>


                <Link
                    to="/seller/settings"
                    className={`seller-nav-item ${
                        isActive("/seller/settings")
                            ? "active"
                            : ""
                    }`}
                >
                    <span>⚙️</span>
                    Settings
                </Link>

            </nav>


            {/* BOTTOM */}

            <div className="seller-sidebar-bottom">

                <Link
                    to="/products"
                    className="view-store-btn"
                >
                    👀 View Store
                </Link>

            </div>

        </aside>
    );
}

export default SellerSidebar;