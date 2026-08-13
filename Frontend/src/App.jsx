import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import AddProduct from "./pages/AddProduct";

function App() {
    return (
       <Routes>

    <Route
        path="/"
        element={<Home />}
    />

    <Route
        path="/login"
        element={<Login />}
    />

    <Route
        path="/register"
        element={<Register />}
    />

    <Route
        path="/cart"
        element={<Cart />}
    />

    <Route
        path="/add-product"
        element={<AddProduct />}
    />

</Routes>
    );
}

export default App;