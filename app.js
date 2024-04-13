const express = require('express')
const morgan = require('morgan')
const rateLimit = require('express-rate-limit')
const helmet = require('helmet')
const sanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

const moviesRouter = require('./Routes/movieRoutes')
const customError = require('./Utils/customError')
const errorController = require('./Controllers/errorController')
const authRouter = require('./Routes/authRouter')
const userRouter = require('./Routes/userRouter')
const homeRouter=require('./Routes/homeRouter')


const app = express();

app.use(helmet())

let limitter = rateLimit({
    //Specifying how many requests in a given period of time
    max: 1000,
    windowMs: 60 * 60 * 1000,
    message: 'We have receive too many requests from this IP.Please try after one hour.'
});


app.use('/api', limitter)

// adding middleware which binds body to the req object
app.use(express.json({ limit: '10kb' })) // also for DoS

app.use(sanitize());
app.use(xss());
app.use(hpp({
    whitelist: ['duration', 'rating',
        'releaseYear', 'releaseDate',
        'genres', 'directors',
        'actors', 'price'
    ]
}))



// using morgan middleware
// only log in development environment
if (process.env.NODE_ENV === 'development') app.use(morgan('dev'))


//Serving Static files
app.use(express.static('./public'))

// adding custom middleware
const logger = function (req, res, next) {
    console.log("Custom middleware called")
    next();
}
app.use(logger)



app.use(function (req, res, next) {
    // similar way middleware add body property to req object
    req.requestedAt = new Date();
    next();

})
//
app.use('',homeRouter);

// Middleware for handling or mounting routes
app.use('/api/v1/movies/', moviesRouter)
// auth Routes
app.use('/api/v1/auth/', authRouter)

//Users Routes
app.use('/api/v1/users/', userRouter)

//Default Route--execute for all request methods always come at last
app.all('*', function (req, res, next) {
    // res.status(404).json({
    //     status: 'Fail',
    //     message: `Can't find ${req.originalUrl} url on the server`
    // })
    // const err = new Error(`Can't find ${req.originalUrl} url on the server`);
    // err.statusCode = 404;
    // err.status = 'Fail'
    console.log('all routes\n\n')

    const err = new customError(`Can't find ${req.originalUrl} url on the server`, 404);

    console.log(err)
    next(err)
})


// global error handling middleware

app.use(errorController.globalHandler)

module.exports = app



