import { addProductService } from "../services/productService.js";

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