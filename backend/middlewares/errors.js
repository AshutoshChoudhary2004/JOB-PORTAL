export default class ErrorHandler extends Error{
    constructor(message, statusCode){
        super(message);
        this.statusCode = statusCode;
    }
};

export const errorMiddleware = (err, req, res, next) => {
    console.log(`printing error ${err}`);
    err.statusCode = err.statusCode || 500;
    err.message = err.message || "Internal server error has occurred";
    if (err.name === "CastError"){
        const message = `Invalid ${err.path}`;
        console.log("we got an invalid id error:", message);
        err = new ErrorHandler(message, 400);
    }
    if (err.code === 11000){
        const message = `Duplicate ${Object.keys(err.path)} entered`;
        err = new ErrorHandler(message, 400);
    }
    if (err.name === "JsonWebTokenError"){
        const message = "Json web token is invalid, please try again";
        err = new ErrorHandler(message, 400);
    } 
    if (err.name == "TokenExpiredError"){
        const message = "Json web token is expired please try again";
        err = new ErrorHandler(message, 400);
    }
    return res.status(err.statusCode).json({
        success: false,
        message : err.message,
    });
};
