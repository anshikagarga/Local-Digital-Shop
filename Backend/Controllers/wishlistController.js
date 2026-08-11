import {
    addToWishlistService,
    getWishlistService,
    removeFromWishlistService
} from "../services/wishlistService.js";

export const addToWishlist = async(req,res) => {
    try{
        const wishlist = await addToWishlistService(req.params.productId, req.user._id);
        res.status(201).json({
            success: true,
            message: "Product added to wishlist",
            data: wishlist,
        });
    }catch(error){
        res.status(201).json({
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
            data: wishlist,
        });

    } catch (error) {

        res.status(404).json({
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
            data: wishlist,
        });
    }catch(error){
        res.status(404).json({
            success: false,
            message: error.message,
        });
    }
}