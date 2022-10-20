const blogsRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')

// //temp for testing
// const supertest = require('supertest')
// const helper = require('../tests/test_helper')
// const app = require('../app')
// const api = supertest(app)

blogsRouter.get('/', async (request, response) => {
  const blogs = await Blog.find({}).populate('user', { blogs: 0 })
  response.json(blogs)

})

blogsRouter.post('/', async (request, response) => {
  let newBlog = request.body
  // console.log('request.body:', request.body)
  // // //add temp user reference 
  // newBlog.user = await api.get('/api/users').body[0].id 
  // console.log('newblog.user:', newBlog.user)
  // const getresponse = await api.get('api/users')
  // console.log('getresponse.body:', getresponse.body)
  // console.log('NEWBLOG', newBlog)

  //THESE NOW SET AT TEST LEVEL
  const user = await User.findById(newBlog.user)
  // // const user = tempUsers[0]
  // newBlog.user = user.id

  //technically this is not needed since validators will fail and error handling will return code 400
  if (!newBlog.title || !newBlog.url) {
    return response.status(400).end()
  }

  //Is it possible to do this during db validation?
  if (!newBlog.likes) {
    newBlog.likes = 0
  }
  // console.log('PÄÄSTIIN TÄNNE')

  const blog = new Blog(newBlog)
  // console.log('PÄÄSTIIN TÄNNE 2')
  const savedBlog = await blog.save()
  // console.log('PÄÄSTIIN TÄNNE 3')
  user.blogs = user.blogs.concat(savedBlog._id)
  // console.log('savedblog:', savedBlog)
  // console.log('SAVEDBLOG.ID', savedBlog.id)
  // console.log('SAVEDBLOG._ID', savedBlog._id)
  // console.log('PÄÄSTIIN TÄNNE 4')
  // console.log('USER:', user)
  const savedUser = await User.findByIdAndUpdate(user._id, user)
  // console.log('savedUser:', savedUser)

  // console.log('SAVEDUSER:', savedUser)

  response.status(201).json(savedBlog)
})

blogsRouter.delete('/:id', async (request, response) => {
  const result = await Blog.findByIdAndDelete(request.params.id)

  if (result) {
    response.json(result)
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
    response.status(200).json(updatedBlog)
  }
  else {
    response.status(404).end()
  }
})

module.exports = blogsRouter