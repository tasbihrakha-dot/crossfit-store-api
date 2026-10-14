CrossFit Store API

A RESTful API for managing CrossFit store products and users, built with Node.js, Express.js, TypeORM, and PostgreSQL.

Features

- User registration and login
- Password hashing using bcrypt
- JWT authentication
- Role-based authorization ("user" and "admin")
- Product listing, retrieval, creation, updating, and deletion
- Input validation
- Centralized error handling
- PostgreSQL database integration using TypeORM

Technologies

- Node.js
- Express.js
- PostgreSQL
- TypeORM
- JSON Web Tokens (JWT)
- bcrypt
- dotenv

Project Structure

crossfit-store-api/
├── entities/
│   ├── product.js
│   └── user.js
├── middleware/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── role.middleware.js
├── .env
├── .gitignore
├── authRoutes.js
├── db.js
├── productsRoutes.js
├── server.js
└── userRoutes.js

Requirements

- Node.js and npm
- PostgreSQL
- Postman (for testing the API)

Installation and Setup

1. Clone the repository

git clone https://github.com/tasbih.../crossfit-store-api.git
cd crossfit-store-api

Replace the clone URL above with the repository's exact GitHub URL if needed.

2. Install dependencies

npm install

3. Configure environment variables

Create a ".env" file in the project root:

JWT_SECRET=your_private_jwt_secret

Use a strong, private value for "JWT_SECRET". Do not commit your real ".env" file to GitHub.

4. Configure PostgreSQL

Check "db.js" and make sure the PostgreSQL connection settings match your local database. The current configuration uses:

- Host: "127.0.0.1"
- Port: "5432"
- Username: "postgres"
- Database: "crossfit-store"

Make sure the database exists and PostgreSQL is running.

5. Start the server

node server.js

The API runs at:

http://localhost:5000

When the database connection succeeds, the server logs a success message and starts listening on port "5000".

API Endpoints

General

Method| Endpoint| Description| Authentication
GET| "/"| Welcome message| Not required
GET| "/protected"| Test JWT authentication| Required

Authentication

Method| Endpoint| Description| Authentication
POST| "/auth/register"| Register a new user| Not required
POST| "/auth/login"| Log in an existing user| Not required

Users

Method| Endpoint| Description| Authentication
GET| "/user/me"| Get the authenticated user's profile| Required
GET| "/user/dashboard"| Access the regular user's dashboard| Required; "user" role only

Products

Method| Endpoint| Description| Authentication
GET| "/products"| Get all products| "user" or "admin"
GET| "/products/:id"| Get a product by ID| "user" or "admin"
POST| "/products"| Create a product| "admin" only
PUT| "/products/:id"| Update a product| "admin" only
DELETE| "/products/:id"| Delete a product| "admin" only

Authentication and Authorization

The API uses JSON Web Tokens (JWT) for authentication.

After successful registration or login, the API returns a token that expires after one hour.

For protected routes, send the token in the HTTP request header:

Authorization: Bearer YOUR_TOKEN

Roles

- "user": Can view products, view their own profile, and access the user dashboard.
- "admin": Can view products and create, update, or delete products.
- The "/user/dashboard" route specifically allows the "user" role only.

Newly registered accounts are assigned the "user" role by the registration route.

Testing with Postman

Set the request body format to Body → raw → JSON for the examples below.

1. Register a user

Request

POST http://localhost:5000/auth/register
Content-Type: application/json

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "ExamplePassword123"
}

Expected success: "201 Created"

The response contains a success message, a JWT token, and the user's "id", "name", "email", and "role".

Possible error responses:

- "400 Bad Request": Required fields are missing or the password has fewer than 8 characters.
- "409 Conflict": The email is already registered.

2. Log in

Request

POST http://localhost:5000/auth/login
Content-Type: application/json

{
  "email": "test@example.com",
  "password": "ExamplePassword123"
}

Expected success: "200 OK"

The response contains a success message, a JWT token, and the user's public information.

Possible errors:

