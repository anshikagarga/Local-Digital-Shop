import Product from "../models/Product.js";

export const addProductService = async (productData, sellerId) => {

    const product = await Product.create({
        ...productData,
        seller: sellerId,
    });

    return product;
};