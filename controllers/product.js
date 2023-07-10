const productRouter = require('express').Router()
const Product = require('../models/product')
const uploadUtil = require('../upload')
const {URL}=require('../utils/config')

productRouter.get('/', async (request, response) => {
  const products = await Product.findAll({})
  response.json({
    'status':true,
    'code':200,
    'message':'success',
    'data':products})
}) 

productRouter.post('/',uploadUtil.upload.single("image"), async (request, response) => {
  console.log(request.body)
  const {  name,desc,price } = request.body
  const img=URL+request.file.filename

 

  const product =await Product.create({ 
    name,
    desc,
    img,
    price,})

  response.json({
    'status':true,
    'code':200,
    'message':'success',
    'data':product})
})

module.exports = productRouter