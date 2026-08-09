import {addToWishlistService} from "../services/wishlistService.js";

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
