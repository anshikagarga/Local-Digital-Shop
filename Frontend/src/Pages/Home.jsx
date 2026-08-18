import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";
import "./Home.css";

const fadeUp = {
  hidden: {
    opacity: 0,
    y: 35,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.65,
      ease: "easeOut",
    },
  },
};

const stagger = {
  hidden: {},

  visible: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardAnimation = {
  hidden: {
    opacity: 0,
    y: 30,
  },

  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
};

function Home() {
  /* =====================================================
     FEATURED PRODUCTS
  ===================================================== */

  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);
  const [productsError, setProductsError] = useState("");

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setProductsLoading(true);
        setProductsError("");

        const baseUrl =
          import.meta.env.VITE_API_URL || "http://localhost:5000/api";

        const response = await fetch(`${baseUrl}/products`);

        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }

        const result = await response.json();

        const products =
          result?.data?.products ||
          result?.data ||
          result?.products ||
          [];

        setFeaturedProducts(
          Array.isArray(products)
            ? products.slice(0, 8)
            : []
        );
      } catch (error) {
        console.error(
          "Featured products error:",
          error
        );

        setProductsError(
          "Unable to load featured products."
        );
      } finally {
        setProductsLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);


  /* =====================================================
     MOUSE PARALLAX
  ===================================================== */

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 80,
    damping: 20,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 80,
    damping: 20,
  });

  const visualX = useTransform(
    smoothX,
    [-500, 500],
    [-16, 16]
  );

  const visualY = useTransform(
    smoothY,
    [-500, 500],
    [-16, 16]
  );

  const cardRotateX = useTransform(
    smoothY,
    [-500, 500],
    [4, -4]
  );

  const cardRotateY = useTransform(
    smoothX,
    [-500, 500],
    [-4, 4]
  );


  useEffect(() => {
    const handleMouseMove = (event) => {
      if (window.innerWidth <= 768) {
        return;
      }

      const centerX = window.innerWidth / 2;
      const centerY = window.innerHeight / 2;

      mouseX.set(event.clientX - centerX);
      mouseY.set(event.clientY - centerY);
    };

    const resetMouse = () => {
      mouseX.set(0);
      mouseY.set(0);
    };

    window.addEventListener(
      "mousemove",
      handleMouseMove
    );

    window.addEventListener(
      "mouseleave",
      resetMouse
    );

    return () => {
      window.removeEventListener(
        "mousemove",
        handleMouseMove
      );

      window.removeEventListener(
        "mouseleave",
        resetMouse
      );
    };
  }, [mouseX, mouseY]);


  return (
    <main className="home-page">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="home-hero">

        <div className="home-container home-hero-grid">

          {/* HERO CONTENT */}

          <motion.div
            className="hero-content"
            initial="hidden"
            animate="visible"
            variants={stagger}
          >

            <motion.span
              className="hero-eyebrow"
              variants={fadeUp}
            >
              LOCAL COMMERCE, REIMAGINED
            </motion.span>


            <motion.h1 variants={fadeUp}>
              Shop Local.
              <br />
              <span>Live Better.</span>
            </motion.h1>


            <motion.p variants={fadeUp}>
              Discover products from trusted local
              shops around you and support the
              businesses that make your neighborhood
              unique.
            </motion.p>


            {/* HERO BUTTONS */}

            <motion.div
              className="hero-actions"
              variants={fadeUp}
            >

              <Link
                to="/products"
                className="hero-primary-btn"
              >
                Browse Products
              </Link>


              <Link
                to="/register"
                className="hero-secondary-btn"
              >
                Become a Seller
              </Link>

            </motion.div>


            {/* LOCATION SEARCH */}

            <motion.div
              className="location-search"
              variants={fadeUp}
            >

              <div className="location-icon">

                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >

                  <path
                    d="M12 21s7-6.1 7-12A7 7 0 0 0 5 9c0 5.9 7 12 7 12Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <circle
                    cx="12"
                    cy="9"
                    r="2.3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                </svg>

              </div>


              <input
                type="text"
                placeholder="Enter your city or pincode"
                aria-label="Enter your city or pincode"
              />


              <button type="button">
                Find Nearby
              </button>

            </motion.div>

          </motion.div>


          {/* =====================================================
              HERO VISUAL
          ===================================================== */}

          <motion.div
            className="hero-visual"
            style={{
              x: visualX,
              y: visualY,
            }}
            initial={{
              opacity: 0,
              scale: 0.9,
            }}
            animate={{
              opacity: 1,
              scale: 1,
            }}
            transition={{
              duration: 0.9,
              ease: "easeOut",
            }}
          >

            <div className="hero-orbit hero-orbit-one" />

            <div className="hero-orbit hero-orbit-two" />


            {/* FLOATING BADGE */}

            <motion.div
              className="floating-badge floating-badge-top"
              animate={{
                y: [0, -10, 0],
                rotate: [0, 2, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >

              <span className="badge-dot" />

              Nearby

            </motion.div>


            {/* STORE CARD */}

            <motion.div
              className="hero-store-card"
              style={{
                rotateX: cardRotateX,
                rotateY: cardRotateY,
              }}
              animate={{
                y: [0, -10, 0],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >

              <div className="hero-store-top">

                <div className="hero-store-icon">
                  LD
                </div>


                <div>

                  <strong>
                    Local Marketplace
                  </strong>

                  <span>
                    Your neighborhood
                  </span>

                </div>

              </div>


              <div className="hero-store-products">

                <div className="hero-product-card">
                  <div className="hero-placeholder">
                    Fresh
                  </div>
                </div>


                <div className="hero-product-card">
                  <div className="hero-placeholder">
                    Local
                  </div>
                </div>


                <div className="hero-product-card">
                  <div className="hero-placeholder">
                    Shop
                  </div>
                </div>

              </div>


              <div className="hero-store-footer">

                <span>
                  Local sellers
                </span>

                <span>
                  Nearby products
                </span>

              </div>

            </motion.div>


            {/* FLOATING MINI CARD */}

            <motion.div
              className="floating-mini-card"
              animate={{
                y: [0, 12, 0],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >

              <div className="mini-icon">
                ✓
              </div>

              <div>

                <strong>
                  Shop Local
                </strong>

                <span>
                  Support nearby sellers
                </span>

              </div>

            </motion.div>

          </motion.div>

        </div>


        {/* SCROLL INDICATOR */}

        <motion.div
          className="scroll-indicator"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
          transition={{
            delay: 1,
            duration: 0.5,
          }}
        >

          <span>
            Scroll to explore
          </span>

          <motion.div
            className="scroll-line"
            animate={{
              scaleY: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />

        </motion.div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <motion.section
        className="home-section how-section"
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.2,
        }}
        variants={stagger}
      >

        <div className="home-container">

          <motion.div
            className="section-heading"
            variants={fadeUp}
          >

            <span>
              SIMPLE & LOCAL
            </span>

            <h2>
              Shopping made closer.
            </h2>

            <p>
              Find what you need from businesses
              around your neighborhood.
            </p>

          </motion.div>


          <motion.div
            className="how-grid"
            variants={stagger}
          >

            <motion.article
              className="how-card"
              variants={cardAnimation}
              whileHover={{
                y: -8,
              }}
            >

              <div className="how-number">
                01
              </div>

              <h3>
                Discover
              </h3>

              <p>
                Explore products available from
                local sellers.
              </p>

            </motion.article>


            <motion.article
              className="how-card"
              variants={cardAnimation}
              whileHover={{
                y: -8,
              }}
            >

              <div className="how-number">
                02
              </div>

              <h3>
                Choose
              </h3>

              <p>
                Compare products and find the
                right option for you.
              </p>

            </motion.article>


            <motion.article
              className="how-card"
              variants={cardAnimation}
              whileHover={{
                y: -8,
              }}
            >

              <div className="how-number">
                03
              </div>

              <h3>
                Shop Local
              </h3>

              <p>
                Purchase from businesses that
                are part of your community.
              </p>

            </motion.article>

          </motion.div>

        </div>

      </motion.section>


      {/* =====================================================
          CATEGORIES
      ===================================================== */}

      <motion.section
        className="home-section categories-section"
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.15,
        }}
        variants={stagger}
      >

        <div className="home-container">

          <motion.div
            className="section-heading section-heading-row"
            variants={fadeUp}
          >

            <div>

              <span>
                EXPLORE
              </span>

              <h2>
                Browse categories
              </h2>

            </div>


            <Link
              to="/products"
              className="section-link"
            >
              View all
            </Link>

          </motion.div>


          <motion.div
            className="category-grid"
            variants={stagger}
          >

            <motion.div
              variants={cardAnimation}
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
            >

              <Link
                to="/products"
                className="category-card category-food"
              >

                <span>
                  Food & Grocery
                </span>

                <small>
                  Everyday essentials
                </small>

              </Link>

            </motion.div>


            <motion.div
              variants={cardAnimation}
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
            >

              <Link
                to="/products"
                className="category-card category-fashion"
              >

                <span>
                  Fashion
                </span>

                <small>
                  Style from local stores
                </small>

              </Link>

            </motion.div>


            <motion.div
              variants={cardAnimation}
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
            >

              <Link
                to="/products"
                className="category-card category-electronics"
              >

                <span>
                  Electronics
                </span>

                <small>
                  Useful tech nearby
                </small>

              </Link>

            </motion.div>


            <motion.div
              variants={cardAnimation}
              whileHover={{
                y: -8,
                scale: 1.02,
              }}
            >

              <Link
                to="/products"
                className="category-card category-home"
              >

                <span>
                  Home
                </span>

                <small>
                  For your everyday space
                </small>

              </Link>

            </motion.div>

          </motion.div>

        </div>

      </motion.section>


      {/* =====================================================
          FEATURED PRODUCTS
      ===================================================== */}

      <motion.section
        className="home-section featured-section"
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.15,
        }}
        variants={stagger}
      >

        <div className="home-container">

          <motion.div
            className="section-heading section-heading-row"
            variants={fadeUp}
          >

            <div>

              <span>
                DISCOVER NEARBY
              </span>

              <h2>
                Featured products
              </h2>

              <p>
                Explore products from local sellers.
              </p>

            </div>


            <Link
              to="/products"
              className="section-link"
            >
              View all
            </Link>

          </motion.div>


          {/* LOADING */}

          {productsLoading && (
            <div className="featured-grid">

              {Array.from({
                length: 4,
              }).map((_, index) => (

                <div
                  className="featured-skeleton"
                  key={index}
                >

                  <div className="skeleton-image" />

                  <div className="skeleton-line" />

                  <div className="skeleton-line short" />

                </div>

              ))}

            </div>
          )}


          {/* ERROR */}

          {!productsLoading &&
            productsError && (

              <div className="featured-message error">
                {productsError}
              </div>

            )}


          {/* EMPTY */}

          {!productsLoading &&
            !productsError &&
            featuredProducts.length === 0 && (

              <div className="featured-message">
                No products are available yet.
              </div>

            )}


          {/* PRODUCTS */}

          {!productsLoading &&
            !productsError &&
            featuredProducts.length > 0 && (

              <motion.div
                className="featured-grid"
                variants={stagger}
              >

                {featuredProducts.map(
                  (product) => (

                    <motion.article
                      className="featured-product-card"
                      key={product._id}
                      variants={cardAnimation}
                      whileHover={{
                        y: -6,
                      }}
                    >

                      <Link
                        to={`/products/${product._id}`}
                        className="featured-image-wrapper"
                      >

                        <img
                          src={
                            product.image ||
                            product.imageUrl ||
                            "/images/product-placeholder.png"
                          }
                          alt={
                            product.name ||
                            "Product"
                          }
                          loading="lazy"
                        />

                      </Link>


                      <div className="featured-product-content">

                        {product.category && (
                          <span className="featured-category">
                            {product.category}
                          </span>
                        )}


                        <Link
                          to={`/products/${product._id}`}
                          className="featured-product-name"
                        >
                          {product.name}
                        </Link>


                        <div className="featured-product-bottom">

                          <strong>
                            ₹
                            {Number(
                              product.price || 0
                            ).toLocaleString(
                              "en-IN"
                            )}
                          </strong>


                          <Link
                            to={`/products/${product._id}`}
                            className="featured-view"
                          >
                            View
                          </Link>

                        </div>

                      </div>

                    </motion.article>

                  )
                )}

              </motion.div>

            )}

        </div>

      </motion.section>


      {/* =====================================================
          WHY SHOP LOCAL
      ===================================================== */}

      <motion.section
        className="home-section why-section"
        initial="hidden"
        whileInView="visible"
        viewport={{
          once: true,
          amount: 0.2,
        }}
        variants={stagger}
      >

        <div className="home-container why-grid">

          <motion.div
            className="why-content"
            variants={fadeUp}
          >

            <span>
              WHY SHOP LOCAL?
            </span>

            <h2>
              Your neighborhood
              has more to offer.
            </h2>

            <p>
              Local Digital Shop brings neighborhood
              businesses and shoppers together in
              one convenient marketplace.
            </p>


            <ul>

              <li>
                Discover businesses around you
              </li>

              <li>
                Support local sellers
              </li>

              <li>
                Find products closer to home
              </li>

            </ul>

          </motion.div>


          <motion.div
            className="why-visual"
            variants={fadeUp}
          >

            <motion.div
              className="why-visual-inner"
              animate={{
                scale: [1, 1.04, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >

              <span className="why-location-dot" />

              <motion.span
                className="why-location-ring"
                animate={{
                  scale: [1, 1.15, 1],
                  opacity: [0.8, 0.3, 0.8],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <div className="why-label">
                Local
              </div>

            </motion.div>

          </motion.div>

        </div>

      </motion.section>


      {/* =====================================================
          SELLER CTA
      ===================================================== */}

      <motion.section
        className="seller-cta"
        initial={{
          opacity: 0,
          y: 40,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
        }}
        viewport={{
          once: true,
          amount: 0.25,
        }}
        transition={{
          duration: 0.7,
        }}
      >

        <div className="home-container seller-cta-inner">

          <div>

            <span>
              FOR LOCAL BUSINESSES
            </span>

            <h2>
              Take your local store online.
            </h2>

            <p>
              Reach more customers while keeping
              your business connected to the community.
            </p>

          </div>


          <motion.div
            whileHover={{
              scale: 1.04,
            }}
            whileTap={{
              scale: 0.97,
            }}
          >

            <Link
              to="/register"
              className="seller-cta-button"
            >
              Become a Seller
            </Link>

          </motion.div>

        </div>

      </motion.section>

    </main>
  );
}

export default Home;