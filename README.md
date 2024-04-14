# Cinema Vault

API provides a secure and user-friendly experience by implementing JWT-based user authentication with robust password encryption, as well as features like password reset and email verification to enhance security and usability.

For efficient data management, the API offers RESTful endpoints covering all CRUD operations for movie details.

To ensure smooth operation and easy debugging, comprehensive error handling mechanisms are in place, utilizing try-catch blocks, error middleware, and informative error messages with appropriate HTTP status codes.

## Deployed Link
https://cinema-vault.up.railway.app/

```bash
pip install foobar
```

# Endpoints
 ## Auth  ( https://cinema-vault.up.railway.app/api/v1/auth )
### Routes
#### Sign Up User
    POST(/signup)

    Example
    --------

    Request
    
    {
        "name": "func",
        "email": "func@gmail.com",
        "password":"test1234",
        "confirmPassword":"test1234"
     }

    Response

    {

    "status": "success",
    "token": "<Secret-token-Only-that-specific-User-will know>",
    "data": {
        "user": {
            "name": "func",
            "email": "func@gmail.com",
            "role": "user",
            "active": true,
            "_id": "66111d80c3f98cf54bef59e7",
            "__v": 0
        }
    }
}

       
#### Login Up User
    POST(/login)
    Example
    --------

    Request
    
    {
    "email":"func@gmail.com",
    "password":"test12345"
    } 

    Response

    {
    "status": "success",
    "token": "<Secret-token-Only-that-specific-User-will know>",
    "data": {
        "user": {
            "_id": "66111d80c3f98cf54bef59e7",
            "name": "func",
            "email": "func@gmail.com",
            "role": "user",
            "__v": 0
        }
    }
}
#### Forgot Password of the Current User
    POST(/forgotPassword)
    Example
    --------

    Request

    {
    "email":"func@gmail.com"
    }

    Response

    {
    "success": "success",
    "message": "Password reset link send to the user email."
    }

#### Reset password using password reset token sent to the mail

    PATCH(/resetPassword/:token)
    Example
    --------
    Request
    {
    "password":"pass1234",
    "confirmPassword":"pass1234"
    }

    Response

    {
    "status": "success",
    "token": "<Secret-token-Only-that-specific-User-will know>",
    "data": {
        "user": {
            "_id": "66111d80c3f98cf54bef59e7",
            "name": "func",
            "email": "func@gmail.com",
            "role": "user",
            "__v": 0,
            "passwordResetToken": "<Used-to-Check-If-Token-Expires>"
        }
      }
    }


## User  ( https://cinema-vault.up.railway.app/api/v1/user )
### Routes
#### Get All Users
    GET(/getAllUsers)
    Request
    {}

    Response
    {
    "success": "success",
    "length": <total-count-user>,
    "data": {
        "users": [
            {
                "role": "user",
                "_id": "<user-id>",
                "name": "<user-name>",
                "email": "<user-email>",
                "__v": 0
            },
             .....
             .....
         ]
       }
    }

#### Update Password of Currently logged in User
    PATCH(/updatePassword)
    Example
    --------

    Request

    {
    "currentPassword":"test1234",
    "password":"test12345",
    "confirmPassword":"test12345"
    }

    Response

    {
    "status": "success",
    "token": "<Secret-token-Only-that-specific-User-will know>",
    "data": {
        "user": {
            "_id": "661bca66428610f822c7dd40",
            "name": "func",
            "email": "func@gmail.com",
            "role": "user",
            "__v": 0
        }
    }
}
#### Update Currently logged in User( this route won't update password)
    PATCH(/updateMe)
    Example
    --------
    Request

    {
    "name":"function"
    }

    Response

    {
    "status": "success",
    "data": {
        "updatedUser": {
            "_id": "661bcdafe295d7406fe032a2",
            "name": "function",
            "email": "func@gmail.com",
            "role": "user",
            "__v": 0
        }
    }
}
#### Delete Currently logged in User
    DEL (/deleteMe)
    Example
    --------

    Request

    {}

    Response

    {}
    

## Movie  ( https://cinema-vault.up.railway.app/api/v1/movies )
### Routes
#### Get All Movies
    GET(/)
    Example
    --------

    Request

    {}

    Response
    {
    "status": "success",
    "length": <total-movie-count>,
    "data": {
        "movies": [
            {
                "_id": "6606687054044c6aca965a17",
                "name": "We're the Millers",
                "description": "A veteran pot dealer creates a fake family as part of his plan to move a huge shipment of weed into the U.S. from Mexico.",
                "duration": 110,
                "ratings": 7.2,
                "releaseYear": 2013,
                "releaseDate": "2013-08-03T00:00:00.000Z",
                "genres": [
                    "Comedy",
                    "Crime"
                ],
                "directors": [
                    "Rawson Marshall Thurber"
                ],
                "actors": [
                    "Jason Sudeikis",
                    "Jennifer Aniston",
                    "Emma Roberts"
                ],
                "price": 47,
                "durationInHours": 1.8333333333333333,
                "id": "6606687054044c6aca965a17"
            },
           ......
           ......
           
        ]
      }
    }
