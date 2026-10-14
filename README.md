CrossFit Store API

A RESTful API for managing a CrossFit store, built with Node.js, Express, TypeORM, and PostgreSQL.

Features

- User registration and login.
- Password hashing using bcrypt.
- JWT authentication.
- Role-based authorization for users and admins.
- Product management (CRUD operations).
- Request validation.
- Centralized error handling.
- PostgreSQL database integration.

Technologies Used

- Node.js
- Express.js
- PostgreSQL
- TypeORM
- JSON Web Tokens (JWT)
- bcrypt

Installation

1. Clone the repository:
   
   git clone https://github.com/tasbihrakha-dot/crossfit-store-api.git

2. Open the project folder:
   
   cd crossfit-store-api

3. Install dependencies:
   
   npm install

4. Create a ".env" file in the project root and configure the required environment variables.
   
   Do not upload your ".env" file or share your database password or JWT secret.

5. Start the server:
   
   node server.js

The API runs on port "5000".

Main Routes

Method| Endpoint| Description
POST| "/auth/register"| Register a new user
POST| "/auth/login"| Log in
GET| "/user/me"| Get the current user's information
GET| "/user/dashboard"| Access the user dashboard
GET| "/products"| Get products
GET| "/products/:id"| Get a product by ID
POST| "/products"| Create a product
PUT| "/products/:id"| Update a product
DELETE| "/products/:id"| Delete a product
GET| "/protected"| Test JWT authentication

Protected routes require a valid JWT. Product creation, updating, and deletion require admin permissions.

Error Handling

The API uses centralized error handling and returns appropriate HTTP status codes, including "400", "401", "403", "404", and "500".

Author

Developed as a backend API project for a CrossFit store.