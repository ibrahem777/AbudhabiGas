const settingRouter = require('express').Router()
const { Ads } = require('../models/ads')
const Setting = require('../models/setting')
const uploadUtil = require('../upload')
const {URL}=require('../utils/config')
settingRouter.get('/', async (request, response) => {
    const ads = await Ads.find({})
    response.json({
      'status':true,
      'code':200,
      'message':'success',
      'data':{'ads':ads}})
  })
settingRouter.post('/ads',uploadUtil.upload.single("image"), async (request, response) => {
  const title = request.body.title
  const desc = request.body.desc
  const img=URL+request.file.filename
const newAds=Ads({
    title,
    desc,
    img
})
const savedAds=await newAds.save()
// const settings = await Setting.find({})

// settings[0].ads = settings[0].ads.concat(savedAds._id)
//   await settings[0].save()
  response
    .json({
      'status':true,
      'code':200,
      'message':'success',
      'data':savedAds})
})

module.exports = settingRouter