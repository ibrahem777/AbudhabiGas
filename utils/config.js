require('dotenv').config()

const PORT = process.env.PORT
const MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI
  const URL = process.env.NODE_ENV === 'development'
  ? process.env.TEST_UPLOAD_URL 
  : process.env.UPLOAD_URL

module.exports = {
  MONGODB_URI,
  PORT,
  URL,
  DATABASE_URL: process.env.DATABASE_URL
}