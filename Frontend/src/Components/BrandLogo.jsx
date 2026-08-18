import "./BrandLogo.css";

function BrandLogo({
  compact = false,
  className = "",
}) {
  return (
    <span
      className={`brand-logo ${
        compact ? "brand-logo--compact" : ""
      } ${className}`.trim()}
    >
      <span
        className="brand-logo-mark"
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 48 48"
          role="img"
        >
          {/* Location Pin */}
          <path
            className="brand-logo-pin"
            d="
              M24 4.5
              C15.2 4.5 8 11.4 8 20
              C8 31.1 24 43.5 24 43.5
              C24 43.5 40 31.1 40 20
              C40 11.4 32.8 4.5 24 4.5Z
            "
          />

          {/* Shopping Bag */}
          <path
            className="brand-logo-bag"
            d="
              M16.2 20.2
              H31.8
              L33.6 37.3
              H14.4
              Z
            "
          />

          {/* Bag Handle */}
          <path
            className="brand-logo-handle"
            d="
              M19.5 20.2
              V17.8
              C19.5 15.3 21.5 13.3 24 13.3
              C26.5 13.3 28.5 15.3 28.5 17.8
              V20.2
            "
          />
        </svg>
      </span>

      <span className="brand-logo-copy">
        <span className="brand-logo-name">
          LOCAL
        </span>

        <span className="brand-logo-tagline">
          DIGITAL SHOP
        </span>
      </span>
    </span>
  );
}

export default BrandLogo;