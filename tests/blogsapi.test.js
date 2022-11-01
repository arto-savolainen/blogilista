const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')
const User = require('../models/user')

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

const userList = [
  {
    username: 'jormaz',
    name: 'Jorma Nykänen',
    password: 'eihele'
  },
  {
    username: 'klol',
    name: 'K',
    password: 'klol'
  },
  {
    username: 'AAAAAAAAAAAAAAAAAAAAAAA',
    name: 'A Aaaaaaaaa',
    password: 'Aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa'
  }
]

let token

beforeEach(async () => {
  await User.deleteMany({})

  for (const user of userList) {
    await api.post('/api/users').send(user)
  }

  //login the first user in the list so tests can use their token
  const loginResponse = await api.post('/api/login')
    .send({ username: userList[0].username, password: userList[0].password })
    .expect(200)
    .expect('Content-Type', /application\/json/)

  token = loginResponse.body.token

  await Blog.deleteMany({})
  for (const blog of blogList) {
    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(blog)
  }
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
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    //first get the id and user of the returned blog object so we can properly compare newBlog and the returned blog
    //as these fields are missing from initial bloglist
    newBlog.id = response.body.id
    newBlog.user = response.body.user
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
      .set('Authorization', `Bearer ${token}`)
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
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)

    newBlog = {
      title: 'New Blog',
      author: 'New Author',
      likes: 2
    }

    response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(400)
  })

  test('adding a blog with missing auth token returns 401 Unauthorized', async () => {
    let newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'www.newblog.bloggs',
      likes: 111111116
    }

    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)
  })
})

describe('HTTP DELETE', () => {
  test('the deleted item is returned in the response and database size is reduced by one after successful deletion', async () => {
    let blogs = await Blog.find({})
    const blogToDelete = blogs[0].toJSON()
    const id = blogToDelete.id

    response = await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const deletedBlog = response.body
    deletedBlog.user = blogToDelete.user

    expect(deletedBlog).toEqual(blogToDelete)

    response = await api.get('/api/blogs')
    expect(response.body).toHaveLength(blogList.length - 1)
  })

  test('delete with invalid id returns HTTP code 400 Bad Request', async () => {
    response = await api
      .delete(`/api/blogs/invalid_id_lololo`)
      .set('Authorization', `Bearer ${token}`)
      .expect(400)
  })

  test('DELETE with valid but not found id returns HTTP code 404 Not Found', async () => {
    const id = await helper.nonExistingId()

    await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(404)
  })

  test('trying to delete a blog with missing auth token returns 401 Unauthorized', async () => {
    let blogs = await Blog.find({})
    const blogToDelete = blogs[0].toJSON()
    const id = blogToDelete.id

    response = await api
      .delete(`/api/blogs/${id}`)
      .expect(401)
  })

  test('trying to delete a blog with another user\'s auth token returns 401 Unauthorized', async () => {
    let blogs = await Blog.find({})
    const blogToDelete = blogs[0].toJSON()
    const id = blogToDelete.id

    const loginResponse = await api.post('/api/login')
      .send({ username: userList[1].username, password: userList[1].password })

    const wrongToken = loginResponse.body.token

    response = await api
      .delete(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${wrongToken}`)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('not authorized')
  })
})

describe('HTTP PUT', () => {
  test('when updating likes: updated item is returned and matches request data after successful PUT', async () => {
    const blogs = await Blog.find({})
    let updateBlog = blogs[0].toJSON()
    updateBlog.likes = 9999999999999

    const putResponse = await api
      .put(`/api/blogs/${updateBlog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const returnedBlog = putResponse.body
    // console.log('returnedBlog.user:', returnedBlog.user)
    // console.log('updateBlog.user:', updateBlog.user)
    // returnedBlog.user = updateBlog.user
    updateBlog.user = updateBlog.user.toString()

    expect(returnedBlog).toEqual(updateBlog)
  })

  test('when updating with missing "title" or "url" fields: returns HTTP code 400 Bad Request', async () => {
    const blogs = await Blog.find({})
    let updateBlog = blogs[0].toJSON()
    updateBlog.title = ''
    updateBlog.likes = 9999999999999

    await api
      .put(`/api/blogs/${updateBlog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateBlog)
      .expect(400)

    updateBlog = blogs[1].toJSON()
    updateBlog.url = ''

    await api
      .put(`/api/blogs/${updateBlog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateBlog)
      .expect(400)

    updateBlog = blogs[2].toJSON()
    updateBlog.author = ''
    updateBlog.likes = -6000
    updateBlog.user = updateBlog.user.toString()

    const validDataResponse = await api
      .put(`/api/blogs/${updateBlog.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateBlog)
      .expect(200)
      .expect('Content-Type', /application\/json/)

    expect(validDataResponse.body).toEqual(updateBlog)
  })

  test('PUT with invalid id returns HTTP code 400 Bad Request', async () => {
    const blogs = await Blog.find({})
    let updateBlog = blogs[0].toJSON()
    updateBlog.likes = 9999999999999

    response = await api
      .put(`/api/blogs/invalid_id_lololo`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateBlog)
      .expect(400)
  })

  test('PUT with valid but not found id returns HTTP code 404 Not Found', async () => {
    // let response = await api.get('/api/blogs').expect(200)
    // let updateData = response.body[0]
    const blogs = await Blog.find({})
    let updateBlog = blogs[0].toJSON()

    updateBlog.likes = 9999999999999
    // old //updateBlog.user = '6351797134bed8388681fc4f'

    // console.log('UPDATEBLOG BEFORE SEND:', updateBlog)
    const id = await helper.nonExistingId()
    // console.log('NONEXISTING ID:', id)

    await api
      .put(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${token}`)
      .send(updateBlog)
      .expect(404)
  })

  test('trying to update a blog with another user\'s auth token returns 401 Unauthorized', async () => {
    let blogs = await Blog.find({})
    const updateBlog = blogs[0].toJSON()
    const id = updateBlog.id

    const loginResponse = await api.post('/api/login')
      .send({ username: userList[1].username, password: userList[1].password })

    const wrongToken = loginResponse.body.token

    response = await api
      .put(`/api/blogs/${id}`)
      .set('Authorization', `Bearer ${wrongToken}`)
      .send(updateBlog)
      .expect(401)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('not authorized')
  })
})

afterAll(() => {
  mongoose.connection.close()
})