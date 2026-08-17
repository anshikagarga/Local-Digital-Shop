import { Routes, Route } from "react-router-dom";

import Navbar from "./Components/Navbar";
import Footer from "./Components/Footer";

import Home from "./Pages/Home";
import Login from "./Pages/Login";
import Register from "./Pages/Register";

import Products from "./Pages/Products";
import ProductDetails from "./Pages/ProductDetails";

import Cart from "./Pages/Cart";
import Wishlist from "./Pages/Wishlist";

import Checkout from "./Pages/Checkout";

import Orders from "./Pages/Orders";
import OrderDetails from "./Pages/OrderDetails";

import Profile from "./Pages/Profile";

import AddProduct from "./Pages/AddProduct";

function App() {
    return (
        <>
            <Navbar />

            <Routes>

                {/* Home */}
                <Route
                    path="/"
                    element={<Home />}
                />

                {/* Authentication */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Products */}
                <Route
                    path="/products"
                    element={<Products />}
                />

                <Route
                    path="/products/:id"
                    element={<ProductDetails />}
                />

                {/* Cart */}
                <Route
                    path="/cart"
                    element={<Cart />}
                />

                {/* Wishlist */}
                <Route
                    path="/wishlist"
                    element={<Wishlist />}
                />

                {/* Checkout */}
                <Route
                    path="/checkout"
                    element={<Checkout />}
                />

                {/* Orders */}
                <Route
                    path="/orders"
                    element={<Orders />}
                />

                <Route
                    path="/orders/:id"
                    element={<OrderDetails />}
                />

                {/* Profile */}
                <Route
                    path="/profile"
                    element={<Profile />}
                />

                {/* Seller */}
                <Route
                    path="/add-product"
                    element={<AddProduct />}
                />

            </Routes>

            <Footer />
        </>
    );
}

export default App;