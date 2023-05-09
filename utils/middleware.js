const logger = require('./logger')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const unknownEndpoint = (request, response) => {
  response.json({
    code:404,
    status:false,
     message: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)

  if (error.name === 'CastError') {
    return response.json({code:400,status:false, message: 'malformatted id' })
  } else if (error.name === 'ValidationError') {
    return response.json({code:401, status:false, message: error.message })
  }else if (error.name ===  'JsonWebTokenError') {
    return response.json({code:400,status:false, message: error.message })
  } else if (error.name === 'TokenExpiredError') {
    return response.json({code:401,status:false,message: 'token expired'})
  }

  next(error)
}

module.exports = {
  requestLogger,
  unknownEndpoint,
  errorHandler
}