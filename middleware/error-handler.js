const { CustomAPIError } = require('../errors')
const { StatusCodes } = require('http-status-codes')

const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || 'Something went wrong, please try again later'
  }


  // Mongoose duplicate key
  if (err.code === 11000) {
    customError.msg = `Duplicate value entered for : ${Object.keys(err.keyValue)}`
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    customError.msg = Object.values(err.errors).map((item) => item.message).join(',')
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    customError.msg = `No resource found with id : ${err.value}`
    customError.statusCode = StatusCodes.NOT_FOUND
  }


  return res.status(customError.statusCode).json({ msg: customError.msg })

}

module.exports = errorHandlerMiddleware
