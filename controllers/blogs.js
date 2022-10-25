const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
//const jwt = require('jsonwebtoken') not needed if middleware sets token and decodedToken

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { blogs: 0 })
  response.json(blogs)

})

blogsRouter.post('/', async (request, response) => {
  const newBlog = request.body

  //technically this is not needed since validators will fail and error handling will return code 400
  if (!newBlog.title || !newBlog.url) {
    return response.status(400).end()
  }

  //Is it possible to do this during db validation?
  if (!newBlog.likes) {
    newBlog.likes = 0
  }
 
  if (!request.token || !request.decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = request.user
  const blog = new Blog(newBlog)

  blog.user = user._id
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {

  if (!request.token || !request.decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  if (blog.user.toString() === request.user._id.toString()) {
    blog.delete()
    return response.json(blog.toJSON())
  }

  response.status(401).json({ error: 'not authorized' })
})

blogsRouter.put('/:id', async (request, response) => {
  const updateData = request.body

  //why do i have this here? delete after put testing 
  if (!updateData.likes) {
    updateData.likes = 0
  }

  const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,
    updateData,
    { new: true, runValidators: true, context: 'query' })

  if (updatedBlog) {
    response.status(200).json(updatedBlog.toJSON())
  }
  else {
    response.status(404).end()
  }
})

module.exports = blogsRouter