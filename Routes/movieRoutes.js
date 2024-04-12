const express = require('express')

const moviesController = require('../Controllers/moviesController')
const authController = require('../Controllers/authController')


/** 
 * Use Middleware to create diff. routes for diff. resources and 
 * take out common route and pass when applying middleware using use method
*/



const router = express.Router();

// router.param('id', moviesController.checkId)--MongoDB takes care by itself


router.route('/highest-rated')
    .get(moviesController.getHighestRated, moviesController.getAllMovies);


router.route('/movie-stats').get(moviesController.getMovieStats)

router.route('/movie-by-genre/:genre').get(moviesController.getMovieByGenre)


router.route('/')
    .get(authController.protect, moviesController.getAllMovies)
    .post(authController.protect, moviesController.createMovie)
//chaining of middleware
router.route('/:id')
    .get(moviesController.getMovie)
    .patch(moviesController.updateMovie)
    .delete(authController.protect, authController.restrict('admin'), moviesController.deleteMovie)
// calling of function because it is wrapper and it return a function--closure property implemented

module.exports = router;