import { addProductService, getAllProductsService, getProductByIdService, updateProductService, deleteProductService } from "../services/productService.js";

export const addProduct = async (req, res) => {

    try {

        const product = await addProductService(req.body, req.user._id);

        res.status(201).json({
            success: true,
            
            message: "Product added successfully",
            data: product,
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }

};
export const getAllProducts = async (req, res) => {

    try {

        const products = await getAllProductsService();

        res.status(200).json({
            success: true,
            count: products.length,
            data: products,
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    

    }

};

export const getProductById = async (req, res) => {
    try{
    const product = await getProductByIdService( req.params.id);

        res.status(200).json({
            success: true,
            data: product,
        });

    } catch (error) {

        res.status(404).json({
            success: false,
            message: error.message,
        });

    }

}

export const updateProduct = async (req, res) => {
    try {

        const product = await updateProductService(
            req.params.id,
            req.body,
            req.user._id
        );

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            data: product,
        });

    } catch (error) {

        res.status(400).json({
            success: false,
            message: error.message,
        });

    }
};


export const deleteProduct = async (req, res) => {
    try {
        await deleteProductService(
            req.params.id,
            req.user._id,
        );

        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
        });

    } catch (error) {
        
        res.status(400).json({
            success: false,
            message: error.message,
        });

    }
}