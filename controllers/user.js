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
  response.json({
    'status':true,
    'code':200,
    'message':'success',
    'data':users})
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

  response.json({
    'status':true,
    'code':200,
    'message':'success',
    'data':savedUser})
})


usersRouter.post('/login', async (request, response) => {
  const email = request.body.email
  const password = request.body.password

console.log('email',email,'passwrd',password)
  const user = await User.findOne({ email })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.passwordHash)

  if (!(user && passwordCorrect)) {
    return response.json({
      status:false,
      code:401,
      message: 'invalid username or password'
    })
  }
  else if(user.status==0){
    return response.json({
      status:false,
      code:201,
      'message': 'you need to confirm your mobile number'
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
    .json({
      status:true,
      code:200,
      message:'success',
      data:{
        token,...user
      }})
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

  response.json({
    status:true,
    code:200,
    message:'success',
    data:user})
})


usersRouter.post('/verify', async (request, response) => {
  const mobile=request.body.mobile
  const code=request.body.code
  const user = await User.findOne({ mobile })
  const codeCorrect = user === null
    ? false
    : Number(code)===1111

  if (!(user && codeCorrect)) {
    return response.json({
      status:false,
      code:401,
      message: 'invalid code or mobile'
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

  .json({
    status:true,
    code:200,
    message:'success',
    data:{
      token,...user
    }})
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
    return response.json({
      status:false,
      code:401,
      message: 'wrong password'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(newpassword, saltRounds)
  user.passwordHash=passwordHash
  await user.save()

  response
  json({
    status:true,
    code:200,
    message: 'password has been updated'
  })
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
    return response.json({
      status:false,
      code:401,
      message: 'No user with this '+type
    })
  }
  const newpassword="123456"

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(newpassword, saltRounds)
  user.passwordHash=passwordHash
  await user.save()

  response.json({
    status:false,
    code:401,
    message: 'password has been sent '
  })
   
})
module.exports = usersRouter