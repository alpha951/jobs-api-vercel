const User = require('../models/User');

const { StatusCodes } = require('http-status-codes');
const { BadRequestError, UnauthenticatedError } = require('../errors');

const jwt = require('jsonwebtoken');

const register = async (req, res) => {
    const user = await User.create(req.body);

    if (!user) throw new BadRequestError('Invalid body')

    res.status(StatusCodes.CREATED).json({ msg: 'User created', user: user.name, body: user.createJWT() });
}


const login = async (req, res) => {

    const { email, password } = req.body;

    if (!email || !password) throw new BadRequestError('Please provide email and password')

    /*
        I missed the await keyword here, so it was not waiting for the promise to resolve and was throwing empty error
    */

    const user = await User.findOne({ email });

    if (!user) throw new UnauthenticatedError('Invalid credentials, User email not found')

    const isPasswordCorrect = await user.comparePasswords(password);

    if (!isPasswordCorrect) throw new UnauthenticatedError('Invalid credentials, Password is incorrect')

    const token = user.createJWT();

    res.status(StatusCodes.OK).json({ user: { name: user.name }, token });
}

module.exports = { register, login } 