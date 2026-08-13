import Product from "../models/Product.js";

export const addProductService = async (productData, sellerId) => {

    const product = await Product.create({
        ...productData,
        seller: sellerId,
    });

    return product;
};

export const getAllProductsService = async (query) => {

    const {
        search,
        category,
        minPrice,
        maxPrice,
        sort,
        page = 1,
        limit = 10,
    } = query;

    const pageNumber = Number(page);
    const limitNumber = Number(limit);

    const skip = (pageNumber - 1) * limitNumber;

    // Sorting
    let sortOption = {
        createdAt: -1,
    };

    if (sort === "price_asc") {
        sortOption = { price: 1 };
    }

    if (sort === "price_desc") {
        sortOption = { price: -1 };
    }

    if (sort === "newest") {
        sortOption = { createdAt: -1 };
    }

    if (sort === "oldest") {
        sortOption = { createdAt: 1 };
    }

    // Filter
    const filter = {};

    // Search
    if (search) {
        filter.productName = {
            $regex: search,
            $options: "i",
        };
    }

    // Category
    if (category) {
        filter.category = category;
    }

    // Price
    if (minPrice || maxPrice) {

        filter.price = {};

        if (minPrice) {
            filter.price.$gte = Number(minPrice);
        }

        if (maxPrice) {
            filter.price.$lte = Number(maxPrice);
        }
    }

    // Get products
    const products = await Product.find(filter)
        .populate("seller", "name email")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber);

    // Count
    const totalProducts =
        await Product.countDocuments(filter);

    return {
        products,
        totalProducts,
        currentPage: pageNumber,
        totalPages: Math.ceil(
            totalProducts / limitNumber
        ),
    };
};

export const getProductByIdService = async (id) => {
    const product = await Product.findById(id).populate("seller", "name email");
    if(!product){
        throw new Error("Product not found");
    }
    return product;
}


export const updateProductService = async (
    productId,
    updateData,
    userId
) => {

    const product = await Product.findById(productId);

    if (!product) {
        throw new Error("Product not found");
    }

    if (product.seller.toString() !== userId.toString()) {
        throw new Error("Unauthorized");
    }

    Object.assign(product, updateData);

    await product.save();

    return product;
};


export const deleteProductService = async(productId, userId) => {
    const product = await Product.findById(productId);
    if(!product){
        throw new Error("Product not found");
    }

    if(product.seller.toString() != userId.toString()){
        throw new Error("unauthorized");
    }

    await Product.findByIdAndDelete(productId);

    return product;
}

