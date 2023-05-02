const bcrypt = require('bcrypt')
const signupRouter = require('express').Router()
const User = require('../models/user')

signupRouter.post('/', async (request, response) => {
    console.log(request.body.password)
    const name=request.body.name
    const email=request.body.email
    const mobile=request.body.mobile
    const password=request.body.password
    console.log(password)

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(password, saltRounds)
  
    const user = new User({
      name,
      email,
      mobile,
      passwordHash,
    })
  
    const savedUser = await user.save()
  
    response.status(201).json(savedUser)
  })
  

module.exports = signupRouter