CrossFit Store API

A RESTful API for managing a CrossFit store, built with Node.js, Express, TypeORM, and PostgreSQL.

Features

- User registration and login
- Password hashing using bcrypt
- JWT authentication
- Role-based authorization
- Product CRUD operations
- Request validation
- Centralized error handling
- PostgreSQL database integration

Technologies Used

- Node.js
- Express.js
- TypeORM
- PostgreSQL
- JSON Web Tokens (JWT)
- bcrypt

Project Structure

crossfit-store-api/
├── entities/
│   ├── user.js
│   └── product.js
├── middleware/
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── role.middleware.js
├── authRoutes.js
├── userRoutes.js
├── productsRoutes.js
├── db.js
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md

Requirements

Before running the project, install:

- Node.js and npm
- PostgreSQL
- Postman (for API testing)

Installation and Setup

1. Clone the repository

git clone https://github.com/tasbihrakha-dot/crossfit-store-api.git
cd crossfit-store-api

2. Install dependencies

npm install

3. Configure PostgreSQL

Create a PostgreSQL database named:

crossfit-store

The current database configuration is defined directly in "db.js".

The application uses the following settings:

- Database type: PostgreSQL
- Host: "127.0.0.1"
- Port: "5432"
- Username: "postgres"
- Database name: "crossfit-store"

Make sure PostgreSQL is running and that the connection credentials in "db.js" match your local setup.

Important: The current version does not read database connection settings from ".env".

4. Configure environment variables

Create a ".env" file in the project root.

Add:

JWT_SECRET=your_private_jwt_secret

Replace the example with a private secret of your own.

The application uses "JWT_SECRET" to sign and verify authentication tokens.

Do not upload ".env" files or private secrets to a public GitHub repository.

5. Start the server

node server.js

The API runs at:

http://localhost:5000

Make sure the database connection succeeds before testing the endpoints.

API Endpoints

Authentication

Method| Endpoint| Description
POST| "/auth/register"| Register a new user
POST| "/auth/login"| Log in and receive a JWT token

User Routes

Method| Endpoint| Description
GET| "/user/me"| Get the authenticated user's information
GET| "/user/dashboard"| Access the user dashboard

Product Routes

Method| Endpoint| Description
GET| "/products"| Get the product list
GET| "/products/:id"| Get a product by ID
POST| "/products"| Create a product
PUT| "/products/:id"| Update a product
DELETE| "/products/:id"| Delete a product

Other Routes

Method| Endpoint| Description
GET| "/protected"| Access a protected endpoint

Authentication

Protected routes require a valid JWT token.

After logging in, copy the token from the response.

In Postman:

1. Open the request.
2. Select the Authorization tab.
3. Choose Bearer Token.
4. Paste the token into the token field.

The server verifies the token before allowing access to protected routes.

Role-Based Authorization

The API uses role-based authorization to restrict access to certain operations.

- Authenticated users can access routes permitted to their role.
- Product creation, updating, and deletion require the authorized role configured in the application.
- Requests without sufficient permissions return "403 Forbidden".

Postman Examples

Use the following base URL:

http://localhost:5000

1. Register a User

Request

POST /auth/register
Content-Type: application/json

Example body

{
  "name": "Test User",
  "email": "test@example.com",
  "password": "ExamplePassword123"
}

Use a new email address when registering.

Expected result: A successful response confirming registration. The exact response body depends on the implementation.

2. Log In

Request

POST /auth/login
Content-Type: application/json

Example body

{
  "email": "test@example.com",
  "password": "ExamplePassword123"
}

Expected result: A successful response containing a JWT token if the credentials are valid.

Use the returned token for protected requests.

3. Get Products

Request

GET /products

Expected result: "200 OK" with a JSON response containing the available products.

The exact JSON structure depends on the route implementation and database contents.

4. Get a Product by ID

Request

GET /products/1

Replace "1" with an existing product ID.

Expected results:

- "200 OK" if the product exists.
- "404 Not Found" if the product does not exist.

5. Create a Product

Request

POST /products
Content-Type: application/json

Example body

{
  "name": "Training Dumbbell",
  "price": 500,
  "description": "Dumbbell for strength training"
}

This body is an example only. Check "entities/product.js" and "productsRoutes.js" for the exact fields required by the current implementation.

Include a valid Bearer token for an account with the required role.

Expected results:

- A success response if the request is valid and authorized.
- "400 Bad Request" if required fields are missing or invalid.
- "401 Unauthorized" if authentication is missing or invalid.
- "403 Forbidden" if the user does not have the required role.

6. Update a Product

Request

PUT /products/1
Content-Type: application/json

Provide the fields required by the route in the JSON body, and include a valid Bearer token with the required permissions.

Expected result: A success response if the product exists and the request is valid and authorized.

7. Delete a Product

Request

DELETE /products/1

Replace "1" with the target product ID.

Include a valid Bearer token with the required permissions.

Expected result: A success response if deletion succeeds.

HTTP Status Codes

Status Code| Meaning
200| OK
201| Created, when returned by the route
400| Bad Request
401| Unauthorized
403| Forbidden
404| Not Found
500| Internal Server Error

The exact status code and response body depend on the individual route implementation.

Error Handling

The API includes centralized error handling for request failures and unexpected server errors.

Clients should check the HTTP status code and response message to understand why a request failed.

Database Notes

The project uses TypeORM to connect to PostgreSQL.

The current configuration uses:

synchronize: true

This allows TypeORM to synchronize the configured entities with the database schema. For production environments, use a controlled migration strategy instead.

Security Notes

- Never publish database passwords or JWT secrets.
- Keep ".env" out of version control.
- Use strong passwords.
- Protect routes that require authentication and authorization.
- Avoid exposing sensitive error details in production.

Author

Developed as a backend API project to practice REST API development, authentication, authorization, database integration, and error handling.
