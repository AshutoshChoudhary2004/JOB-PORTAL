import jwt from "jsonwebtoken";
import {User} from "../models/userSchema.js";
import  ErrorHandler from "./errors.js";
export const isAuthenticated = async (req, res, next) => {
    const token = req.cookies.token;
    if (!token) {
        return next(new ErrorHandler("Please login to access this resource", 401)); 
    }
    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.user = await User.findById(decoded.id);
        next();
    } catch(error){
        return next(new ErrorHandler("Json web token is invalid, please try again", 401));  
    }
};

export const isAuthorized = (...roles) => {
    return (req, res, next) => {
        if (!roles.includes(req.user.role)){
            return next(new ErrorHandler(`${req.user.role} not allowed to access this resource.`, 403));
        }
        next();
    }
}