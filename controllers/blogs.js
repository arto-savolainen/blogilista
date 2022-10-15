const blogsRouter = require('express').Router()
const Blog =  require('../models/blog')

blogsRouter.get('/', async (request, response) => {
    const blogs = await Blog.find({})
    response.json(blogs)

  /*Blog
    .find({})
    .then(blogs => {
      response.json(blogs)
    })*/
})

blogsRouter.post('/', async (request, response) => {
  const blog = new Blog(request.body)
  const result = await blog.save()
  response.status(201).json(result)
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