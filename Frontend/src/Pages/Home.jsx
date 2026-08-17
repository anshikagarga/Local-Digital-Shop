import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {

    const categories = [
        {
            icon: "🥦",
            title: "Groceries",
            description: "Fresh everyday essentials",
        },
        {
            icon: "👕",
            title: "Fashion",
            description: "Style from local sellers",
        },
        {
            icon: "📱",
            title: "Electronics",
            description: "Smart gadgets & accessories",
        },
        {
            icon: "🏠",
            title: "Home",
            description: "Everything for your home",
        },
    ];

    return (
        <main className="home-page">

            {/* ================= HERO ================= */}

            <section className="home-hero">

                <div className="hero-glow glow-one"></div>
                <div className="hero-glow glow-two"></div>

                <div className="hero-content">

                    <motion.span
                        className="hero-badge"
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        🛍️ Your Local Marketplace
                    </motion.span>

                    <motion.h1
                        initial={{ opacity: 0, x: -70 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.15,
                        }}
                    >
                        Shop Local.
                        <br />

                        <span>
                            Live Better.
                        </span>
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0, x: -50 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                            duration: 0.7,
                            delay: 0.3,
                        }}
                    >
                        Discover quality products from local
                        sellers and get everything you need
                        in one place.
                    </motion.p>

                    <motion.div
                        className="hero-buttons"
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                            duration: 0.6,
                            delay: 0.45,
                        }}
                    >

                        <Link
                            to="/products"
                            className="hero-primary-btn"
                        >
                            Explore Products
                            <span>→</span>
                        </Link>

                        <Link
                            to="/register"
                            className="hero-secondary-btn"
                        >
                            Become a Seller
                        </Link>

                    </motion.div>

                </div>


                {/* HERO VISUAL */}

                <motion.div
                    className="hero-visual"
                    initial={{
                        opacity: 0,
                        scale: 0.7,
                        rotate: -8,
                    }}
                    animate={{
                        opacity: 1,
                        scale: 1,
                        rotate: 0,
                    }}
                    transition={{
                        duration: 1,
                        delay: 0.3,
                    }}
                >

                    <motion.div
                        className="hero-orbit orbit-one"
                        animate={{
                            rotate: 360,
                        }}
                        transition={{
                            duration: 18,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />

                    <motion.div
                        className="hero-orbit orbit-two"
                        animate={{
                            rotate: -360,
                        }}
                        transition={{
                            duration: 25,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                    />

                    <motion.div
                        className="shopping-circle"
                        animate={{
                            y: [0, -18, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        🛍️
                    </motion.div>


                    <motion.div
                        className="floating-card floating-card-one"
                        animate={{
                            y: [0, -12, 0],
                        }}
                        transition={{
                            duration: 3.5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <span>🥬</span>
                        <div>
                            <strong>Fresh Groceries</strong>
                            <small>From local stores</small>
                        </div>
                    </motion.div>


                    <motion.div
                        className="floating-card floating-card-two"
                        animate={{
                            y: [0, 14, 0],
                        }}
                        transition={{
                            duration: 4,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    >
                        <span>🛒</span>
                        <div>
                            <strong>Easy Shopping</strong>
                            <small>Everything nearby</small>
                        </div>
                    </motion.div>

                </motion.div>

            </section>


            {/* ================= CATEGORY SECTION ================= */}

            <section className="categories-section">

                <motion.div
                    className="section-heading"
                    initial={{
                        opacity: 0,
                        y: 50,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                        amount: 0.3,
                    }}
                    transition={{
                        duration: 0.7,
                    }}
                >

                    <span>
                        EXPLORE
                    </span>

                    <h2>
                        Everything You Need,
                        <br />
                        <strong>Right Around You.</strong>
                    </h2>

                    <p>
                        Discover products and services available
                        from sellers in your local area.
                    </p>

                </motion.div>


                <div className="category-grid">

                    {categories.map((category, index) => (

                        <motion.div
                            className="category-card"
                            key={category.title}
                            initial={{
                                opacity: 0,
                                y: 80,
                                scale: 0.9,
                            }}
                            whileInView={{
                                opacity: 1,
                                y: 0,
                                scale: 1,
                            }}
                            viewport={{
                                once: true,
                                amount: 0.2,
                            }}
                            transition={{
                                duration: 0.7,
                                delay: index * 0.12,
                            }}
                            whileHover={{
                                y: -12,
                                scale: 1.03,
                            }}
                        >

                            <div className="category-icon">
                                {category.icon}
                            </div>

                            <h3>
                                {category.title}
                            </h3>

                            <p>
                                {category.description}
                            </p>

                            <span className="category-arrow">
                                Explore →
                            </span>

                        </motion.div>

                    ))}

                </div>

            </section>


            {/* ================= LOCAL SHOPPING SECTION ================= */}

            <section className="local-section">

                <motion.div
                    className="local-content"
                    initial={{
                        opacity: 0,
                        x: -80,
                    }}
                    whileInView={{
                        opacity: 1,
                        x: 0,
                    }}
                    viewport={{
                        once: true,
                        amount: 0.25,
                    }}
                    transition={{
                        duration: 0.8,
                    }}
                >

                    <span className="section-label">
                        WHY LOCAL?
                    </span>

                    <h2>
                        Your neighborhood
                        <span> at your fingertips.</span>
                    </h2>

                    <p>
                        Find nearby shops, discover products,
                        compare prices and support local sellers —
                        all from one platform.
                    </p>

                    <Link
                        to="/products"
                        className="local-button"
                    >
                        Discover Nearby Products →
                    </Link>

                </motion.div>


                <motion.div
                    className="local-visual"
                    initial={{
                        opacity: 0,
                        x: 80,
                        rotate: 5,
                    }}
                    whileInView={{
                        opacity: 1,
                        x: 0,
                        rotate: 0,
                    }}
                    viewport={{
                        once: true,
                        amount: 0.25,
                    }}
                    transition={{
                        duration: 0.9,
                    }}
                >

                    <div className="map-card">

                        <div className="map-grid"></div>

                        <motion.div
                            className="location-pin pin-one"
                            animate={{
                                y: [0, -8, 0],
                            }}
                            transition={{
                                duration: 2,
                                repeat: Infinity,
                            }}
                        >
                            📍
                        </motion.div>

                        <motion.div
                            className="location-pin pin-two"
                            animate={{
                                y: [0, -10, 0],
                            }}
                            transition={{
                                duration: 2.5,
                                repeat: Infinity,
                            }}
                        >
                            📍
                        </motion.div>

                        <motion.div
                            className="location-pin pin-three"
                            animate={{
                                y: [0, -7, 0],
                            }}
                            transition={{
                                duration: 3,
                                repeat: Infinity,
                            }}
                        >
                            📍
                        </motion.div>

                        <div className="map-center">
                            <span>📍</span>
                            <strong>You</strong>
                        </div>

                    </div>

                </motion.div>

            </section>


            {/* ================= FEATURED SECTION ================= */}

            <section className="featured-section">

                <motion.div
                    className="section-heading"
                    initial={{
                        opacity: 0,
                        y: 60,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    transition={{
                        duration: 0.8,
                    }}
                >

                    <span>
                        POPULAR
                    </span>

                    <h2>
                        Discover Local Favorites
                    </h2>

                    <p>
                        Popular products from sellers around you.
                    </p>

                </motion.div>


                <motion.div
                    className="featured-placeholder"
                    initial={{
                        opacity: 0,
                        scale: 0.85,
                        y: 60,
                    }}
                    whileInView={{
                        opacity: 1,
                        scale: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                        amount: 0.25,
                    }}
                    transition={{
                        duration: 0.8,
                    }}
                >

                    <motion.div
                        className="featured-icon"
                        animate={{
                            rotate: [0, -8, 8, 0],
                        }}
                        transition={{
                            duration: 3,
                            repeat: Infinity,
                        }}
                    >
                        🛒
                    </motion.div>

                    <h3>
                        Amazing products are waiting!
                    </h3>

                    <p>
                        Explore our complete collection from
                        local sellers.
                    </p>

                    <Link
                        to="/products"
                        className="hero-primary-btn"
                    >
                        View All Products →
                    </Link>

                </motion.div>

            </section>


            {/* ================= FINAL CTA ================= */}

            <section className="home-cta">

                <motion.div
                    initial={{
                        opacity: 0,
                        y: 60,
                    }}
                    whileInView={{
                        opacity: 1,
                        y: 0,
                    }}
                    viewport={{
                        once: true,
                    }}
                    transition={{
                        duration: 0.8,
                    }}
                >

                    <span>
                        SHOP SMART. SHOP LOCAL.
                    </span>

                    <h2>
                        Your local market,
                        <br />
                        <strong>one click away.</strong>
                    </h2>

                    <Link
                        to="/products"
                        className="cta-button"
                    >
                        Start Shopping →
                    </Link>

                </motion.div>

            </section>

        </main>
    );
}

export default Home;