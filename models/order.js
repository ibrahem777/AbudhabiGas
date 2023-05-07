const mongoose=require('mongoose')
const {productSchema} = require('../models/product')

const orderSchema=mongoose.Schema({
    status:Number,
    paymentType:Number,
    lat:Number,
    long:Number,
    amount:Number,
    vat:Number,
    deliveryCharge:Number,
    date:Date,
    total:Number,
    products: [
        {
        product:productSchema,
        quantity:{
            type : Number,
            default: 0
        }
        }
      ],
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
      }
})
orderSchema.set('toJSON', {
    transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
      delete returnedObject.products.ObjectId
    }
  })
  
  const Order = mongoose.model('Order', orderSchema)
  
  module.exports = Order