#### Create Movie
    POST(/)
    Example
    --------

    Request

     {
                
                "name": "TestMovie",
                "description": "Eight years on, a new evil rises from where the Batman and Commissioner Gordon tried to bury it, causing the Batman to resurface and fight to protect Gotham City... the very city which brands him an enemy.",
                "duration":90,
                "ratings": 8.6,
                "releaseYear": 2023,
                "releaseDate": "2023-07-16T00:00:00.000Z",
                "genres": [
                    "Action",
                    "Crime",
                    "Thriller"
                ],
                "directors": [
                    "Christopher Nolan"
                ],
                "actors": [
                    "Christian Bale",
                    "Tom Hardy",
                    "Anne Hathaway"
                ],
                "price": 57,
                "durationInHours": 2.75,
                "id": "6606687054044c6aca965a1d"
    }

    Response

    {
    "status": "success",
    "data": {
        "movie": {
            "name": "TestMovie",
            "description": "Eight years on, a new evil rises from where the Batman and Commissioner Gordon tried to bury it, causing the Batman to resurface and fight to protect Gotham City... the very city which brands him an enemy.",
            "duration": 90,
            "ratings": 8.6,
            "releaseYear": 2023,
            "releaseDate": "2023-07-16T00:00:00.000Z",
            "createdAt": "2024-04-14T12:46:48.763Z",
            "genres": [
                "Action",
                "Crime",
                "Thriller"
            ],
            "directors": [
                "Christopher Nolan"
            ],
            "actors": [
                "Christian Bale",
                "Tom Hardy",
                "Anne Hathaway"
            ],
            "price": 57,
            "_id": "661bd1ed0843ba73d1c23dd7",
            "createdBy": "Saurabh",
            "__v": 0,
            "durationInHours": 1.5,
            "id": "661bd1ed0843ba73d1c23dd7"
        }
      }
    }
#### Get Movie by Id
    GET(/:id) 
    Example
    --------

    Request

    {}

    Response

    {
    "status": "success",
    "data": {
        "movie": {
            "_id": "661bd1ed0843ba73d1c23dd7",
            "name": "TestMovie",
            "description": "Eight years on, a new evil rises from where the Batman and Commissioner Gordon tried to bury it, causing the Batman to resurface and fight to protect Gotham City... the very city which brands him an enemy.",
            "duration": 90,
            "ratings": 8.6,
            "releaseYear": 2023,
            "releaseDate": "2023-07-16T00:00:00.000Z",
            "genres": [
                "Action",
                "Crime",
                "Thriller"
            ],
            "directors": [
                "Christopher Nolan"
            ],
            "actors": [
                "Christian Bale",
                "Tom Hardy",
                "Anne Hathaway"
            ],
            "price": 57,
            "createdBy": "Saurabh",
            "__v": 0,
            "durationInHours": 1.5,
            "id": "661bd1ed0843ba73d1c23dd7"
        }
      }
    }
#### Update Movie by Id
    PATCH(/:id)
    Example
    --------

    Request
    {
    "name":"TestMovieUpdate"
    }
    Response

    {
    "status": "success",
    "data": {
        "movie": {
            "_id": "661bd1ed0843ba73d1c23dd7",
            "name": "TestMovieUpdate",
            "description": "Eight years on, a new evil rises from where the Batman and Commissioner Gordon tried to bury it, causing the Batman to resurface and fight to protect Gotham City... the very city which brands him an enemy.",
            "duration": 90,
            "ratings": 8.6,
            "releaseYear": 2023,
            "releaseDate": "2023-07-16T00:00:00.000Z",
            "genres": [
                "Action",
                "Crime",
                "Thriller"
            ],
            "directors": [
                "Christopher Nolan"
            ],
            "actors": [
                "Christian Bale",
                "Tom Hardy",
                "Anne Hathaway"
            ],
            "price": 57,
            "createdBy": "Saurabh",
            "__v": 0,
            "durationInHours": 1.5,
            "id": "661bd1ed0843ba73d1c23dd7"
        }
      }
    }
#### Delete Movie by Id
    DEL(/:id)
    Example
    --------

    Request

    {}

    Response

    {}
   



## Contributing

Pull requests are welcome. For major changes, please open an issue first
to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License

[MIT](https://choosealicense.com/licenses/mit/)
