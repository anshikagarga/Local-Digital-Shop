import { Link } from "react-router-dom";

import BrandLogo from "./BrandLogo";

import "./Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Brand */}
        <div className="footer-brand">
          <Link
            to="/"
            className="footer-logo"
            aria-label="Local Digital Shop home"
          >
            <BrandLogo />
          </Link>

          <p>
            A modern local marketplace connecting
            neighborhood businesses with everyday
            shoppers.
          </p>
        </div>

        {/* Quick Links */}
        <div className="footer-column">
          <h3>Explore</h3>

          <Link to="/">
            Home
          </Link>

          <Link to="/products">
            Browse Products
          </Link>

          <Link to="/wishlist">
            Wishlist
          </Link>

          <Link to="/cart">
            Cart
          </Link>
        </div>

        {/* Account */}
        <div className="footer-column">
          <h3>Account</h3>

          <Link to="/login">
            Login
          </Link>

          <Link to="/register">
            Create Account
          </Link>

          <Link to="/orders">
            Orders
          </Link>

          <Link to="/profile">
            Profile
          </Link>
        </div>

        {/* Seller */}
        <div className="footer-column footer-seller">
          <h3>For Sellers</h3>

          <p>
            Bring your local store online and
            reach customers in your area.
          </p>

          <Link
            to="/register"
            className="footer-seller-link"
          >
            Become a Seller
          </Link>
        </div>

      </div>

      <div className="footer-bottom">
        <p>
          © 2026 Local Digital Shop.
          All rights reserved.
        </p>

        <p>
          Built for local commerce.
        </p>
      </div>
    </footer>
  );
}

export default Footer;