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
  let newBlog = request.body

  //technically this is not needed since validators will fail and error handling will return code 400
  if (!newBlog.title || !newBlog.url) {
    return response.status(400).end()
  }

  //Is it possible to do this during db validation?
  if (!newBlog.likes) {
    newBlog.likes = 0
  }

  const blog = new Blog(newBlog)
  const result = await blog.save()
  response.status(201).json(result)
})

blogsRouter.delete('/:id', async (request, response) => {
  const result = await Blog.findByIdAndDelete(request.params.id)

  if (result) {
    return response.json(result)
  }
  else {
    return response.status(404).end()
  }
})

module.exports = blogsRouter