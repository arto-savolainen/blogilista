const User = require('../models/user')
const Blog = require('../models/blog')

const nonExistingId = async () => {
  const blog = new Blog({ 
    author: 'willremovethissoon',
    title: 'bolg',
    url: 'a.d.gv',
    likes: 10000 
  })

  await blog.save()
  await blog.remove()

  return blog._id.toString()
}

const blogsInDb = async () => {
  const blogs = await Blog.find({})
  return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
  const users = await User.find({})
  return users.map(u => u.toJSON())
}

module.exports = {
  nonExistingId,
  blogsInDb,
  usersInDb
}