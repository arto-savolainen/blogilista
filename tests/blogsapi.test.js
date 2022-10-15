const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')


const blogListWith8Blogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  },
  {
    title: 'Bloopp',
    author: 'Blabps',
    url: 'www.blblasd.asd',
    likes: 1,
    __v: 0
  },
  {
    title: 'Lowly Blog',
    author: 'OOOO',
    url: 'www.ooooooooo.xxx',
    likes: 6,
    __v: 0
  }
]

beforeEach(async () => {
  await Blog.deleteMany({})
  let blogObject = new Blog(blogListWith8Blogs[0])
  await blogObject.save()
  blogObject = new Blog(blogListWith8Blogs[1])
  await blogObject.save()
  blogObject = new Blog(blogListWith8Blogs[2])
  await blogObject.save()
  blogObject = new Blog(blogListWith8Blogs[3])
  await blogObject.save()
  blogObject = new Blog(blogListWith8Blogs[4])
  await blogObject.save()
  blogObject = new Blog(blogListWith8Blogs[5])
  await blogObject.save()
  blogObject = new Blog(blogListWith8Blogs[6])
  await blogObject.save()
  blogObject = new Blog(blogListWith8Blogs[7])
  await blogObject.save()
})

describe('bloglist rest api', () => {
  test('http get returns correct amount of blog items', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

      expect(response.body.length).toBe(8)
  })

})


afterAll(() => {
  mongoose.connection.close()
})