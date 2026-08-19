import { Link } from "react-router-dom";
import "./SellerDashboard.css";

function SellerDashboard() {
    return (
        <main className="seller-dashboard">

            {/* MAIN CONTENT */}
            <section className="seller-main">

                {/* TOP BAR */}
                <header className="seller-topbar">

                    <div>
                        <span className="dashboard-eyebrow">
                            SELLER DASHBOARD
                        </span>

                        <h1>
                            Welcome back 👋
                        </h1>

                        <p>
                            Here's what's happening with
                            your local shop today.
                        </p>
                    </div>

                    <div className="seller-profile">

                        <div className="seller-avatar">
                            S
                        </div>

                        <div>
                            <strong>
                                Seller
                            </strong>

                            <span>
                                Local Shopkeeper
                            </span>
                        </div>

                    </div>

                </header>


                {/* STATS */}
                <section className="dashboard-stats">

                    <div className="stat-card">

                        <div className="stat-icon purple">
                            📦
                        </div>

                        <div>
                            <span>
                                Total Products
                            </span>

                            <strong>
                                0
                            </strong>

                            <small>
                                Products listed
                            </small>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon blue">
                            🛒
                        </div>

                        <div>
                            <span>
                                Total Orders
                            </span>

                            <strong>
                                0
                            </strong>

                            <small>
                                Orders received
                            </small>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon green">
                            💰
                        </div>

                        <div>
                            <span>
                                Revenue
                            </span>

                            <strong>
                                ₹0
                            </strong>

                            <small>
                                Total earnings
                            </small>
                        </div>

                    </div>


                    <div className="stat-card">

                        <div className="stat-icon orange">
                            ⏳
                        </div>

                        <div>
                            <span>
                                Pending Orders
                            </span>

                            <strong>
                                0
                            </strong>

                            <small>
                                Need attention
                            </small>
                        </div>

                    </div>

                </section>


                {/* QUICK ACTIONS */}
                <section className="dashboard-section">

                    <div className="section-heading">

                        <div>
                            <span>
                                QUICK ACTIONS
                            </span>

                            <h2>
                                Manage your shop
                            </h2>
                        </div>

                    </div>


                    <div className="quick-actions">

                        <Link
                            to="/seller/products/add"
                            className="quick-action-card primary"
                        >
                            <div className="quick-action-icon">
                                ➕
                            </div>

                            <div>
                                <h3>
                                    Add Product
                                </h3>

                                <p>
                                    List a new product in
                                    your shop.
                                </p>
                            </div>

                            <span className="action-arrow">
                                →
                            </span>
                        </Link>


                        <Link
                            to="/seller/products"
                            className="quick-action-card"
                        >
                            <div className="quick-action-icon">
                                📦
                            </div>

                            <div>
                                <h3>
                                    Manage Products
                                </h3>

                                <p>
                                    Edit, update or remove
                                    your products.
                                </p>
                            </div>

                            <span className="action-arrow">
                                →
                            </span>
                        </Link>


                        <Link
                            to="/seller/orders"
                            className="quick-action-card"
                        >
                            <div className="quick-action-icon">
                                🛒
                            </div>

                            <div>
                                <h3>
                                    View Orders
                                </h3>

                                <p>
                                    Manage your customer
                                    orders.
                                </p>
                            </div>

                            <span className="action-arrow">
                                →
                            </span>
                        </Link>

                    </div>

                </section>


                {/* RECENT PRODUCTS */}
                <section className="dashboard-section">

                    <div className="section-heading">

                        <div>
                            <span>
                                INVENTORY
                            </span>

                            <h2>
                                Recent Products
                            </h2>
                        </div>

                        <Link
                            to="/seller/products"
                            className="view-all-link"
                        >
                            View all →
                        </Link>

                    </div>


                    <div className="empty-dashboard">

                        <div className="empty-dashboard-icon">
                            📦
                        </div>

                        <h3>
                            No products yet
                        </h3>

                        <p>
                            Start adding products to
                            your local shop.
                        </p>

                        <Link
                            to="/seller/products/add"
                            className="dashboard-add-btn"
                        >
                            + Add Your First Product
                        </Link>

                    </div>

                </section>

            </section>

        </main>
    );
}

export default SellerDashboard;