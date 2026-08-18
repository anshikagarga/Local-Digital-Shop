import Product from "../models/Product.js";

// ==========================================
// ADD PRODUCT
// ==========================================

export const addProductService = async (
    productData,
    sellerId
) => {
    const product =
        await Product.create({
            ...productData,
            seller: sellerId,
        });

    return product;
};

// ==========================================
// GET ALL PRODUCTS
// ==========================================

export const getAllProductsService =
    async (query) => {
        const {
            search,
            category,
            minPrice,
            maxPrice,
            city,
            pincode,
            sort,
            page = 1,
            limit = 10,
        } = query;

        const pageNumber =
            Number(page);

        const limitNumber =
            Number(limit);

        const skip =
            (pageNumber - 1) *
            limitNumber;

        let sortOption = {
            createdAt: -1,
        };

        if (sort === "price_asc") {
            sortOption = {
                price: 1,
            };
        }

        if (sort === "price_desc") {
            sortOption = {
                price: -1,
            };
        }

        if (sort === "newest") {
            sortOption = {
                createdAt: -1,
            };
        }

        if (sort === "oldest") {
            sortOption = {
                createdAt: 1,
            };
        }

        const filter = {};

        if (search) {
            filter.productName = {
                $regex: search,
                $options: "i",
            };
        }

        if (category) {
            filter.category =
                category;
        }

        if (minPrice || maxPrice) {
            filter.price = {};

            if (minPrice) {
                filter.price.$gte =
                    Number(minPrice);
            }

            if (maxPrice) {
                filter.price.$lte =
                    Number(maxPrice);
            }
        }

        let products =
            await Product.find(filter)
                .populate(
                    "seller",
                    "shopName city state pincode"
                )
                .sort(sortOption)
                .skip(skip)
                .limit(limitNumber);

        if (city || pincode) {
            products =
                products.filter(
                    (prod) => {
                        if (
                            !prod.seller
                        ) {
                            return false;
                        }

                        let match =
                            true;

                        if (
                            city &&
                            prod.seller.city
                        ) {
                            match =
                                match &&
                                prod.seller.city
                                    .toLowerCase()
                                    .includes(
                                        city.toLowerCase()
                                    );
                        }

                        if (
                            pincode &&
                            prod.seller.pincode
                        ) {
                            match =
                                match &&
                                prod.seller.pincode.includes(
                                    pincode
                                );
                        }

                        return match;
                    }
                );
        }

        const totalProducts =
            await Product.countDocuments(
                filter
            );

        return {
            products,
            totalProducts,
            currentPage:
                pageNumber,
            totalPages: Math.ceil(
                totalProducts /
                    limitNumber
            ),
        };
    };

// ==========================================
// GET PRODUCT BY ID
// ==========================================

export const getProductByIdService =
    async (id) => {
        const product =
            await Product.findById(
                id
            ).populate(
                "seller",
                "shopName city state pincode"
            );

        if (!product) {
            throw new Error(
                "Product not found"
            );
        }

        return product;
    };

// ==========================================
// UPDATE PRODUCT
// ==========================================

export const updateProductService =
    async (
        productId,
        updateData,
        userId
    ) => {
        const product =
            await Product.findById(
                productId
            );

        if (!product) {
            throw new Error(
                "Product not found"
            );
        }

        if (
            product.seller.toString() !==
            userId.toString()
        ) {
            throw new Error(
                "Unauthorized"
            );
        }

        Object.assign(
            product,
            updateData
        );

        await product.save();

        return product;
    };

// ==========================================
// DELETE PRODUCT
// ==========================================

export const deleteProductService =
    async (
        productId,
        userId
    ) => {
        const product =
            await Product.findById(
                productId
            );

        if (!product) {
            throw new Error(
                "Product not found"
            );
        }

        if (
            product.seller.toString() !==
            userId.toString()
        ) {
            throw new Error(
                "Unauthorized"
            );
        }

        await Product.findByIdAndDelete(
            productId
        );

        return product;
    };