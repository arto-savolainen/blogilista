const morgan = require('morgan')
const logger = require('./logger')

morgan.token('postData', (req) => {
  if (!req.body || Object.keys(req.body).length === 0) {
    return null
  }

  return JSON.stringify(req.body)
})

const requestLogger = morgan(':method :url :status :res[content-length] - :response-time ms :postData')

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

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}