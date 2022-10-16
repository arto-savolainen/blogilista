const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const blogSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  author: String,
  url: {
    type: String,
    required: true
  },
  likes: Number
 /*likes: {
    type: Number,
    validate: {
      validator: function (x) {
        if (!Number.isInteger(x)) {
          console.log('x:', x, '!x', !x)
          console.log('this:', this)
          this.likes = 0 //does not work, is it possible to set this value during validation?
        }

        return true
      }
    }
  }*/
})

blogSchema.plugin(uniqueValidator, { message: 'Error: {PATH} must be unique.' })

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)