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
    username: 'k',
    name: 'K',
    password: 'k'
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

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/)

    expect(result.body.error).toContain('Error: username must be unique.')

    const usersAtEnd = await helper.usersInDb()
    expect(usersAtEnd).toHaveLength(usersAtStart.length)
  })
})

describe('HTTP GET', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    // await User.insertMany(userList)
    // const users = await helper.usersInDb()
    // console.log('users:', users)

    for (const user of userList) {
      console.log('USER', user)
      await api.post('/api/users').send(user)
    }
    const usersindbnow = await helper.usersInDb()
    console.log('usersindb:', usersindbnow)

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

afterAll(() => {
  mongoose.connection.close()
})