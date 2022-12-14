const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const config = require('../utils/config')

const USERNAME_LENGTH_ERROR = `username must be at least ${config.USERNAME_MIN_LENGTH} characters long.`

const userSchema = mongoose.Schema({
  blogs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog'
    }
  ],
  username: {
    type: String,
    required: [true, USERNAME_LENGTH_ERROR],
    minLength: [config.USERNAME_MIN_LENGTH, USERNAME_LENGTH_ERROR],
    unique: true,
    uniqueCaseInsensitive: true
  },
  name: String,
  passwordHash: {
    type: String,
    required: true
  }
})

userSchema.plugin(uniqueValidator, { message: '{PATH} must be unique.' })

userSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    //returnedObject.users = returnedObject.users.map(x => { x.toString() })
    delete returnedObject._id
    delete returnedObject.__v
    delete returnedObject.passwordHash
  }
})

const User = mongoose.model('User', userSchema)

module.exports = User