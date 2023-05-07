const settingRouter = require('express').Router()
const { Ads } = require('../models/ads')
const Setting = require('../models/setting')
const uploadUtil = require('../upload')

settingRouter.get('/', async (request, response) => {
    const ads = await Ads.find({})
    response.json({"ads":ads})
  })
settingRouter.post('/ads',uploadUtil.upload.single("image"), async (request, response) => {
  const title = request.body.title
  const desc = request.body.desc

const newAds=Ads({
    title,
    desc,
})
const savedAds=await newAds.save()
// const settings = await Setting.find({})

// settings[0].ads = settings[0].ads.concat(savedAds._id)
//   await settings[0].save()
  response
    .status(201)
    .json(savedAds)
})

module.exports = settingRouter