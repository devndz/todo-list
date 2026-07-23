I know I didn't have to actually run a db, but I wanted to learn prisma anyways, cuz you guys mentioned you use it and I have used similar ORMs in Springboot. So I chose to run prisma on top of sqlite.

Route Documentation
Any endpoint which has the tokenAuthenticator middleware attached will get a user field with user info in it's custom request type, under the "user" field.

/api/todoItems
    - Fetches all todoItems in db

/auth/register
    - expects user/frontend to pass in {username, password} as the request body
