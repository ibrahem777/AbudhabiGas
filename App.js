const config = require('./utils/config')
const express = require('express')
require('express-async-errors')
const app = express()
const usersRouter = require('./controllers/user')
const productRouter = require('./controllers/product')
const orderRouter = require('./controllers/order')
const settingRouter = require('./controllers/setting')
const middleware = require('./utils/middleware')
const logger = require('./utils/logger')
const mongoose = require('mongoose')

mongoose.set('strictQuery', false)

logger.info('connecting to', config.MONGODB_URI)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected to MongoDB')
  })
  .catch((error) => {
    logger.error('error connecting to MongoDB:', error.message)
  })

app.use(express.json())
app.use(middleware.requestLogger)

app.use('/api/users', usersRouter)
app.use('/api/products', productRouter)
app.use('/api/orders', orderRouter)
app.use('/api/settings', settingRouter)
app.use('/images', express.static('uploads'));


// if (process.env.NODE_ENV === 'test') {
//   const testingRouter = require('./controllers/testing')
//   app.use('/api/testing', testingRouter)
// }
app.use(middleware.unknownEndpoint)
app.use(middleware.errorHandler)

module.exports = app