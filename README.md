# Route / Endpoint Documentation

## Authorization Middleware
Endpoints protected by the `tokenAuthenticator` middleware require a valid JWT. This middleware extracts the identity payload into a new "user" field, which contains the username and id of the user, on authenticatedRequest objects and passes an object with this type over to authenticated/protected endpoints. Endpoints/routes can acess the user data via "req.user" for verification. 

## Auth 

### `POST /api/auth/register`
*   **Description:** Adds a new user to the user table.
*   **Request Body:** `{ "username": "...", "password": "..." }`

### `POST /api/auth/login`
*   **Description:** Authenticates a user and returns a JWT token if credentials are valid.
*   **Request Body:** `{ "username": "...", "password": "..." }`

## Todo Items (CRUD)

### `GET /api/todoItems`
*   **Description:** Fetches all todo items. Can be filtered using optional query parameters.
*   **Allowed Query Parameters:** `name`, `ownerId`, `ownerUsername`, `category`, `isCompleted`.
*   **API Design Notes:**
    *   **Strict Validation:** Passing an unrecognized parameter (e.g., `?caterrgory=`) will return a `400 Bad Request` rather than defaulting to fetching all items.
    *   **Exact Matching:** The `name` filter requires an exact match. 
    *   **Null Categories:** Passing `"none"` to the `category` parameter will filter for items that do not have an assigned category.

### `POST /api/todoItems`
*   **Description:** Creates a new todo item in the database.
*   **Request Body:** `{ "name": "...", "description": "..." }` *(description is optional)*

### `PATCH /api/todoItems/:id`
*   **Description:** Updates an existing todo item. **Must be the owner** of the todo item to perform this action.
*   **Request Body:** Expects at least one of the following fields: `{ "name": "...", "description": "...", "category": "...", "isCompleted": "..." }`.

### `DELETE /api/todoItems/:id`
*   **Description:** Deletes a todo item from the database. **Must be the owner** of the todo item to perform this action.


### Side Note
    I know I didn't have to actually run a db, but I wanted to learn prisma anyways, because you guys mentioned you use it and I have used a similar ORM in Springboot. So I chose to run prisma on top of sqlite.