- "400 Bad Request": Email or password is missing or invalid in format.
- "401 Unauthorized": The email or password is incorrect.

3. Test the protected route

Request

GET http://localhost:5000/protected
Authorization: Bearer YOUR_TOKEN

Expected success: "200 OK".

Possible error: "401 Unauthorized" if the token is missing, invalid, or expired.

4. Get the current user's profile

Request

GET http://localhost:5000/user/me
Authorization: Bearer YOUR_TOKEN

Expected success: "200 OK".

The response includes the user's "id", "name", "email", and "role".

Possible errors:

- "401 Unauthorized": The token is missing, invalid, or expired.
- "404 Not Found": The user does not exist.

5. Access the user dashboard

Request

GET http://localhost:5000/user/dashboard
Authorization: Bearer YOUR_TOKEN

Expected success for a "user" role: "200 OK".

A user with a different role receives "403 Forbidden".

6. Get all products

Request

GET http://localhost:5000/products
Authorization: Bearer YOUR_TOKEN

Expected success: "200 OK", returning an array of products.

Both "user" and "admin" roles are allowed.

7. Get a product by ID

Request

GET http://localhost:5000/products/1
Authorization: Bearer YOUR_TOKEN

Possible responses:

- "200 OK": Product found.
- "400 Bad Request": Invalid product ID.
- "404 Not Found": Product does not exist.
- "401 Unauthorized": Missing, invalid, or expired token.

8. Create a product

Request

POST http://localhost:5000/products
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

{
  "name": "Dumbbell",
  "description": "Adjustable dumbbell for strength training",
  "price": 1200,
  "quantity": 10,
  "category": "Strength Equipment"
}

Expected success: "201 Created".

The response contains a success message and the saved product.

Validation rules:

- "name" must be a non-empty string.
- "price" is required and must be a valid non-negative number.
- "quantity", if provided, must be a non-negative integer.
- If "quantity" is omitted, it defaults to "0".

Possible errors include "400 Bad Request", "401 Unauthorized", and "403 Forbidden".

9. Update a product

Request

PUT http://localhost:5000/products/1
Authorization: Bearer ADMIN_TOKEN
Content-Type: application/json

Example body:

{
  "name": "Updated Dumbbell",
  "price": 1350,
  "quantity": 8
}

Expected success: "200 OK", returning a success message and the updated product.

Possible errors include "400 Bad Request", "401 Unauthorized", "403 Forbidden", and "404 Not Found".

10. Delete a product

Request

DELETE http://localhost:5000/products/1
Authorization: Bearer ADMIN_TOKEN

Expected success: "200 OK", returning a success message.

Possible errors include "400 Bad Request", "401 Unauthorized", "403 Forbidden", and "404 Not Found".

HTTP Status Codes

Status| Meaning
"200 OK"| Request completed successfully
"201 Created"| Resource created successfully
"400 Bad Request"| Invalid input or request
"401 Unauthorized"| Authentication is missing or invalid
"403 Forbidden"| Authenticated user lacks permission
"404 Not Found"| Requested resource or route was not found
"409 Conflict"| Email is already registered
"500 Internal Server Error"| Unexpected server error

Error Handling

The API uses centralized error handling for errors passed to the error middleware.

General error responses have this structure:

{
  "success": false,
  "message": "Internal server error"
}

When an error has a specific "statusCode", the middleware uses that status code. If no status code is provided, it defaults to "500".

Some authentication, authorization, validation, and not-found responses are returned directly by their route handlers or middleware and may use a different JSON response structure.

Security Notes

- Passwords are hashed with bcrypt before being stored.
- Passwords are not included in registration or login responses.
- JWTs are signed using "JWT_SECRET".
- Protected endpoints require a valid token.
- Administrative product operations require the "admin" role.
- Keep ".env" private and never commit secrets to version control.

Database Notes

TypeORM is used to interact with PostgreSQL. Check "db.js" and the entity files if you need to adjust the database configuration or model definitions.

If TypeORM schema synchronization is enabled in the current configuration, use it carefully outside development environments.

Author

Tasbih Rakha
