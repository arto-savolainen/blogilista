require('dotenv').config()

let PORT = process.env.PORT
let MONGODB_URI = process.env.NODE_ENV === 'test'
  ? process.env.TEST_MONGODB_URI
  : process.env.MONGODB_URI

let USERNAME_MIN_LENGTH = 3
let PASSWORD_MIN_LENGTH = 3

module.exports = {
  MONGODB_URI,
  PORT,
  USERNAME_MIN_LENGTH,
  PASSWORD_MIN_LENGTH
}