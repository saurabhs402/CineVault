

// This is not the middleware

const asyncErrorHandler = function (asyncFunc) {

    return function(req,res,next){
        asyncFunc(req,res,next).catch(function(err){
            next(err);
        })
    }

}

module.exports=asyncErrorHandler;