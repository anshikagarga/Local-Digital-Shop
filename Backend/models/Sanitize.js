export const formatPublicProduct = (
    product
) => {
    if (!product) {
        return null;
    }

    return {
        _id: product._id,

        productName:
            product.productName,

        description:
            product.description,

        category:
            product.category,

        price:
            product.price,

        stock:
            product.stock,

        image:
            product.image || "",

        seller:
            product.seller
                ? {
                      _id:
                          product
                              .seller
                              ._id,

                      shopName:
                          product
                              .seller
                              .shopName ||
                          "",

                      city:
                          product
                              .seller
                              .city ||
                          "",

                      state:
                          product
                              .seller
                              .state ||
                          "",

                      pincode:
                          product
                              .seller
                              .pincode ||
                          "",
                  }
                : null,

        createdAt:
            product.createdAt,

        updatedAt:
            product.updatedAt,
    };
};

export const formatPublicProducts = (
    products
) => {
    return products.map(
        formatPublicProduct
    );
};