import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {

    const { user, logout } = useAuth();

    return (
        <nav className="navbar">

            <Link to="/" className="navbar-logo">
                Local Digital Shop
            </Link>

            <div className="navbar-links">

                <Link to="/">
                    Home
                </Link>

                <Link to="/products">
                    Products
                </Link>

                <Link to="/cart">
                    Cart
                </Link>

                {user ? (
                    <>
                        <Link to="/profile">
                            Profile
                        </Link>

                        <button
                            onClick={logout}
                            className="logout-button"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link to="/login">
                            Login
                        </Link>

                        <Link to="/register">
                            Register
                        </Link>
                    </>
                )}

            </div>

        </nav>
    );
}

export default Navbar;