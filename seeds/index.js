const { DH_CHECK_P_NOT_SAFE_PRIME } = require('constants')
const mongoose = require('mongoose')
const Campground = require('../models/campground')
const cities = require('./cities')
const { places, descriptors } = require('./seedHelpers')

const conectionvar = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/yelp-camp', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
  } catch (error) {
    handleError(error)
  }
}
conectionvar()

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
  console.log('DataBase Connected')
})

const sample = (array) => {
  return array[Math.floor(Math.random() * array.length)]
}

const seedDB = async () => {
  for (let i = 0; i < 50; i++) {
    const rand1000 = Math.floor(Math.random() * 1000)
    const camp = new Campground({
      location: `${cities[rand1000].city},${cities[rand1000].state}`,
      title: `${sample(descriptors)}  ${sample(places)}`,
    })
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
