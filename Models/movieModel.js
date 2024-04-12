const mongoose = require('mongoose')
const fs = require('fs')
const validator = require('validator')

const movieSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Name field is required !!'],
        unique: true,
        trim: true,
        maxLength: [100, 'Movie name must not have more than 100 characters'],
        minLength: [4, 'Movie name must have atleast 4 characters'],
        // validate: [validator.isAlpha, 'Name should only contain alphabets']

    },
    description: {
        type: String,
        required: [true, 'Description field is required !!'],
        trim: true
    },
    duration: {
        type: Number,
        required: [true, 'Duration is the required field !!']
    },
    ratings: {
        type: Number,
        default: 5.0,
        min: [1, 'Ratings must be 1.0 or above'],
        max: [10, 'Ratings must be 10.0 or below']
    },
    totalRatings: Number, // how many users will rate this movie

    releaseYear: {
        type: Number,
        required: [true, 'Release Year is the required field !!']
    },
    releaseDate: Date,
    createdAt: {// When the document is created
        type: Date,
        default: new Date(),  // alternative Date.now() return timestamp in milliseconds and when it gets stores it will explicitly converted into Date type
        select: false
    },
    genres: {
        type: [String], // array of strings
        required: [true, 'Genres is the required field !!']
    },
    directors: {
        type: [String], // array of strings
        required: [true, 'Directors is the required field !!']
    },
    actors: {
        type: [String], // array of strings
        required: [true, 'Actors is the required field !!']
    },
    price: {
        type: Number, // array of strings
        required: [true, 'Price is the required field !!']
    },
    createdBy: String

}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})
movieSchema.virtual('durationInHours').get(function () {
    return this.duration / 60;
})

//Document middleware(pre and post hooks)
movieSchema.pre('save', function (next) {
    console.log(this)
    this.createdBy = 'Saurabh'
 
    next()
})

movieSchema.post('save', function (doc, next) {
    const content = `A new movie document with name ${doc.name} created by ${doc.createdBy}\n`;
    fs.writeFileSync('./Log/log.txt', content, { flag: 'a' }, function (err) {

        if (err) console.log(err.message)

    })

    next()
})

// Query Middleware

movieSchema.pre(/^find/, function (next) {
    this.find({ releaseDate: { $lte: new Date() } })
    this.startTime = Date.now();
    next();
})

movieSchema.post(/^find/, function (docs, next) {

    this.endTime = Date.now();

    const content = `Query took ${this.endTime - this.startTime} milliseconds to fetch the data\n`;
    fs.writeFileSync('./Log/log.txt', content, { flag: 'a' }, function (err) {

        if (err) console.log(err.message)

    })

    next();
})

// Aggregate Middleware
movieSchema.pre('aggregate', function (next) {
    this.pipeline().unshift({ $match: { releaseDate: { $lte: new Date() } } })
    next();
})



const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;