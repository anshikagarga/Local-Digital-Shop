export const getStoreName = (seller) => {
    if (!seller) {
        return "Local Seller";
    }

    return seller.storeName || seller.shopName || "Local Seller";
};

export const getStoreLocation = (seller) => {
    if (!seller) {
        return null;
    }

    if (seller.location) {
        return seller.location;
    }

    const parts = [seller.city, seller.state].filter(Boolean);
    return parts.length > 0 ? parts.join(", ") : null;
};

export const getLocationLabel = (seller) => {
    const location = getStoreLocation(seller);

    if (!location) {
        return "Location unavailable";
    }

    return location;
};
