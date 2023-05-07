const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

const adsSchema = new mongoose.Schema({
  title: String,
  desc: String,
  img: String,
})

adsSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
adsSchema.plugin(uniqueValidator)

const Ads = mongoose.model('Ads', adsSchema)

module.exports = {Ads , adsSchema}