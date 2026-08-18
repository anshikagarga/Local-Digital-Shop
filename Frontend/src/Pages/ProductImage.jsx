import { useState } from "react";
import "./ProductImage.css";

function ProductImage({
  src,
  alt = "Product image",
  className = "",
}) {
  const [loading, setLoading] = useState(Boolean(src));
  const [hasError, setHasError] = useState(false);

  const handleLoad = () => {
    setLoading(false);
  };

  const handleError = (event) => {
    setLoading(false);
    setHasError(true);

    // Prevent the browser from repeatedly requesting
    // the same broken image.
    event.currentTarget.removeAttribute("src");
  };

  return (
    <div className={`product-image ${className}`}>

      {loading && (
        <div
          className="product-image-skeleton"
          aria-hidden="true"
        />
      )}

      {!hasError && src ? (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          onLoad={handleLoad}
          onError={handleError}
        />
      ) : (
        <div
          className="product-image-fallback"
          role="img"
          aria-label="Product image unavailable"
        >
          <span>Image unavailable</span>
        </div>
      )}

    </div>
  );
}

export default ProductImage;