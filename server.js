const mongoose = require('mongoose')
const dotenv = require('dotenv')
dotenv.config({ path: './.env' })

process.on('uncaughtException', function (err) {
    console.log(err)
    console.log('\n\n\n\n')
    console.log((err.name + "- " + err.message));

    console.log('Uncaught Exception occured!! Shutting Down...')


    process.exit(1);


})

const app = require('./app')

console.log(app.get('env'))
//console.log(process.env)

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






// here we are not creating diff. app using express 
//if we do so app.js and server.js are not remain connected

// create+listen to the server
const port = process.env.PORT || 3001;
const server = app.listen(port, function () {
    console.log('Server has started')
})

/**Below error handler's are backup for the unknown event */
process.on('unhandledRejection', function (err) {
    console.log((err.name + "- " + err.message));

    console.log('Unhandled Rejection occured!! Shutting Down...')

    server.close(function () {
        process.exit(1);

    })
})

