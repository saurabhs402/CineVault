// app.get('/', function (req, res) {

//     // res.status(200).send("<h1> Hello World </h1>"); // default text/html
//     res.status(200).json([
//         {
//             "message": "Hello-World",
//             "Status": 200
//         },
//         {
//             "message": "Hello-Universe",
//             "Status": 200

//         }
//     ]
//     ); // here can pass json as well as js object


// })

/** Method-1  */

// GET - api/v1/movies
app.get('/api/v1/movies', getAllMovies);

// GET - api/v1/movies/:id -- colon specify route parameter
app.get('/api/v1/movies/:id/:name?/:x?', getMovie);

// POST - api/v1/movies
app.post('/api/v1/movies', createMovie);

// PATCH - api/v1/movies
app.patch('/api/v1/movies/:id', updateMovie);

// DELETE - api/v1/movies
app.delete('/api/v1/movies/:id', deleteMovie);



/** Method-2 Merge using common routes as one using route method */


app.route('/api/v1/movies/')
    .get(getAllMovies)
    .post(createMovie)

app.route('/api/v1/movies/:id')
    .get(getMovie)
    .patch(updateMovie)
    .delete(deleteMovie)


/** Method-3
 * Use Middleware to create diff. routes for diff. resources and 
 * take out common route and pass when applying middleware using use method
*/



const moviesRouter = express.Router();

// Mounting routes in express
app.use('/api/v1/movies/', moviesRouter)



moviesRouter.route('/')
    .get(getAllMovies)
    .post(createMovie)
moviesRouter.route('/:id')
    .get(getMovie)
    .patch(updateMovie)
    .delete(deleteMovie)

// Make document using model

// const testMovie = new Movie({
//     name: "Insidious",
//     description: "A horror thriller",
//     duration: 110,
//     rating: 5
// })


// testMovie.save().then(function (doc) {
//     console.log(doc)
// }).catch(function (err) {
//     console.log(err.message)
// })

// Handlers fetching data from json file now we try to fetch from database

// convert JSON to js object
let movies = JSON.parse(fs.readFileSync('./Data/movies.json', 'utf-8'));

const getAllMovies = (req, res) => {

    res.status(200).json(
        {
            status: "success",
            requestedAt: req.requestedAt,
            count: movies.length,
            data: {
                movies: movies
            }
        }
    );

}
const getMovie = function (req, res) {
    console.log(req.params + " Controller");
    let id = Number(req.params.id);


    let movie = movies.find(function (value) {
        return value.id === id;
    })

    // if (!movie){
    //     return res.status(404).json({
    //         status: "Fail",
    //         message: `Movie with that id=${id} not exist`

    //     }
    //     )
    // }


    res.status(200).json({
        status: "success",
        data: {
            movie: movie
        }

    }
    )

}


const createMovie = function (req, res) {
    // MongoDB automatically handles id it but here we are dealing with json file so we 
    // need to do this manually
    let newId = movies[movies.length - 1].id + 1;
    let newMovie = Object.assign({ id: newId }, req.body);

    movies.push(newMovie);

    // fs.writeFileSync('./Data/movie.json',movies);
    //-- to avoid blocking rules we can't place sync or blocking code inside callback which is executed by eventLoop

    fs.writeFile('./Data/movies.json', JSON.stringify(movies), function (err) {
        // err="error"
        if (!err) {
            console.log('New movie added');
            res.status(201).send(
                {
                    status: "success",
                    data: {
                        movie: newMovie
                    }

                }
            );
        }
        else {
            console.log(err);
            res.status(400).send(
                {
                    status: "error",
                    data: {
                        movie: {}
                    }

                }
            )
        }
    });


    // console.log(req.body)

}

