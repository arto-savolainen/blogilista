const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
//const jwt = require('jsonwebtoken') not needed if middleware sets token and decodedToken

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { blogs: 0 })
  response.json(blogs)

})

const tokenValid = (request) => {
  if (!request.token || !request.decodedToken.id) {
    return false
  }

  return true
}

const invalidTokenResponse = (response) => {
  return response.status(401).json({ error: 'token missing or invalid' })
}

const userMatches = (request, blog) => {
  if (request.user._id.toString() === blog.user.toString()) {
    return true
  }

  return false
}

const userMatchError = (response) => {
  return response.status(401).json({ error: 'not authorized' })
}

blogsRouter.post('/', async (request, response) => {
  const newBlog = request.body

  //Is it possible to do this during db validation?
  if (!newBlog.likes) {
    newBlog.likes = 0
  }
 
  if (!tokenValid(request)) {
    return invalidTokenResponse(response)
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

  if (!tokenValid(request)) {
    return invalidTokenResponse(response)
  }

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  if (!userMatches(request, blog)) {
    return userMatchError(response)
  }

  blog.delete()
  return response.json(blog.toJSON())
})

blogsRouter.put('/:id', async (request, response) => {
  if (!tokenValid(request)) {
    return invalidTokenResponse(response)
  }

  const blog = await Blog.findById(request.params.id)

  if (!blog) {
    return response.status(404).end()
  }

  if (!userMatches(request, blog)) {
    return userMatchError(response)
  }

  const updateData = request.body

  //why do i have this here? delete after put testing?
  if (!updateData.likes) {
    updateData.likes = 0
  }

  blog.url = updateData.url
  blog.title = updateData.title
  blog.author = updateData.author
  blog.likes = updateData.likes
  await blog.save()

  return response.status(200).json(blog.toJSON())

  //Old way without save()
  // const updatedBlog = await Blog.findByIdAndUpdate(request.params.id,
  //   updateData,
  //   { new: true, runValidators: true, context: 'query' })

  // if (updatedBlog) {
  //   response.status(200).json(updatedBlog.toJSON())
  // }
  // else {
  //   response.status(404).end()
  // }
})

module.exports = blogsRouter