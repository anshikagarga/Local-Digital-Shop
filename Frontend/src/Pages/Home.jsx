import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import { apiRequest } from "../services/api";

function Home() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await apiRequest("/products");

                setProducts(data.data);
            } catch (error) {
                console.error(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);
    return (
        <>
            <Navbar />

            {/* Hero Section */}
            <section className="hero">

                <div className="hero-content">

                    <span className="hero-badge">
                        🛍️ Your Local Marketplace
                    </span>

                    <h1>
                        Shop Local.
                        <br />
                        <span>Live Better.</span>
                    </h1>

                    <p>
                        Discover quality products from local
                        sellers and get everything you need
                        in one place.
                    </p>

                    <div className="hero-buttons">

                        <Link
                            to="/products"
                            className="primary-button"
                        >
                            Explore Products →
                        </Link>

                        <Link
                            to="/register"
                            className="secondary-button"
                        >
                            Become a Seller
                        </Link>

                    </div>

                </div>

                <div className="hero-visual">

                    <div className="floating-card card-one">
                        🥬
                        <span>Fresh Groceries</span>
                    </div>

                    <div className="floating-card card-two">
                        🛒
                        <span>Easy Shopping</span>
                    </div>

                    <div className="shopping-circle">
                        🛍️
                    </div>

                </div>

            </section>


            {/* Categories */}

            <section className="categories-section">

                <div className="section-heading">

                    <span>EXPLORE</span>

                    <h2>
                        Shop by Category
                    </h2>

                    <p>
                        Find exactly what you're looking for.
                    </p>

                </div>

                <div className="category-grid">

                    <div className="category-card">
                        <div>🥦</div>
                        <h3>Groceries</h3>
                        <p>Fresh everyday essentials</p>
                    </div>

                    <div className="category-card">
                        <div>👕</div>
                        <h3>Fashion</h3>
                        <p>Style from local sellers</p>
                    </div>

                    <div className="category-card">
                        <div>📱</div>
                        <h3>Electronics</h3>
                        <p>Smart gadgets & accessories</p>
                    </div>

                    <div className="category-card">
                        <div>🏠</div>
                        <h3>Home</h3>
                        <p>Everything for your home</p>
                    </div>

                </div>

            </section>


            {/* Featured Products */}

            <section className="featured-section">

                <div className="section-heading">

                    <span>POPULAR</span>

                    <h2>
                        Featured Products
                    </h2>

                    <p>
                        Popular products from our local sellers.
                    </p>

                </div>

                <div className="featured-placeholder">

                    <div>
                        🛒
                    </div>

                    <h3>
                        Amazing products are coming!
                    </h3>

                    <p>
                        Explore our complete product collection.
                    </p>

                    <Link
                        to="/products"
                        className="primary-button"
                    >
                        View All Products
                    </Link>

                </div>

            </section>

        </>
    );
}

export default Home;