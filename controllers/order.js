const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')
const mongoose=require('mongoose')
const orderRouter = require('express').Router()
const Order = require('../models/order')
const User = require('../models/user')
const {Product} = require('../models/product')
const { json } = require('express')

const getTokenFrom = request => {

    const authorization = request.get('authorization')
    logger.info(authorization)
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
  }

orderRouter.get('/', async (request, response) => {
  const orders = await Order.find({})
  //.populate('notes',{ content:1,important:1 })
  response.json(orders)
})

orderRouter.post('/', async (request, response) => {
  console.log(request.body)
  const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
  if (!decodedToken.id) {
    return response.status(401).json({ error: 'token invalid' })
  }
  console.log('decodedToken.id',decodedToken.id)
  const user = await User.findById(decodedToken.id)
const paymentType=request.body.paymentType
const lat=request.body.lat
const long=request.body.long
const products=request.body.products
const ids=products.map((e)=>e['id'])
const q=products.map((e)=>e['q'])

console.log('ids :',ids)

const productsFromDB=await Product.find({
    '_id': { $in: ids}})

console.log('productsFromDB',productsFromDB)
 const status=0
  amount=0
 productsFromDB.map((e)=>amount+=e.price*(q[productsFromDB.indexOf(e)]))
 console.log('amount',amount)

 const vat =20
 const deliveryCharge=10
 const total=vat+deliveryCharge+amount

 //response.status(200)
 const test={product :productsFromDB[0], quantity:q[0]}
 console.log('test',test)

 const finalProducts=productsFromDB.map((e)=>{
    return {product :e, quantity:q[productsFromDB.indexOf(e)]}
 } )
 console.log('finalProducts',finalProducts)

  const order = new Order({
    status:status,
    paymentType:paymentType,
    lat:lat,
    long:long,
    amount:amount,
    vat:vat,
    deliveryCharge:deliveryCharge,
    total:total,
    //quantities:[...products],
    products:finalProducts,
   user: user.id
  })

  const savedOrder = await order.save()

  response.status(201).json(savedOrder)
})

orderRouter.get('/userOrders', async (request, response) => {
    console.log(request.body)
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    console.log('decodedToken.id',decodedToken.id)
    const order = await Order.find({user : decodedToken.id})
    if (order) {
     
      response.json(order)
    } else {
      response.status(404).end()
    }
  })
orderRouter.get('/:id', async (request, response) => {
    console.log(request.body)
    const decodedToken = jwt.verify(getTokenFrom(request), process.env.SECRET)
    if (!decodedToken.id) {
      return response.status(401).json({ error: 'token invalid' })
    }
    console.log('decodedToken.id',decodedToken.id)
    const order = await Order.findById(request.params.id)
    if (order) {
        console.log('order',order)
      response.json(order)
    } else {
      response.status(404).end()
    }
  })

module.exports = orderRouter