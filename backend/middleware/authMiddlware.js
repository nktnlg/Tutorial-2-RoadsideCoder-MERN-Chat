const jwt = require('jsonwebtoken');
const User = require("../Models/UserModel");
const asyncHandler = require("express-async-handler");

const protect = asyncHandler(
    async (req, res, next) => {
        let token
        if(
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer")
        ) {
            try {
                token = req.headers.authorization.split(" ")[1];
                //decode token id
                const decoded = jwt.verify(token, process.env.JWT_SECRET);
                //помещаем в запрос переменную user, в которой будут свойства пользователя кроме пароля
                req.user = await User.findById(decoded.id).select("-password");
                next();
            } catch (error){
                res.status(401);
                throw new Error(`Not authorized, token failed: ${error.message}` )
            }
        }

        if (!token) {
            res.status(401);
            throw new Error("Not authorized, no token");
        }
    }
);

module.exports = {protect}