const logger = require('./logger')
const jwt = require('jsonwebtoken')
const User = require('../models/user')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const tokenExtractor = (req, res, next) => {
  const authorization = req.get('authorization')
  console.log(authorization)

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    try {
      req.decodedToken = jwt.verify(authorization.substring(7), process.env.SECRET)
      console.log('token without bearer',authorization.substring(7))

    } catch{
      return res.json({  code:404,
        status:false,
         message: 'token invalid' })
    }
  }  else {
    return res.json({  
      code:404,
      status:false,
       message: 'token missing' })
  }
  next()
}
const isAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.decodedToken.id)
  if (!user.admin) {
    return res.json({  
         code:404,
      status:false,
       message: 'operation not allowed' })
  }
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
  errorHandler,
  tokenExtractor
}