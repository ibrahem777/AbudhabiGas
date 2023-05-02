const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  desc: String,
  price: Number,
  
})

productSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
productSchema.plugin(uniqueValidator)

const Product = mongoose.model('Product', productSchema)

module.exports = Product