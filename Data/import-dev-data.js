const mongoose = require('mongoose')
const dotenv = require('dotenv')
const fs = require('fs')
const Movie = require('../Models/movieModel')
dotenv.config({ path: './.env' })


//Connecting to MongoDB
mongoose.connect(process.env.CONN_STR, {
    useNewUrlParser: true
}).then(function (conn) {
    // conn is a connection object
    //console.log(conn)
    console.log("DB connection successful")
}).catch(function (err) {
    console.log(err.message);
})
//Ends

const movies = JSON.parse(fs.readFileSync('./Data/movies.json', 'utf-8'));

const deleteMovies = async function () {
    try {
        await Movie.deleteMany();
        console.log('Data successfully deleted !!')
    } catch (err) {
        console.log(err.message)
    }
    process.exit()

}

const importMovies = async function () {

    try {
       await Movie.insertMany(movies);
        console.log('Data successfully imported !!')
    } catch (err) {
        console.log(err.message)
    }
    process.exit()

}

if (process.argv[2] === '--import') {
    importMovies();
} else if (process.argv[2] === '--delete') {
    deleteMovies();
}
