import { Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";

import Home from "./Pages/Home";
import Products from "./Pages/Products";
import ProductDetails from "./Pages/ProductDetails";
import Cart from "./Pages/Cart";
import Checkout from "./Pages/Checkout";
import Orders from "./Pages/Orders";
import OrderDetails from "./Pages/OrderDetails";
import Profile from "./Pages/Profile";
import AddProduct from "./Pages/AddProduct";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

import { AuthProvider } from "./Context/AuthContext";

function App() {
    return (
        <AuthProvider>

            <Navbar />

            <Routes>

                {/* Public Routes */}

                <Route
                    path="/"
                    element={<Home />}
                />

                <Route
                    path="/products"
                    element={<Products />}
                />

                <Route
                    path="/products/:id"
                    element={<ProductDetails />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />


                {/* User Routes */}

                <Route
                    path="/cart"
                    element={<Cart />}
                />

                <Route
                    path="/checkout"
                    element={<Checkout />}
                />

                <Route
                    path="/orders"
                    element={<Orders />}
                />

                <Route
                    path="/orders/:id"
                    element={<OrderDetails />}
                />

                <Route
                    path="/profile"
                    element={<Profile />}
                />


                {/* Seller */}

                <Route
                    path="/add-product"
                    element={<AddProduct />}
                />


                {/* 404 */}

                <Route
                    path="*"
                    element={
                        <div className="not-found">
                            <h1>404</h1>
                            <p>Page not found</p>
                        </div>
                    }
                />

            </Routes>

        </AuthProvider>
    );
}

export default App;