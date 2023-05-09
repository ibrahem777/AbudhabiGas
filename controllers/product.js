const productRouter = require('express').Router()
const {Product} = require('../models/product')
const uploadUtil = require('../upload')
const {URL}=require('../utils/config')

productRouter.get('/', async (request, response) => {
  const products = await Product.find({})
  //.populate('notes',{ content:1,important:1 })
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

 

  const product = new Product({
    name,
    desc,
    img,
    price,
  })

  const savedProduct = await product.save()

  response.json({
    'status':true,
    'code':200,
    'message':'success',
    'data':savedProduct})
})

module.exports = productRouter