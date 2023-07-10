const bcrypt = require('bcrypt')
const usersRouter = require('express').Router()
const User = require('../models/user')
const Note = require('../models/note')

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
  const users = await User.findAll({})
  response.json({
    'status':true,
    'code':200,
    'message':'success',
    'data':users})
})

usersRouter.post('/', async (request, response) => {
  const {  name,email,mobile, password } = request.body

  
  
  try {
    const saltRounds = 10
  const passwordHash = await bcrypt.hash(password, saltRounds)

    const user = await User.create({
      
     name: name,
      password: passwordHash,
    mobile: mobile,
  email:  email,
    })
    response.json({
      'status':true,
      'code':200,
      'message':'success',
      'data':user})
  } catch(error) {
    return response.json({
      status:false,
      code:400,
      'message': error
    })  }

  
})


usersRouter.post('/login', async (request, response) => {
  console.log('request.body',request.body)

  const email = request.body.email
  const password = request.body.password

console.log('email',email,'passwrd',password)

  const user = await User.findOne({  where: {
    email: email
  } })
  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(password, user.password)

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
      message: 'you need to confirm your mobile number',
      data:user.phone
    })
  }

  const userForToken = {
    email: user.email,
    id: user.id,
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
        token,id:user.id,name:user.name,email:user.email,phone :user.phone,status:user.status
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
  const user = await User.create({ name:name,
   email: email,
    mobile:mobile,
    status:status,
   password: passwordHash,})

  response.json({
    status:true,
    code:200,
    message:'success',
    data:user})
})


usersRouter.post('/verify', async (request, response) => {
  const mobile=request.body.mobile
  const code=request.body.code
  const user = await User.findOne({where: {
    mobile: mobile
  }})
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
    id: user.id,
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
      token,id:user.id,name:user.name,email:user.email,mobile :user.mobile,status:user.status
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
  const user = await User.findByPk(decodedToken.id)
  

  const passwordCorrect = user === null
    ? false
    : await bcrypt.compare(oldpassword, user.password)

  if (!(user && passwordCorrect)) {
    return response.json({
      status:false,
      code:401,
      message: 'wrong password'
    })
  }

  const saltRounds = 10
  const passwordHash = await bcrypt.hash(newpassword, saltRounds)
  user.password=passwordHash
  await user.save()

  response.
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
 const  user = await User.findOne({wehere :{query}})
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