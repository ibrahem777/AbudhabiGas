const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const loginRouter = require('express').Router()
const User = require('../models/user')

loginRouter.post('/', async (request, response) => {
  const email = request.body.email
  const password = request.body.password


  const user = await User.findOne({ email })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'invalid username or password'
    })
  }

  const userForToken = {
    email: user.email,
    id: user._id,
  }

  const token = jwt.sign( userForToken,
    // eslint-disable-next-line indent
     process.env.SECRET,
    // { expiresIn: 60*60 }
    // eslint-disable-next-line indent
     )

  response
    .status(200)
    .send({ token, name: user.name,email:user.email,mobile:user.mobile })
})

module.exports = loginRouter