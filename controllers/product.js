const productRouter = require('express').Router()
const {Product} = require('../models/product')


productRouter.get('/', async (request, response) => {
  const products = await Product.find({})
  //.populate('notes',{ content:1,important:1 })
  response.json(products)
})

productRouter.post('/', async (request, response) => {
  console.log(request.body)
  const {  name,desc,price } = request.body

 

  const product = new Product({
    name,
    desc,
    price,
  })

  const savedProduct = await product.save()

  response.status(201).json(savedProduct)
})

module.exports = productRouter