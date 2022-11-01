const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const bcrypt = require('bcrypt')
const User = require('../models/user')

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

describe('HTTP POST with one initial user in db', () => {
  beforeEach(async () => {

    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 12)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'mluukkai',
      name: 'Matti Luukkainen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    expect(usernames).toContain(newUser.username)
  })

  test('creation fails with proper statuscode and message if username already taken', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Root',
      name: 'Superuser',
      password: 'salainen',
    }

    const response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('username must be unique.')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

describe('HTTP GET', () => {
  beforeEach(async () => {
    // await User.insertMany(userList)
    // const users = await helper.usersInDb()
    // console.log('users:', users)
    await User.deleteMany({})

    for (const user of userList) {
      await api.post('/api/users').send(user)
    }
  })

  test('GET successfully fetches list of users, returned usernames and names equal those in userList', async () => {
    const response = await api
      .get('/api/users')
      .expect(200)
      .expect('Content-Type', /application\/json/)

    const users = response.body

    expect(users).toHaveLength(userList.length)

    let i = 0
    users.forEach((user, i) => {
      expect(user.username).toBe(userList[i].username)
      expect(user.name).toBe(userList[i].name)
    })
  })
})

describe('HTTP POST user with invalid info', () => {
  test('missing username or password field returns HTTP code 400 Bad Request and correct error msg, db size does not change', async () => {
    const usersAtStart = await helper.usersInDb()

    let newUser = {
      username: '',
      name: 'erkki',
      password: 'pena'
    }

    let response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('username must be at least')

    newUser = {
      username: 'pena',
      name: 'erkki',
      password: ''
    }

    response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('password must be at least')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })

  test('username or password shorter than 3 characters returns HTTP code 400 Bad Request and correct error msg, db size does not change', async () => {
    const usersAtStart = await helper.usersInDb()

    let newUser = {
      username: 'E',
      name: 'erkki',
      password: 'pena'
    }

    let response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('username must be at least')

    newUser = {
      username: 'pena',
      name: 'pena',
      password: '69'
    }

    response = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(response.body.error).toContain('password must be at least')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

describe('populate user db as last test for other tests', () =>{
  beforeAll(async () => {
    await User.deleteMany({})
  })

  test('add userList to db via post', async () =>{
    for (const user of userList) {
      await api.post('/api/users').send(user)
    }
  })

  test('login the first user in the list so other tests can use their token', async () => {
    const loginObject = await api.post('/api/login')
    .send({ username: userList[0].username, password: userList[0].password })
    .expect(200)
    .expect('Content-Type', /application\/json/)
  })
})

afterAll(() => {
  mongoose.connection.close()
})