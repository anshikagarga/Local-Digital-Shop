import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { apiRequest } from "../Services/api";
import "./Orders.css";

function Orders() {

    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        const fetchOrders = async () => {

            try {

                const data = await apiRequest("/orders");

                setOrders(data.data);

            } catch (error) {

                setError(error.message);

            } finally {

                setLoading(false);

            }
        };

        fetchOrders();

    }, []);


    if (loading) {
        return (
            <div className="orders-message">
                <h2>Loading orders...</h2>
            </div>
        );
    }


    if (error) {
        return (
            <div className="orders-message">
                <h2>{error}</h2>
            </div>
        );
    }


    return (
        <main className="orders-page">

            <div className="orders-header">

                <span>MY ACCOUNT</span>

                <h1>
                    My Orders
                </h1>

                <p>
                    Track and manage your orders.
                </p>

            </div>


            {orders.length === 0 ? (

                <div className="orders-empty">

                    <div>📦</div>

                    <h2>
                        No orders yet
                    </h2>

                    <p>
                        Your placed orders will appear here.
                    </p>

                    <Link
                        to="/products"
                        className="orders-shop-button"
                    >
                        Start Shopping
                    </Link>

                </div>

            ) : (

                <div className="orders-list">

                    {orders.map((order) => (

                        <div
                            className="order-card"
                            key={order._id}
                        >

                            <div className="order-card-header">

                                <div>

                                    <span>
                                        Order ID
                                    </span>

                                    <strong>
                                        #{order._id}
                                    </strong>

                                </div>

                                <span
                                    className={`order-status ${order.orderStatus}`}
                                >
                                    {order.orderStatus}
                                </span>

                            </div>


                            <div className="order-card-body">

                                <p>
                                    <strong>
                                        Total:
                                    </strong>{" "}
                                    ₹{order.totalAmount}
                                </p>

                                <p>
                                    <strong>
                                        Payment:
                                    </strong>{" "}
                                    {order.paymentMethod}
                                </p>

                                <p>
                                    <strong>
                                        Items:
                                    </strong>{" "}
                                    {order.items.length}
                                </p>

                            </div>


                            <Link
                                to={`/orders/${order._id}`}
                                className="order-details-button"
                            >
                                View Order
                            </Link>

                        </div>

                    ))}

                </div>

            )}

        </main>
    );
}

export default Orders;