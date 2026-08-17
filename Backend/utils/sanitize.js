/**
 * Strip sensitive seller fields before sending product data to public clients.
 * Never expose email, phone, address, password, or personal name on public routes.
 */

export const formatPublicSeller = (seller) => {
    if (!seller) {
        return null;
    }

    const doc = typeof seller.toObject === "function"
        ? seller.toObject()
        : seller;

    const city = doc.city?.trim() || "";
    const state = doc.state?.trim() || "";
    const pincode = doc.pincode?.trim() || "";

    const locationParts = [city, state].filter(Boolean);
    const location = locationParts.length > 0
        ? locationParts.join(", ")
        : null;

    return {
        storeName: doc.shopName?.trim() || "Local Seller",
        location,
        city: city || null,
        pincode: pincode || null,
    };
};

export const formatPublicProduct = (product) => {
    if (!product) {
        return null;
    }

    const doc = typeof product.toObject === "function"
        ? product.toObject()
        : { ...product };

    return {
        _id: doc._id,
        productName: doc.productName,
        description: doc.description,
        category: doc.category,
        price: doc.price,
        stock: doc.stock,
        image: doc.image,
        seller: formatPublicSeller(doc.seller),
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
    };
};

export const formatPublicProducts = (products) => {
    if (!Array.isArray(products)) {
        return [];
    }

    return products.map(formatPublicProduct);
};
