const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const logger = require('../utils/logger')
const jwt = require('jsonwebtoken')

const getTokenFrom = request => {

  const authorization = request.get('authorization')
  logger.info(authorization)
  if (authorization && authorization.startsWith('Bearer ')) {
    return authorization.replace('Bearer ', '')
  }
  return null
}
usersRouter.get('/', async (request, response) => {
  const users = await User.find({})
  //.populate('notes',{ content:1,important:1 })
  response.json(users)
})

usersRouter.post('/', async (request, response) => {
  const {  name,email,mobile, password } = request.body

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


usersRouter.post('/login', async (request, response) => {
  const email = request.body.email
  const password = request.body.password


  const user = await User.findOne({ email })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      message: 'invalid username or password'
    })
  }
  else if(user.status==0){
    return response.status(402).json({
      message: 'you need to confirm your mobile number'
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
    .send({ token, name: user.name,email:user.email,mobile:user.mobile,status:user.status })
})

usersRouter.post('/signup', async (request, response) => {
  console.log(request.body.password)
  const name=request.body.name
  const email=request.body.email
  const mobile=request.body.mobile
  const password=request.body.password
  const status=0
  console.log(password)

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)
  const user = new User({
    name,
    email,
    mobile,
    status,
    passwordHash,
  })

  const savedUser = await user.save()

  response.status(201).json(savedUser)
})


usersRouter.post('/verify', async (request, response) => {
  const mobile=request.body.mobile
  const code=request.body.code
  const user = await User.findOne({ mobile })
  const codeCorrect = user === null
    ? false
    : Number(code)===1111

  if (!(user && codeCorrect)) {
    return response.status(401).json({
      error: 'invalid code or mobile'
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
user.status=1
  await user.save()
  response
    .status(200)
    .send({ token, name: user.name,email:user.email,mobile:user.mobile,status:user.status })
})

usersRouter.post('/resetPassword', async (request, response) => {
  const oldpassword=request.body.oldpassword
  const newpassword=request.body.newpassword


  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  console.log('decodedToken.id',decodedToken.id)
  const user = await User.findById(decodedToken.id)
  

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(oldpassword, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.status(401).json({
      error: 'wrong password'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(newpassword, saltRounds)
  user.passwordHash=passwordHash
  await user.save()

  response
    .status(200)
    .send({ message:'password has been updated'})
})
usersRouter.post('/forgetPassword', async (request, response) => {
  const data=request.body.data
  
var query 
var type=""
if(data.indexOf('@')===-1){
  type="phone"
  query={mobile: data}
  
}else{
  type="email"
  query={email: data}


}
 const  user = await User.findOne(query)
   console.log('user',user)

  if (!(user)) {
    return response.status(401).json({
      error: 'No user with this '+type
    })
  }
  const newpassword="123456"

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(newpassword, saltRounds)
  user.passwordHash=passwordHash
  await user.save()

  response
    .status(200)
    .send({ message:'password has been sent'})
})
module.exports = usersRouter