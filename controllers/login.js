const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')
const config = require('../utils/config')

loginRouter.post('/', async (request, response) => {
  const { username, password } = request.body

  const user = await User.findOne({ username })
  let passwordCorrect = false

  if (user && password) {
    passwordCorrect = await bcrypt.compare(password, user.passwordHash)
  }
  //console.log('username:', username, 'password:', password, 'user:', user)
  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    username: user.username,
    id: user._id,
  }

  const token = jwt.sign(userForToken, config.SECRET, { expiresIn: 60 * 60 })

  response
    .status(200)
    .send({ token, username: user.username, name: user.name })
})

module.exports = loginRouter