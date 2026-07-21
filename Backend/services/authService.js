const registerUser = async(userData) => {
    return{
        success: true,
        message: "Register API working successfully",
        data: userData

    };
        

    
};

module.exports = {registerUser};