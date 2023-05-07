const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.status(404).send({ message: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ message: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ message: error.message })
  }else if (error.name ===  'JsonWebTokenError') {
    return response.status(400).json({ message: error.message })
  } else if (error.name === 'TokenExpiredError') {
    return response.status(401).json({
      message: 'token expired'
    })
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}