/**
 * Returns only fields safe for public product/seller display.
 * Never expose email, phone, address, password, or role.
 */
export const sanitizeSellerForPublic = (seller) => {
    if (!seller || typeof seller !== "object") {
        return null;
    }

    const storeName =
        seller.shopName?.trim() ||
        (seller.name ? `${seller.name.split(" ")[0]}'s Store` : "Local Store");

    const locationParts = [seller.city, seller.state].filter(Boolean);
    const location = locationParts.length > 0 ? locationParts.join(", ") : null;

    return {
        _id: seller._id,
        storeName,
        city: seller.city || null,
        state: seller.state || null,
        pincode: seller.pincode || null,
        location,
    };
};

export const sanitizeProductForPublic = (product) => {
    if (!product) return null;

    const doc = product.toObject ? product.toObject() : { ...product };

    if (doc.seller) {
        doc.seller = sanitizeSellerForPublic(doc.seller);
    }

    return doc;
};

export const sanitizeProductsForPublic = (products) =>
    products.map((p) => sanitizeProductForPublic(p));
