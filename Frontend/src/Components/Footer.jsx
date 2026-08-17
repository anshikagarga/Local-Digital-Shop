import { Link } from "react-router-dom";
import "./Footer.css";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-brand">
                    <h2>📍 Local Digital Shop</h2>
                    <p>
                        Your trusted neighborhood marketplace connecting local sellers directly with everyday shoppers.
                    </p>
                </div>

                <div className="footer-links">
                    <h3>Quick Links</h3>
                    <Link to="/">Home</Link>
                    <Link to="/products">Browse Products</Link>
                    <Link to="/wishlist">Wishlist</Link>
                    <Link to="/cart">Cart</Link>
                </div>

                <div className="footer-contact">
                    <h3>Seller & Support</h3>
                    <p>📧 Email: support@localdigitalshop.com</p>
                    <p>📍 Location: India (Local Commerce Hub)</p>
                    <p>🏬 Want to list your store? <Link to="/register" style={{ color: "#4f46e5", fontWeight: "bold" }}>Join as Seller</Link></p>
                </div>
            </div>

            <div className="footer-bottom">
                <p>
                    © 2026 Local Digital Shop. All rights reserved. Empowering Neighborhood Businesses.
                </p>
            </div>
        </footer>
    );
}

export default Footer;
