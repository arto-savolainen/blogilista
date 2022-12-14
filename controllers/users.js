const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')

usersRouter.get('/', async (request, response) => {
  const users = await User.find({}).populate('blogs', { user: 0 })
  response.json(users)
})

usersRouter.get('/:id', async (request, response) => {
  const user = await User.findById(request.params.id).populate('blogs', { user: 0 })
  
  if (user) {
    response.json(user)
  }
  else {
    response.status(404).end()
  }
})

usersRouter.post('/', async (request, response) => {
  const { username, name, password } = request.body

  if (password.length < config.PASSWORD_MIN_LENGTH) {
    return response.status(400).json({
      error: `Error: password must be at least ${config.PASSWORD_MIN_LENGTH} characters long.`
    })
  }

  const saltRounds = 12
  const passwordHash = await bcrypt.hash(password, saltRounds)

  const user = new User({
    username,
    name,
    passwordHash,
  })

  const savedUser = await user.save()
 
  response.status(201).json(savedUser)
})

module.exports = usersRouter