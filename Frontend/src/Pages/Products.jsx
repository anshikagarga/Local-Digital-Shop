import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import ProductCard from "../Components/ProductCard";
import ProductCardSkeleton from "../Components/ProductCardSkeleton";
import { apiRequest } from "../Services/api";
import "./Products.css";

function Products() {
    const [searchParams, setSearchParams] = useSearchParams();

    const initialCategory = searchParams.get("category") || "";
    const initialCity = searchParams.get("city") || "";

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Filter states
    const [search, setSearch] = useState("");
    const [category, setCategory] = useState(initialCategory);
    const [city, setCity] = useState(initialCity);
    const [sort, setSort] = useState("newest");

    const categories = ["All", "Groceries", "Electronics", "Clothing", "Home", "Beauty", "Other"];

    const fetchProducts = async () => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (search) queryParams.append("search", search);
            if (category && category !== "All") queryParams.append("category", category);
            if (city) queryParams.append("city", city);
            if (sort) queryParams.append("sort", sort);

            const endpoint = `/products?${queryParams.toString()}`;
            const data = await apiRequest(endpoint);

            setProducts(data.data || []);
            setError("");
        } catch (err) {
            if (err.message.includes("Failed to fetch") || err.message.includes("ERR_CONNECTION_REFUSED")) {
                setError("Unable to connect to the local server. Please check if backend is running at http://localhost:5000.");
            } else {
                setError(err.message);
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, [category, sort]);

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        fetchProducts();
    };

    const handleCategoryClick = (cat) => {
        const nextCat = cat === "All" ? "" : cat;
        setCategory(nextCat);
        setSearchParams((prev) => {
            if (nextCat) prev.set("category", nextCat);
            else prev.delete("category");
            return prev;
        });
    };

    return (
        <main className="products-page">
            <section className="products-header">
                <span>LOCAL MARKETPLACE</span>
                <h1>Explore Neighborhood Products</h1>
                <p>Browse fresh inventory from local sellers in your city</p>
            </section>

            {/* Filter & Search Toolbar */}
            <div className="filter-toolbar">
                <form className="search-form" onSubmit={handleSearchSubmit}>
                    <input
                        type="text"
                        placeholder="Search product name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Filter by City / Area..."
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                    />
                    <button type="submit" className="filter-search-btn">
                        Search
                    </button>
                </form>

                <div className="sort-box">
                    <label>Sort By:</label>
                    <select value={sort} onChange={(e) => setSort(e.target.value)}>
                        <option value="newest">Newest Arrivals</option>
                        <option value="price_asc">Price: Low to High</option>
                        <option value="price_desc">Price: High to Low</option>
                        <option value="oldest">Oldest First</option>
                    </select>
                </div>
            </div>

            {/* Category Pills */}
            <div className="category-pills">
                {categories.map((cat) => (
                    <button
                        key={cat}
                        type="button"
                        className={`pill-btn ${ (category === cat || (!category && cat === "All")) ? "active" : "" }`}
                        onClick={() => handleCategoryClick(cat)}
                    >
                        {cat}
                    </button>
                ))}
            </div>

            {/* Product Grid / Loading Skeleton / Error State / Empty State */}
            {loading ? (
                <div className="products-grid">
                    {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
                        <ProductCardSkeleton key={n} />
                    ))}
                </div>
            ) : error ? (
                <div className="server-error-banner">
                    <h3>⚠️ Connection Issue</h3>
                    <p>{error}</p>
                    <button onClick={fetchProducts} className="retry-btn" style={{ marginTop: "1rem" }}>
                        Retry Connection
                    </button>
                </div>
            ) : products.length === 0 ? (
                <div className="products-message empty">
                    <div className="empty-icon">🔍</div>
                    <h2>No products found</h2>
                    <p>Try adjusting your search query, location filter, or category selection.</p>
                </div>
            ) : (
                <>
                    <div className="results-count">
                        Found <strong>{products.length}</strong> products available
                    </div>
                    <div className="products-grid">
                        {products.map((product) => (
                            <ProductCard key={product._id} product={product} />
                        ))}
                    </div>
                </>
            )}
        </main>
    );
}

export default Products;