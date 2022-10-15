const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const { listIndexes } = require('../models/blog')


const blogList = [
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
  await Blog.insertMany(blogList)
})

describe('HTTP GET', () => {
  test('returns correct amount of blog items', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(blogList.length)
  })

  test('field "id" is defined for each blog item', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const blogs = response.body
    blogs.forEach(x => {
      expect(x.id).toBeDefined()
    })
  })
})

describe('HTTP POST', () => {
  test('adding a new blog succesfully increases database blog count by one', async () => {
    let newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'www.newblog.bloggs',
      likes: '111111116'
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const getResponse = await api.get('/api/blogs')

    expect(getResponse.body).toHaveLength(blogList.length + 1)
  })

  test('adding a new blog succesfully returns the added blog item', async () => {
    let newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'www.newblog.bloggs',
      likes: 111111116
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    //first get the id of the returned blog object so we can properly compare newBlog and the returned blog
    newBlog.id = response.body.id
    expect(response.body).toEqual(newBlog)
  })

  test('adding a blog with missing "likes" field sets likes to 0', async () => {
    let newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'www.newblog.bloggs'
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    expect(response.body.likes).toBe(0)
  })

  test('adding a blog with a missing "title" or "url" field returns HTTP code 400 Bad Request', async () => {
    let newBlog = {
      author: 'New Author',
      url: 'www.newblog.bloggs',
      likes: 2
    }

    let response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)

    newBlog = {
      title: 'New Blog',
      author: 'New Author',
      likes: 2
    }

    response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400)
  })
})

afterAll(() => {
  mongoose.connection.close()
})