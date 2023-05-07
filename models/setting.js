const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')
const {adsSchema} = require('../models/ads')

const settingSchema = new mongoose.Schema({
  ads: [ {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Ads'
  }]

})

settingSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString()
    delete returnedObject._id
    delete returnedObject.__v
  }
})
settingSchema.plugin(uniqueValidator)

const Setting = mongoose.model('Setting', settingSchema)

module.exports = Setting