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