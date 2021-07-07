const mongoose = require('mongoose')

const Schema = mongoose.Schema

const Campgroundschema = new Schema({
  title: String,
  description: String,
  image: String,
  location: String,
  Price: Number,
})

module.exports = mongoose.model('Campground', Campgroundschema)
