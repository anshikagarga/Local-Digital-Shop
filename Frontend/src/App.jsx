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
import Login from "./Pages/Login";
import Register from "./Pages/Register";

import SellerDashboard from "./Pages/SellerDashboard";
import SellerProducts from "./Pages/SellerProducts";
import SellerOrders from "./Pages/SellerOrders";
import ShopProfile from "./Pages/ShopProfile";
import SellerSettings from "./Pages/SellerSettings";
import AddProduct from "./Pages/AddProduct";

import SellerLayout from "./Layouts/SellerLayout";

import { AuthProvider } from "./Context/AuthContext";


function CustomerLayout({ children }) {
    return (
        <>
            <Navbar />
            {children}
        </>
    );
}


function App() {

    return (
        <AuthProvider>

            <Routes>

                {/* ================================= */}
                {/* CUSTOMER / PUBLIC ROUTES */}
                {/* ================================= */}

                <Route
                    path="/"
                    element={
                        <CustomerLayout>
                            <Home />
                        </CustomerLayout>
                    }
                />

                <Route
                    path="/products"
                    element={
                        <CustomerLayout>
                            <Products />
                        </CustomerLayout>
                    }
                />

                <Route
                    path="/products/:id"
                    element={
                        <CustomerLayout>
                            <ProductDetails />
                        </CustomerLayout>
                    }
                />

                <Route
                    path="/login"
                    element={
                        <CustomerLayout>
                            <Login />
                        </CustomerLayout>
                    }
                />

                <Route
                    path="/register"
                    element={
                        <CustomerLayout>
                            <Register />
                        </CustomerLayout>
                    }
                />

                <Route
                    path="/cart"
                    element={
                        <CustomerLayout>
                            <Cart />
                        </CustomerLayout>
                    }
                />

                <Route
                    path="/checkout"
                    element={
                        <CustomerLayout>
                            <Checkout />
                        </CustomerLayout>
                    }
                />

                <Route
                    path="/orders"
                    element={
                        <CustomerLayout>
                            <Orders />
                        </CustomerLayout>
                    }
                />

                <Route
                    path="/orders/:id"
                    element={
                        <CustomerLayout>
                            <OrderDetails />
                        </CustomerLayout>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <CustomerLayout>
                            <Profile />
                        </CustomerLayout>
                    }
                />


                {/* ================================= */}
                {/* SELLER ROUTES */}
                {/* ================================= */}

                <Route
                    path="/seller"
                    element={<SellerLayout />}
                >

                    <Route
                        index
                        element={<SellerDashboard />}
                    />

                    <Route
                        path="dashboard"
                        element={<SellerDashboard />}
                    />

                    <Route
                        path="products"
                        element={<SellerProducts />}
                    />

                    <Route
                        path="products/add"
                        element={<AddProduct />}
                    />

                    <Route
                        path="orders"
                        element={<SellerOrders />}
                    />

                    <Route
                        path="profile"
                        element={<ShopProfile />}
                    />

                    <Route
                        path="settings"
                        element={<SellerSettings />}
                    />

                </Route>


                {/* ================================= */}
                {/* 404 */}
                {/* ================================= */}

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