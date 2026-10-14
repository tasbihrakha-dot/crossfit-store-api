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

1. Clone the Repository

git clone https://github.com/tasbihrakha-dot/crossfit-store-api.git
cd crossfit-store-api

2. Install Dependencies

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

4. Configure Environment Variables

Create a ".env" file in the project root.

Add:

JWT_SECRET=your_private_jwt_secret

Replace the example value with a private secret of your own.

The application uses "JWT_SECRET" to sign and verify authentication tokens.

Do not upload ".env" files or private secrets to a public GitHub repository.

5. Start the Server

node server.js

The API runs at:

"http://localhost:5000"

Make sure the database connection succeeds before testing the endpoints.

API Endpoints

Authentication Routes

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

Tokens issued by the registration and login routes expire after one hour.

Role-Based Authorization

The API uses role-based authorization to restrict access to certain operations.

- Product listing and viewing a single product require a valid JWT token and the "user" or "admin" role.
- Creating, updating, and deleting products require a valid JWT token and the "admin" role.
- New users registered through the public registration route receive the "user" role by default.
- Requests without a valid token may return "401 Unauthorized".
- Requests from authenticated users without sufficient permissions may return "403 Forbidden".

Postman Examples

Use the following base URL:

"http://localhost:5000"

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

Expected results:

- "201 Created" when registration succeeds. The response contains a success message, a JWT token, and the user's "id", "name", "email", and "role".
- "400 Bad Request" if required fields are missing or the password is shorter than 8 characters.
- "409 Conflict" if the email address is already registered.

2. Log In

Request

POST /auth/login
Content-Type: application/json

Example body

{
  "email": "test@example.com",
  "password": "ExamplePassword123"
}

Expected results:

- "200 OK" when login succeeds. The response contains a success message, a JWT token, and the user's "id", "name", "email", and "role".
- "400 Bad Request" if the email or password is missing.
- "401 Unauthorized" if the email or password is incorrect.

Use the returned token for protected requests.

3. Get Products

Request

GET /products

Include a valid Bearer token for a user with the "user" or "admin" role.

Expected result: "200 OK" with a JSON array containing the available products.

The returned array depends on the products stored in the database.

4. Get a Product by ID

Request

GET /products/1

Replace "1" with the target product ID.

Include a valid Bearer token for a user with the "user" or "admin" role.

Expected results:

- "200 OK" if the product exists.
- "400 Bad Request" if the product ID is invalid.
- "404 Not Found" if the product does not exist.

5. Create a Product

Request

POST /products
Content-Type: application/json

Example body

{
  "name": "Training Dumbbell",
  "price": 500,
  "description": "Dumbbell for strength training",
  "quantity": 10,
  "category": "Equipment"
}

The "name" and "price" fields are required. The "description", "quantity", and "category" fields are optional in the product creation route. If "quantity" is omitted, it defaults to "0".

Include a valid Bearer token for an account with the "admin" role.

Expected results:

- "201 Created" when the product is created successfully. The response contains a success message and the saved product.
- "400 Bad Request" if the name or price is invalid, or if the quantity is not a non-negative integer.
- "401 Unauthorized" if authentication is missing or invalid.
- "403 Forbidden" if the user does not have the required role.

6. Update a Product

Request

PUT /products/1
Content-Type: application/json

Replace "1" with the target product ID.

Example body

{
  "name": "Updated Training Dumbbell",
  "price": 550,
  "quantity": 15
}

Include a valid Bearer token for an account with the "admin" role.

Expected results:

- "200 OK" when the product is updated successfully. The response contains a success message and the updated product.
- "400 Bad Request" if the ID or provided field values are invalid.
- "404 Not Found" if the product does not exist.
- "401 Unauthorized" if authentication is missing or invalid.
- "403 Forbidden" if the user does not have the required role.

7. Delete a Product

Request

DELETE /products/1

Replace "1" with the target product ID.

Include a valid Bearer token for an account with the "admin" role.

Expected results:

- "200 OK" when deletion succeeds. The response contains a success message.
- "400 Bad Request" if the product ID is invalid.
- "404 Not Found" if the product does not exist.
- "401 Unauthorized" if authentication is missing or invalid.
- "403 Forbidden" if the user does not have the required role.

HTTP Status Codes

Status Code| Meaning
"200"| OK
"201"| Created
"400"| Bad Request
"401"| Unauthorized
"403"| Forbidden
"404"| Not Found
"409"| Conflict
"500"| Internal Server Error

The status codes returned by individual routes depend on the request and the route implementation. Unexpected server errors are passed to the centralized error handler.

Error Handling

The API includes centralized error handling for request failures and unexpected server errors.

Clients should check the HTTP status code and response message to understand why a request failed.

Database Notes

The project uses TypeORM to connect to PostgreSQL.

The current configuration uses:

synchronize: true

This allows TypeORM to synchronize the configured entities with the database schema.

For production environments, use a controlled migration strategy instead.

Security Notes

- Never publish database passwords or JWT secrets.
- Keep ".env" out of version control.
- Use strong passwords.
- Protect routes that require authentication and authorization.
- Avoid exposing sensitive error details in production.

Author

Developed as a backend API project to practice REST API development, authentication, authorization, database integration, and error handling.
