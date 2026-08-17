import {
    addToWishlistService,
    getWishlistService,
    removeFromWishlistService
} from "../services/wishlistService.js";
import { formatPublicProduct } from "../utils/sanitize.js";

const formatWishlistResponse = (wishlist) => {
    if (!wishlist) {
        return { products: [] };
    }

    const products = Array.isArray(wishlist.products)
        ? wishlist.products.map((product) => formatPublicProduct(product))
        : [];

    return {
        ...wishlist.toObject?.() ?? wishlist,
        products,
    };
};

export const addToWishlist = async(req,res) => {
    try{
        const wishlist = await addToWishlistService(req.params.productId, req.user._id);
        res.status(201).json({
            success: true,
            message: "Product added to wishlist",
            data: formatWishlistResponse(wishlist),
        });
    }catch(error){
        res.status(400).json({
            success: false,
            message: error.message,
        })
    }
};

export const getWishlist = async (req, res) => {

    try {

        const wishlist = await getWishlistService(
            req.user._id
        );

        res.status(200).json({
            success: true,
            data: formatWishlistResponse(wishlist),
        });

    } catch (error) {

        res.status(500).json({
            success: false,
            message: error.message,
        });

    }
};

export const removeFromWishlist = async (req, res) => {
    try{
        const wishlist = await removeFromWishlistService(req.params.productId, req.user._id);
        res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
            data: formatWishlistResponse(wishlist),
        });
    }catch(error){
        res.status(400).json({
            success: false,
            message: error.message,
        });
    }
}