const mongoose = require('mongoose')

const blogSchema = mongoose.Schema({
  url: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  author: String,
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
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

blogSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})

module.exports = mongoose.model('Blog', blogSchema)