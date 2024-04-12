// const fs = require('fs')--not required
const Movie = require('../Models/movieModel')
const ApiFeatures = require('../Utils/ApiFeatures')
const asyncErrorHandler = require('../Utils/asyncErrorHandler');
const customError = require('../Utils/customError');



const createMovie = asyncErrorHandler(async function (req, res, next) {
    // req.body is json but at backend it gets converted to BSON

    // const newMovie = new Movie(req.body)
    // const doc = await newMovie.save();

    // Since model is an interface so we can use method to create documents

    const doc = await Movie.create(req.body);


    res.status(201).json({
        status: "success",
        data: {
            "movie": doc
        }
    })

})

const getAllMovies = asyncErrorHandler(async (req, res, next) => {

    console.log(req.query)

    const features = new ApiFeatures(Movie.find(), req.query)
        .filter()
        .sort()
        .limitFields()
        .paginate();

    const movies = await features.queryMong;

    console.log(typeof (movies));



    res.status(200).json({
        status: 'success',
        length: movies.length,
        data: {
            movies: movies
        }


    })

})
// Aliasing Route
const getHighestRated = function (req, res, next) {
    req.query.sort = '-ratings';
    req.query.limit = '5';
    next()
};
// Ends

const getMovie = asyncErrorHandler(async function (req, res, next) {

    const movie = await Movie.findOne({ _id: req.params.id });
    console.log(movie)

    if (!movie)
        throw new customError(`Movie not Found with id ${req.params.id}`, 404)


    res.status(200).json({
        status: 'success',
        data: {
            movie
        }
    })

})



const updateMovie = asyncErrorHandler(async function (req, res, next) {

    const updatedMovie = await Movie.findOneAndUpdate({ _id: req.params.id }, { $set: req.body })
    if (!updatedMovie)
        throw new customError(`Movie not Found with id ${req.params.id}`, 404)

    res.status(200).json({
        status: 'success',
        data: {
            movie: updatedMovie
        }
    })


})

const deleteMovie = asyncErrorHandler(async function (req, res, next) {

    const deletedMovie = await Movie.deleteOne({ _id: req.params.id })
    if (!deletedMovie)
        throw new customError(`Movie not Found with id ${req.params.id}`, 404)


    res.status(204).json({
        status: 'success',
        data: {
            movie: null
        }
    })

})
const getMovieStats = asyncErrorHandler(async function (req, res, next) {

    const stats = await Movie.aggregate([
        { $match: { ratings: { $gte: 4.5 } } },
        {
            $group: {
                _id: '$releaseYear',
                avgRating: { $avg: '$rating' },
                avgPrice: { $avg: '$price' },
                minPrice: { $min: '$price' },
                maxPrice: { $max: '$price' },
                priceTotal: { $sum: '$price' },
                movieCount: { $count: {} }
            }
        },
        { $sort: { minPrice: 1 } },
        // { $match: { maxPrice: { $gte: 60 } } }

    ])
    res.status(200).json({
        status: 'success',
        length: stats.length,
        data: {
            stats
        }
    })

})

const getMovieByGenre = asyncErrorHandler(async function (req, res, next) {


    const genre = req.params.genre;

    const movies = await Movie.aggregate([
        { $unwind: '$genres' },
        {
            $group: {
                _id: '$genres',
                moviesCount: { $count: {} },
                movies: { $push: '$name' }
            }
        },
        { $addFields: { genre: '$_id' } },
        {
            $project: {
                _id: 0
            }
        },
        { $match: { genre: genre } }
    ])


    res.status(200).json({
        status: 'success',
        length: movies.length,
        data: {
            movies
        }
    })

})



module.exports = {
    getAllMovies, getMovie, createMovie,
    updateMovie, deleteMovie, getHighestRated,
    getMovieStats, getMovieByGenre
};
// // alternative--wrong way
// exports.validateBody