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
      author: '60ee4a622696ac038747ef67',
      location: `${cities[rand1000].city},${cities[rand1000].state}`,
      title: `${sample(descriptors)}  ${sample(places)}`,
      description: 'This is a nice place to visit',
      Price,
      images: [
        {
          url: 'https://res.cloudinary.com/dogesathya/image/upload/v1626588839/YelpCamp/cdpbxd4yfggnf8sy8ogk.jpg',
          fileName: 'YelpCamp/cdpbxd4yfggnf8sy8ogk',
        },
        {
          url: 'https://res.cloudinary.com/dogesathya/image/upload/v1626588839/YelpCamp/c4o6rppk9ag23o54ds8t.jpg',
          fileName: 'YelpCamp/c4o6rppk9ag23o54ds8t',
        },
        {
          url: 'https://res.cloudinary.com/dogesathya/image/upload/v1626588839/YelpCamp/rutueyn2q6ubq2vjqzdo.jpg',
          fileName: 'YelpCamp/rutueyn2q6ubq2vjqzdo',
        },
      ],
    })
    await camp.save()
  }
}

seedDB().then(() => {
  mongoose.connection.close()
})
