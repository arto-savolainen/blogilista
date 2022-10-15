const blogsRouter = require('express').Router()
const Blog =  require('../models/blog')

blogsRouter.get('/', async (request, response, next) => {
  try {
    const blogs = await Blog.find({})
    response.json(blogs)
  }
  catch(exception) {
    next(exception)
  }
 
  /*Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })*/
})

blogsRouter.post('/', (request, response) => {
  const blog = new Blog(request.body)

  blog
    .save()
    .then(result => {
      response.status(201).json(result)
    })
})

//tehtävä 4.13
/*blogsRouter.delete('/', (request, response, next) => {
  Blog.findByIdAndDelete(request.params.id)
    .then(result => {
      if (result) {
        response.json(result)
      }
      else {
        response.status(404).end()
      }
    })
    .catch(error => next(error))
})*/

module.exports = blogsRouter