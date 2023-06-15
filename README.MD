# Jobs API

This is a RESTful API for managing job listings. It allows users to register, login, and perform CRUD (Create, Read, Update, Delete) operations on job resources.

# Setup

To set up the project, follow these steps:

```bash
npm install && npm start
```

## Database Connection

1. Import `connect.js` module.
2. Invoke the `start()` function to establish the database connection.
3. Create a `.env` file in the root directory.
4. Add a `MONGO_URI` variable to the `.env` file with the correct MongoDB connection string.

## Routers

- `auth.js`: Contains routes for user registration and login.
- `jobs.js`: Contains routes for CRUD operations on job resources.

## User Model

The user model includes a validation regex for email addresses:

```regex
/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
```

## Register User

- Validates the name, email, and password using Mongoose.
- Hashes the password using bcryptjs.
- Saves the user to the database.
- Generates a token.
- Sends a response with the token.

## Login User

- Validates the email and password in the controller.
- Throws a BadRequestError if the email or password is missing.
- Finds the user in the database.
- Compares the passwords.
- Throws an UnauthenticatedError if no user is found or the password does not match.
- If the email and password are correct, generates a token.
- Sends a response with the token.

## Mongoose Errors

The API handles the following types of Mongoose errors:

- Validation errors: Occur when the data does not meet the defined schema requirements.
- Duplicate errors (Email): Occur when an email is already registered in the database.
- Cast errors: Occur when there is a mismatch in the data type expected by the schema.

## Security

The API implements the following security measures:

- helmet: Adds various HTTP headers to enhance security.
- cors: Handles Cross-Origin Resource Sharing to control access from different domains.
- xss-clean: Sanitizes user input to prevent cross-site scripting (XSS) attacks.
- express-rate-limit: Implements rate limiting to prevent brute-force and DDoS attacks.

## Swagger UI

The API documentation includes the following endpoint:

```yaml
/jobs/{id}:
  parameters:
    - in: path
      name: id
      schema:
        type: string
      required: true
      description: The job ID.
```

You can use Swagger UI to explore and test the API endpoints in a user-friendly interface.
