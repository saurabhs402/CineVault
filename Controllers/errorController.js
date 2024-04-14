const { TokenExpiredError } = require("jsonwebtoken")
const customError = require("../Utils/customError")

function devError(res, err) {

    res.status(err.statusCode).json({
        success: err.status,
        message: err.message,
        stackTrace: err.stack,
        error: err
    })


}
function prodError(res, err) {
    if (err.isOperational) {
        res.status(err.statusCode).json({
            success: err.status,
            message: err.message
        })
    } else {
        // Generic response
        res.status(500).json({
            status: 'error',
            message: 'Something went wrong!! Please try again later'
        })
    }
}

const castErrorHandler = function (err) {
    const msg = `Invalid value  for field ${err.path} : ${err.value}`
    return new customError(msg, 400);
}
const duplicateKeyErrorHandler = function (err) {
    let msg='Duplicate record.Please change the duplicate fields.'
    if(err.keyValue.name)
     msg = `There is already a movie with name ${err.keyValue.name}.Please use another name !!`
    if(err.keyValue.email)
    msg = `There is already a user with email ${err.keyValue.email}.Please use another email !!`
    
    return new customError(msg, 400)
}
const validationErrorHandler = function (err) {
    const errors = Object.values(err.errors); // err.errors is an object
    const errorMessages = errors.map(function (value) { return value.message });
    const errorMessage = errorMessages.join('. ');

    const msg = `Invalid Input data : ${errorMessage}`;

    return new customError(msg, 404);


}
const tokenExpiredHandler = function (err) {
    const msg = 'JWT is expired please login again!.'
    return new customError(msg, 401);
}
const invalidSignatureHandler = function (err) {
    const msg = 'Invalid token . please login again!';
    return new customError(msg, 401);

}
function globalHandler(err, req, res, next) {
    err.statusCode = err.statusCode || 500;
    err.status = err.status || 'error'


    if (process.env.NODE_ENV == 'development') devError(res, err);
    else if (process.env.NODE_ENV == 'production') {
        let e = null

        console.log(err)

        //MongoDB error
        if (err.name === 'CastError') e = castErrorHandler(err)
        if (err.code === 11000) e = duplicateKeyErrorHandler(err)
        if (err.name === 'ValidationError') e = validationErrorHandler(err)
        //Ends

        //JWT error
        if (err.name === 'TokenExpiredError') e = tokenExpiredHandler(err)
        if (err.name === 'JsonWebTokenError') e = invalidSignatureHandler(err)
        //Ends  
        if (e)
            prodError(res, e)
        else prodError(res, err)
    }



}

module.exports = { globalHandler }