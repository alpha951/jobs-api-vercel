const jwt = require('jsonwebtoken');
const User = require('../models/User');

const { UnauthenticatedError } = require('../errors');

const authentication = async (req, res, next) => {

    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) throw new UnauthenticatedError('Authentication invalid');

    // If there is no space after Bearer, then it will throw an error since split will return an array of length 0


    /* `authHeader.split(' ')[1]` is splitting the `authHeader` string into an array of
    substrings using the space character as a separator, and then returning the second
    element of that array (index 1). This is assuming that the `authHeader` string is
    in the format "Bearer <token>", where `<token>` is the actual JWT token. By
    splitting the string and returning the second element, we are extracting the JWT
    token from the authorization header. */

    const token = authHeader.split(' ')[1];

    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);

        // another method to get user from database
        // const user = await User.findById(payload.id).select('-password'); // removing password from the response
        // req.user = user

        // adding user to the request object

        req.user = { userId: payload.id, name: payload.name };

        next()
    } catch (error) {
        throw new UnauthenticatedError('Authentication invalid');
    }

}

module.exports = authentication;