const updateMovie = function (req, res) {

    let id = Number(req.params.id);
    let x = 12;
    let movieToUpdate = movies.find(function (value, index) {
        if (value.id === id) x = index;
        return value.id === id;
    })

    // if (!movieToUpdate) {
    //     return res.status(404).json(
    //         {
    //             status: "Fail",
    //             message: `No movie with id ${id} is found`
    //         }

    //     )

    // }
    // let releaseYear = req.body.releaseYear;
    // movieToUpdate.releaseYear = releaseYear;--work only for release year
    Object.assign(movieToUpdate, req.body);

    let index = movies.indexOf(movieToUpdate);

    movies[index] = movieToUpdate
    console.log(x); //working because of lexical scope and closure( it can even after scope dies of parent)

    fs.writeFile('./Data/movies.json', JSON.stringify(movies), function (err) {

        res.status(200).json(
            {
                status: "success",
                data: {
                    movie: movieToUpdate
                }
            }

        )

    })

}

const deleteMovie = function (req, res) {

    let id = Number(req.params.id);
    let ind = -1;
    let movieToDelete = movies.find(function (value, index) {

        if (value.id === id) {
            ind = index
            return true
        }
    })

    if (movieToDelete) {
        movies.splice(ind, 1);

        fs.writeFile('./Data/movies.json', JSON.stringify(movies), function (err) {
            res.status(204).json(
                {
                    status: "success",
                    data: {
                        movie: null
                    }
                }

            )
        })

    } else {
        res.status(404).json(
            {
                status: "Fail",
                message: `movie wit id=${id} not found`
            }

        )


    }
}

const checkId = function (req, res, next, value) {
    let movie = movies.find(function (ele) {
        return ele.id === Number(value);
    })

    if (!movie) {
        return res.status(404).json({
            status: "Fail",
            message: `Movie with that id=${value} not exist`

        }
        )
    }

    next();


}

// Done by Schema

const validateBody = function (req, res, next) {
    if (!req.body.name || !req.body.releaseYear) {
        return res.status(400).json({
            status: "Fail",
            message: "Not a valid movie data"

        })
    }
    next()
}

async function advanceFeatures(){
    //Filtering
    //Excluding Query 
    const excludeFields = ['sort', 'page', 'limit', 'fields']

    let filterObj = { ...req.query }

    excludeFields.forEach(function (ele) {
        delete filterObj[ele];
    })
    //Ends

    //Advance Filtering--gte,gt,lt,lte

    let querystr = JSON.stringify(filterObj);
    querystr = querystr.replace(/\b(gte|gt|lte|lt)\b/g, function (match) {
        return `$${match}`
    })

    filterObj = JSON.parse(querystr)

    //Ends


    //Bringing Data

    let queryMong = Movie.find(filterObj);

    //Ends

    //Ends



    // Sorting Logic

    if (req.query.sort) {
        let sortQuery = "" + req.query.sort;
        sortQuery = sortQuery.replaceAll(',', ' ')
        queryMong = queryMong.sort(sortQuery);
    } else {
        //default sorting w.r.t createdAt
        queryMong=queryMong.sort('-createdAt')
    }
    //Ends



    // Limiting Fields
    if (req.query.fields) {
        let fieldsQuery = "" + req.query.fields;
        fieldsQuery = fieldsQuery.replaceAll(',', ' ');
        console.log(fieldsQuery)
        queryMong = queryMong.select(fieldsQuery);
    } else {
        queryMong = queryMong.select('-__v');
    }
    //Ends

    // Pagination
    const pageQuery = Number(req.query.page) || 1;
    const limitQuery = Number(req.query.limit) || 10;

    //Page 1: 1-10(0 skip),Page 2:11-20 (10 skip)
    const skipCount = (pageQuery - 1) * limitQuery
    if (req.query.page) {
        const moviesCount = await Movie.countDocuments();
        if (skipCount >= moviesCount)
            throw new Error("This page is not found")

    }
    queryMong=queryMong.skip(skipCount).limit(limitQuery);
    //Ends

    const movies = await queryMong;
}