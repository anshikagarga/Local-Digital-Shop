const {registerUser} = require("../services/authService");

const register = async(req,res) => {
    try{
        const result = await registerUser(req.body);
        res.status(201).json(result);
    }catch(error){
        res.status(500).json({
            message: error.message
        });
    }
};

module.exports = {register};