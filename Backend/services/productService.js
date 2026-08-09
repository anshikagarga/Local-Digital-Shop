import Product from "../models/Product.js";

export const addProductService = async (productData, sellerId) => {

    const product = await Product.create({
        ...productData,
        seller: sellerId,
    });

    return product;
};

export const getAllProductsService = async (query) => {

    const { search, category, minPrice, maxPrice, sort , page=1, limit=10} = query;
    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber -1) * limitNumber;

    let sortOption = {};
    if(sort === "price_Asc"){
        sortOption.price = 1;
    }
    if(sort === "price_Desc"){
        sortOption.price = -1;
    }

    const filter = {};

    // Search by product name
    if (search) {
        filter.productName = {
            $regex: search,
            $options: "i",
        };
    }

    // Filter by category
    if (category) {
        filter.category = category;
    }

    // Minimum price
    if (minPrice) {
        filter.price = {
            $gte: Number(minPrice),
        };
    }

    // Maximum price
    if (maxPrice) {
        filter.price = {
            ...filter.price,
            $lte: Number(maxPrice),
        };
    }

    const products = await Product.find(filter)
        .populate("seller", "name email")
        .sort(sortOption)
        .skip(skip)
        .limit(limitNumber);
    
    
    const totalProducts = await Product.countDocuments(filter);

    return { products, totalProducts, currentPage: pageNumber, totalPages: Math.ceil(totalProducts / limitNumber) };
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

    return;
}