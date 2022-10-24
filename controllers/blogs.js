const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')
const config = require('../utils/config')

// //temp for testing
// const supertest = require('supertest')
// const helper = require('../tests/test_helper')
// const app = require('../app')
// const api = supertest(app)

const getTokenFrom = request => {
  const authorization = request.get('authorization')

  if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
    return authorization.substring(7)
  }

  return null
}

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

  const token = getTokenFrom(request)
  let decodedToken
 
  if (token) {
    decodedToken = jwt.verify(token, config.SECRET)
  }

  if (!token || !decodedToken.id) {
    return response.status(401).json({ error: 'token missing or invalid' })
  }

  const user = await User.findById(decodedToken.id)
  const blog = new Blog(newBlog)
  blog.user = user._id
  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()

  response.status(201).json(savedBlog.toJSON())
})

blogsRouter.delete('/:id', async (request, response) => {
  const result = await Blog.findByIdAndDelete(request.params.id)

  if (result) {
    response.json(result.toJSON())
  }
  else {
    response.status(404).end()
  }
})

blogsRouter.put('/:id', async (request, response) => {
  const updateData = request.body

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