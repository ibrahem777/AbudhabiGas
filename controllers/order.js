const jwt = require('jsonwebtoken')
const logger = require('../utils/logger')
const orderRouter = require('express').Router()
const { Product,OrderProducts ,User,Order} = require('../models')
const {tokenExtractor} = require('../utils/middleware')
const { json } = require('express')
const { where } = require('sequelize')

const getTokenFrom = request => {

    const authorization = request.get('authorization')
    logger.info(authorization)
    if (authorization && authorization.startsWith('Bearer ')) {
      return authorization.replace('Bearer ', '')
    }
    return null
  }

orderRouter.get('/', async (request, response) => {
  const orders = await Order.findAll({include: {
    model: OrderProducts,
    // through: {
    //   attributes: ['quantity']
    // }
    attributes: ['quantity'],
    include: [Product, ]
    
   
  }})
  //.populate('notes',{ content:1,important:1 })
  response.json({
    'status':true,
    'code':200,
    'message':'success',
    'data':orders})
})

orderRouter.post('/',tokenExtractor, async (request, response) => {
  console.log(request.body)

  console.log('decodedToken.id',request.decodedToken.id)
  const user = await User.findByPk(request.decodedToken.id)
const paymentType=request.body.paymenttype
const lat=request.body.lat
const long=request.body.long
const products=request.body.products
const ids=products.map((e)=>e['id'])
const q=products.map((e)=>e['q'])

console.log('ids :',ids)
console.log('q :',q)


const productsFromDB=await Product.findAll({
    where: {id: ids}})

console.log('productsFromDB',productsFromDB)
 const status=0
  amount=0
 productsFromDB.map((e)=>amount+=e.price*(q[productsFromDB.indexOf(e)]))
 console.log('amount',amount)

 const vat =20
 const deliveryCharge=10
 const total=vat+deliveryCharge+amount

  const order = await Order.create({
    status:status,
    paymentType:paymentType,
    lat:lat,
    long:long,
    amount:amount,
    vat:vat,
    deliveryCharge:deliveryCharge,
    total:total,
   userId: user.id
  })
  productsFromDB.map((product)=> order.addProduct(product,{ through: { quantity: q[productsFromDB.indexOf(product)] ,},})
 )
  

  response.json({
    'status':true,
    'code':200,
    'message':'success',
    'data':order})
})

orderRouter.get('/userOrders',tokenExtractor, async (request, response) => {
  
    console.log('decodedToken.id',request.decodedToken.id)
    const order = await Order.findAll({where:{userId : request.decodedToken.id},include: {
      model: OrderProducts,
      attributes: ['quantity'],
      include: [Product, ]
      
     
    }})
    if (order) {
     
      response.json({
        'status':true,
        'code':200,
        'message':'success',
        'data':order})
    } else {
      response.json({
        'status':false,
        'code':400,
        'message':'not found'})
    }
  })
orderRouter.get('/:id',tokenExtractor, async (request, response) => {
   
    console.log('decodedToken.id',request.decodedToken.id)
    const order = await Order.findByPk(request.params.id,{include: {
      model: OrderProducts,
      attributes: ['quantity'],
      include: [Product, ]
      
     
    }})
    if (order) {
        console.log('order',order)
      response.json({
        'status':true,
        'code':200,
        'message':'success',
        'data':order})
    } else {
      response.json({
        'status':false,
        'code':400,
        'message':'not found'})
    }
  })

module.exports = orderRouter