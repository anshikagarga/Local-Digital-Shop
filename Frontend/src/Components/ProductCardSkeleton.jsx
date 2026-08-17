function ProductCardSkeleton() {
    return (
        <div className="skeleton-card">
            <div className="skeleton skeleton-img"></div>
            <div className="skeleton skeleton-text" style={{ width: "35%" }}></div>
            <div className="skeleton skeleton-text" style={{ width: "75%", height: "1.25rem" }}></div>
            <div className="skeleton skeleton-text" style={{ width: "90%" }}></div>
            <div style={{ marginTop: "auto", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div className="skeleton skeleton-text" style={{ width: "40%", height: "1.5rem" }}></div>
                <div className="skeleton skeleton-text" style={{ width: "30%", height: "2rem", borderRadius: "0.5rem" }}></div>
            </div>
        </div>
    );
}

export default ProductCardSkeleton;
