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
  await Campground.deleteMany({})
  for (let i = 0; i < 50; i++) {
    const rand1000 = Math.floor(Math.random() * 1000)
    const Price = Math.floor(Math.random() * 30) + 10
    const camp = new Campground({
      image: `https://source.unsplash.com/random/200x200?sig=${i}`,
      location: `${cities[rand1000].city},${cities[rand1000].state}`,
      title: `${sample(descriptors)}  ${sample(places)}`,
      description: 'This is a nice place to visit',
    })
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
