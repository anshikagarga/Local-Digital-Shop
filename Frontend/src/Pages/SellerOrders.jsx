import { useState } from "react";
import "./SellerOrders.css";

function SellerOrders() {
    const [filter, setFilter] = useState("all");

    const orders = [];

    const filteredOrders =
        filter === "all"
            ? orders
            : orders.filter(
                  (order) => order.status === filter
              );

    return (
        <main className="seller-orders-page">

            {/* HEADER */}

            <header className="seller-orders-header">

                <div>
                    <span className="orders-eyebrow">
                        SELLER MANAGEMENT
                    </span>

                    <h1>
                        Orders
                    </h1>

                    <p>
                        Track and manage orders received
                        from your customers.
                    </p>
                </div>

                <div className="orders-header-icon">
                    🛒
                </div>

            </header>


            {/* ORDER STATS */}

            <section className="order-stats">

                <div className="order-stat-card">

                    <div className="order-stat-icon purple">
                        📦
                    </div>

                    <div>
                        <span>
                            Total Orders
                        </span>

                        <strong>
                            0
                        </strong>
                    </div>

                </div>


                <div className="order-stat-card">

                    <div className="order-stat-icon orange">
                        ⏳
                    </div>

                    <div>
                        <span>
                            Pending
                        </span>

                        <strong>
                            0
                        </strong>
                    </div>

                </div>


                <div className="order-stat-card">

                    <div className="order-stat-icon green">
                        ✓
                    </div>

                    <div>
                        <span>
                            Completed
                        </span>

                        <strong>
                            0
                        </strong>
                    </div>

                </div>


                <div className="order-stat-card">

                    <div className="order-stat-icon blue">
                        💰
                    </div>

                    <div>
                        <span>
                            Revenue
                        </span>

                        <strong>
                            ₹0
                        </strong>
                    </div>

                </div>

            </section>


            {/* ORDERS CARD */}

            <section className="orders-container">

                <div className="orders-toolbar">

                    <div>
                        <h2>
                            Customer Orders
                        </h2>

                        <p>
                            View and manage all your orders.
                        </p>
                    </div>


                    <div className="order-filters">

                        <button
                            className={
                                filter === "all"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setFilter("all")
                            }
                        >
                            All
                        </button>

                        <button
                            className={
                                filter === "pending"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setFilter("pending")
                            }
                        >
                            Pending
                        </button>

                        <button
                            className={
                                filter === "completed"
                                    ? "active"
                                    : ""
                            }
                            onClick={() =>
                                setFilter("completed")
                            }
                        >
                            Completed
                        </button>

                    </div>

                </div>


                {/* EMPTY STATE */}

                {filteredOrders.length === 0 && (

                    <div className="orders-empty">

                        <div className="orders-empty-orbit">

                            <div className="orders-empty-icon">
                                🛒
                            </div>

                        </div>

                        <h3>
                            No orders yet
                        </h3>

                        <p>
                            When customers purchase your
                            products, their orders will appear
                            here.
                        </p>

                        <span className="orders-empty-hint">
                            Your first order is waiting for you ✨
                        </span>

                    </div>

                )}

            </section>

        </main>
    );
}

export default SellerOrders;