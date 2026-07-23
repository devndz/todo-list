# Route/endpoint Documentation
Any endpoint which has the tokenAuthenticator middleware attached will get a user field with user info in it's custom request type, under the "user" field. This data is used to verify if the user has permision to run the requested endpoint.

## Auth 
### POST /api/auth/register
    adds a new user to the user table 
    expects user/frontend to pass in {username, password} as the request body

### POST /api/auth/login
    returns a JWT token if username and password are valid
    expects user/frontend to pass in {username, password} as the request body

## CRUD todoItem
### GET /api/todoItems
    Fetches all todoItems in db

### POST /api/todoItems
    Create a new todoItem in the db
    reuqires user/frontend to pass in {name, (and optionally) description} as the request body

### DELETE /api/todoItems/:id
    Deletes a todoItem in the db if the request is made by the owner of the todoItem

### UPDATE /api/todoItems/:id
    Updates a todoItem in the db if the request is made by the owner of the todoItem



### Side Note
    I know I didn't have to actually run a db, but I wanted to learn prisma anyways, because you guys mentioned you use it and I have used a similar ORM in Springboot. So I chose to run prisma on top of sqlite.
