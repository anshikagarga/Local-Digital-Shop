import Product from "../models/Product.js";

export const addProductService = async (productData, sellerId) => {

    const product = await Product.create({
        ...productData,
        seller: sellerId,
    });

    return product;
};

export const getAllProductsService = async () => {
    const products = await Product.find()
     .populate("seller", "name email");

     return products;
}

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