const morgan = require('morgan')
const logger = require('./logger')
const config = require('./config')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

morgan.token('postData', (req) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return null
  }

  return JSON.stringify(req.body)
})

const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms :postData')

const tokenExtractor = (request, response, next) => {
  const authorization = request.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    request.token = authorization.substring(7)

    if (request.token) {
      request.decodedToken = jwt.verify(request.token, config.SECRET)
    }

  }

  next()
}

const userExtractor = async (request, response, next) => {
  if (request.decodedToken) {
    request.user = await User.findById(request.decodedToken.id)
  }

  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }
  else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  else if (error.name === 'JsonWebTokenError') {
    return response.status(401).json({
      error: 'invalid token'
    })
  }
  else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      error: 'token expired'
    })
  }

  logger.error(error.message)
  next(error)
}

module.exports = {
  requestLogger,
  tokenExtractor,
  userExtractor,
  unknownEndpoint,
  errorHandler
}