import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import "./ProductDetails.css";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:5000/api";

const FALLBACK_IMAGE = "/images/product-placeholder.png";

function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [quantity, setQuantity] = useState(1);

  const [selectedImage, setSelectedImage] =
    useState(0);

  const [wishlist, setWishlist] = useState(false);

  const [cartLoading, setCartLoading] =
    useState(false);

  /* =====================================================
     LOAD WISHLIST STATE
  ===================================================== */

  useEffect(() => {
    try {
      const saved =
        localStorage.getItem("wishlist");

      if (!saved) return;

      const items = JSON.parse(saved);

      if (!Array.isArray(items)) return;

      const exists = items.some(
        (item) =>
          String(
            item?._id ||
              item?.id ||
              item
          ) === String(id)
      );

      setWishlist(exists);
    } catch (err) {
      console.error(
        "Wishlist state error:",
        err
      );
    }
  }, [id]);


  /* =====================================================
     FETCH PRODUCT
  ===================================================== */

  useEffect(() => {
    let cancelled = false;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          `${API_URL}/products/${id}`
        );

        if (!response.ok) {
          if (response.status === 404) {
            throw new Error(
              "PRODUCT_NOT_FOUND"
            );
          }

          throw new Error(
            `Request failed: ${response.status}`
          );
        }

        const result =
          await response.json();

        const receivedProduct =
          result?.data?.product ||
          result?.data ||
          result?.product ||
          result;

        if (
          !receivedProduct ||
          typeof receivedProduct !==
            "object"
        ) {
          throw new Error(
            "Invalid product response"
          );
        }

        if (!cancelled) {
          setProduct(receivedProduct);
        }
      } catch (err) {
        console.error(
          "Product details error:",
          err
        );

        if (!cancelled) {
          if (
            err.message ===
            "PRODUCT_NOT_FOUND"
          ) {
            setError(
              "This product could not be found."
            );
          } else {
            setError(
              "Unable to load this product right now."
            );
          }
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    if (id) {
      fetchProduct();
    }

    return () => {
      cancelled = true;
    };
  }, [id]);


  /* =====================================================
     PRODUCT IMAGES
  ===================================================== */

  const getImages = () => {
    if (!product) return [];

    if (
      Array.isArray(product.images) &&
      product.images.length > 0
    ) {
      return product.images;
    }

    if (product.image) {
      return [product.image];
    }

    if (product.imageUrl) {
      return [product.imageUrl];
    }

    return [FALLBACK_IMAGE];
  };


  const images = getImages();


  /* =====================================================
     IMAGE FALLBACK
  ===================================================== */

  const handleImageError = (
    event
  ) => {
    const image =
      event.currentTarget;

    if (
      image.dataset.fallbackApplied ===
      "true"
    ) {
      return;
    }

    image.dataset.fallbackApplied =
      "true";

    image.src = FALLBACK_IMAGE;
  };


  /* =====================================================
     STOCK
  ===================================================== */

  const stock =
    product?.stock !== undefined &&
    product?.stock !== null
      ? Number(product.stock)
      : null;

  const isOutOfStock =
    stock !== null && stock <= 0;


  const maxQuantity =
    stock !== null && stock > 0
      ? stock
      : 99;


  /* =====================================================
     QUANTITY
  ===================================================== */

  const increaseQuantity = () => {
    setQuantity((current) =>
      Math.min(
        current + 1,
        maxQuantity
      )
    );
  };


  const decreaseQuantity = () => {
    setQuantity((current) =>
      Math.max(current - 1, 1)
    );
  };


  /* =====================================================
     WISHLIST
  ===================================================== */

  const toggleWishlist = () => {
    if (!product) return;

    const productId =
      product._id || product.id;

    if (!productId) return;

    try {
      const saved =
        localStorage.getItem(
          "wishlist"
        );

      let items = saved
        ? JSON.parse(saved)
        : [];

      if (!Array.isArray(items)) {
        items = [];
      }

      const exists = items.some(
        (item) =>
          String(
            item?._id ||
              item?.id ||
              item
          ) === String(productId)
      );

      if (exists) {
        items = items.filter(
          (item) =>
            String(
              item?._id ||
                item?.id ||
                item
            ) !== String(productId)
        );

        setWishlist(false);
      } else {
        items.push(product);

        setWishlist(true);
      }

      localStorage.setItem(
        "wishlist",
        JSON.stringify(items)
      );

      window.dispatchEvent(
        new CustomEvent(
          "wishlistUpdated"
        )
      );
    } catch (err) {
      console.error(
        "Wishlist update error:",
        err
      );
    }
  };


  /* =====================================================
     ADD TO CART
  ===================================================== */

  const addToCart = async () => {
    if (!product || isOutOfStock) {
      return;
    }

    try {
      setCartLoading(true);

      const token =
        localStorage.getItem(
          "token"
        );

      if (!token) {
        navigate("/login", {
          state: {
            from: `/products/${id}`,
          },
        });

        return;
      }

      const productId =
        product._id || product.id;

      const response =
        await fetch(
          `${API_URL}/cart`,
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",

              Authorization:
                `Bearer ${token}`,
            },

            body: JSON.stringify({
              productId,
              quantity,
            }),
          }
        );

      if (response.status === 401) {
        localStorage.removeItem(
          "token"
        );

        navigate("/login", {
          state: {
            from: `/products/${id}`,
          },
        });

        return;
      }

      if (!response.ok) {
        throw new Error(
          `Cart request failed: ${response.status}`
        );
      }

      window.dispatchEvent(
        new CustomEvent(
          "cartUpdated"
        )
      );

      /*
       * We don't automatically navigate
       * away from the product page.
       */

    } catch (err) {
      console.error(
        "Add to cart error:",
        err
      );

      window.dispatchEvent(
        new CustomEvent(
          "appError",
          {
            detail:
              "Unable to add this product to your cart.",
          }
        )
      );
    } finally {
      setCartLoading(false);
    }
  };


  /* =====================================================
     SELLER INFORMATION
  ===================================================== */

  const getSellerName = () => {
    if (
      product?.seller?.storeName
    ) {
      return product.seller.storeName;
    }

    if (product?.storeName) {
      return product.storeName;
    }

    if (
      typeof product?.seller ===
      "string"
    ) {
      return product.seller;
    }

    return "Local Seller";
  };


  const getSellerCity = () => {
    if (
      product?.seller?.city
    ) {
      return product.seller.city;
    }

    if (product?.city) {
      return product.city;
    }

    return "";
  };


  const getSellerArea = () => {
    if (
      product?.seller?.area
    ) {
      return product.seller.area;
    }

    if (product?.area) {
      return product.area;
    }

    return "";
  };


  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <main className="product-details-page">

        <div className="product-details-container">

          <ProductDetailsSkeleton />

        </div>

      </main>
    );
  }


  /* =====================================================
     ERROR
  ===================================================== */

  if (error || !product) {
    return (
      <main className="product-details-page">

        <div className="product-details-container">

          <div className="product-details-state">

            <div className="details-state-icon">
              !
            </div>

            <h1>
              Product unavailable
            </h1>

            <p>
              {error ||
                "This product could not be loaded."}
            </p>

            <div className="state-actions">

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
              >
                Try Again
              </button>

              <Link to="/products">
                Back to Products
              </Link>

            </div>

          </div>

        </div>

      </main>
    );
  }


  /* =====================================================
     RENDER
  ===================================================== */

  return (
    <main className="product-details-page">

      <div className="product-details-container">

        {/* =================================================
            BREADCRUMB
        ================================================= */}

        <motion.nav
          className="product-breadcrumb"
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
          }}
        >

          <Link to="/">
            Home
          </Link>

          <span>/</span>

          <Link to="/products">
            Products
          </Link>

          <span>/</span>

          <span>
            {product.name}
          </span>

        </motion.nav>


        {/* =================================================
            PRODUCT
        ================================================= */}

        <section className="product-details-layout">

          {/* =================================================
              IMAGE AREA
          ================================================= */}

          <motion.div
            className="product-gallery"
            initial={{
              opacity: 0,
              x: -25,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.5,
            }}
          >

            <div className="product-main-image">

              <img
                src={
                  images[
                    selectedImage
                  ] ||
                  FALLBACK_IMAGE
                }
                alt={
                  product.name ||
                  "Product"
                }
                onError={
                  handleImageError
                }
              />

              {product.category && (
                <span className="details-category">
                  {product.category}
                </span>
              )}

            </div>


            {/* THUMBNAILS */}

            {images.length > 1 && (

              <div
                className="product-thumbnails"
                role="list"
              >

                {images.map(
                  (image, index) => (

                    <button
                      key={`${image}-${index}`}
                      type="button"
                      className={
                        selectedImage ===
                        index
                          ? "thumbnail active"
                          : "thumbnail"
                      }
                      onClick={() =>
                        setSelectedImage(
                          index
                        )
                      }
                      aria-label={`View product image ${
                        index + 1
                      }`}
                    >

                      <img
                        src={
                          image ||
                          FALLBACK_IMAGE
                        }
                        alt=""
                        onError={
                          handleImageError
                        }
                      />

                    </button>

                  )
                )}

              </div>

            )}

          </motion.div>


          {/* =================================================
              PRODUCT INFORMATION
          ================================================= */}

          <motion.div
            className="product-details-info"
            initial={{
              opacity: 0,
              x: 25,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            transition={{
              duration: 0.5,
              delay: 0.08,
            }}
          >

            {/* STOCK */}

            <div className="details-topline">

              <span
                className={
                  isOutOfStock
                    ? "stock-badge out"
                    : "stock-badge"
                }
              >
                {isOutOfStock
                  ? "Out of stock"
                  : stock !== null &&
                    stock <= 5
                  ? `Only ${stock} left`
                  : "In stock"}
              </span>

            </div>


            {/* TITLE */}

            <h1>
              {product.name ||
                "Unnamed Product"}
            </h1>


            {/* DESCRIPTION */}

            <p className="product-description">
              {product.description ||
                "A quality product from a local seller."}
            </p>


            {/* PRICE */}

            <div className="details-price">

              ₹
              {Number(
                product.price || 0
              ).toLocaleString(
                "en-IN"
              )}

            </div>


            {/* DIVIDER */}

            <div className="details-divider" />


            {/* SELLER */}

            <div className="seller-section">

              <div className="seller-icon">
                {getSellerName()
                  .charAt(0)
                  .toUpperCase()}
              </div>

              <div className="seller-info">

                <span>
                  Sold by
                </span>

                <strong>
                  {getSellerName()}
                </strong>

                {(getSellerCity() ||
                  getSellerArea()) && (

                  <small>
                    {[
                      getSellerArea(),
                      getSellerCity(),
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </small>

                )}

              </div>

            </div>


            {/* QUANTITY */}

            {!isOutOfStock && (

              <div className="quantity-section">

                <span>
                  Quantity
                </span>

                <div className="quantity-control">

                  <button
                    type="button"
                    onClick={
                      decreaseQuantity
                    }
                    disabled={
                      quantity <= 1
                    }
                    aria-label="Decrease quantity"
                  >
                    −
                  </button>

                  <span>
                    {quantity}
                  </span>

                  <button
                    type="button"
                    onClick={
                      increaseQuantity
                    }
                    disabled={
                      quantity >=
                      maxQuantity
                    }
                    aria-label="Increase quantity"
                  >
                    +
                  </button>

                </div>

              </div>

            )}


            {/* ACTIONS */}

            <div className="product-actions">

              <button
                type="button"
                className="details-cart-button"
                disabled={
                  isOutOfStock ||
                  cartLoading
                }
                onClick={addToCart}
              >

                {cartLoading
                  ? "Adding..."
                  : isOutOfStock
                  ? "Out of Stock"
                  : "Add to Cart"}

              </button>


              <button
                type="button"
                className={
                  wishlist
                    ? "details-wishlist active"
                    : "details-wishlist"
                }
                onClick={
                  toggleWishlist
                }
                aria-label={
                  wishlist
                    ? "Remove from wishlist"
                    : "Add to wishlist"
                }
                aria-pressed={
                  wishlist
                }
              >

                <svg
                  viewBox="0 0 24 24"
                  aria-hidden="true"
                >

                  <path
                    d="M20.8 8.9c0 5.2-8.8 10-8.8 10s-8.8-4.8-8.8-10A4.8 4.8 0 0 1 12 6.2a4.8 4.8 0 0 1 8.8 2.7Z"
                    fill={
                      wishlist
                        ? "currentColor"
                        : "none"
                    }
                    stroke="currentColor"
                    strokeWidth="1.7"
                  />

                </svg>

              </button>

            </div>


            {/* LOCAL MARKETPLACE MESSAGE */}

            <div className="local-shopping-note">

              <div className="note-icon">
                ✓
              </div>

              <div>

                <strong>
                  Shop local
                </strong>

                <p>
                  Support nearby sellers
                  and discover products
                  available in your area.
                </p>

              </div>

            </div>

          </motion.div>

        </section>


        {/* =================================================
            PRODUCT INFORMATION
        ================================================= */}

        <motion.section
          className="product-extra-info"
          initial={{
            opacity: 0,
            y: 25,
          }}
          whileInView={{
            opacity: 1,
            y: 0,
          }}
          viewport={{
            once: true,
            amount: 0.2,
          }}
          transition={{
            duration: 0.5,
          }}
        >

          <div className="extra-info-card">

            <span>
              Category
            </span>

            <strong>
              {product.category ||
                "General"}
            </strong>

          </div>


          <div className="extra-info-card">

            <span>
              Availability
            </span>

            <strong>
              {isOutOfStock
                ? "Currently unavailable"
                : "Available"}
            </strong>

          </div>


          <div className="extra-info-card">

            <span>
              Seller
            </span>

            <strong>
              {getSellerName()}
            </strong>

          </div>


          {(getSellerCity() ||
            getSellerArea()) && (

            <div className="extra-info-card">

              <span>
                Location
              </span>

              <strong>
                {[
                  getSellerArea(),
                  getSellerCity(),
                ]
                  .filter(Boolean)
                  .join(", ")}
              </strong>

            </div>

          )}

        </motion.section>

      </div>

    </main>
  );
}


/* =====================================================
   SKELETON
===================================================== */

function ProductDetailsSkeleton() {
  return (
    <div className="details-skeleton">

      <div className="skeleton-main-image" />

      <div className="skeleton-details">

        <div className="skeleton-line small" />

        <div className="skeleton-line title" />

        <div className="skeleton-line" />

        <div className="skeleton-line medium" />

        <div className="skeleton-price" />

        <div className="skeleton-divider" />

        <div className="skeleton-seller" />

        <div className="skeleton-action" />

      </div>

    </div>
  );
}


export default ProductDetails;