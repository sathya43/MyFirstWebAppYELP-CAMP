const mongoose = require('mongoose')
const Review = require('./reviews.js')
const Schema = mongoose.Schema

// const ImageSchema = new Schema({
//   url: String,
//   fileName: String,
// })

// ImageSchema.virtual('thumbnail').get(function () {
//   return this.url.replace('/upload', '/upload/w_400')
// })

const Campgroundschema = new Schema({
  title: String,
  description: String,
  // image: String,
  images: [
    {
      url: String,
      fileName: String,
    },
  ],
  location: String,
  Price: Number,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review',
    },
  ],
})

Campgroundschema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Review.deleteMany({
      _id: {
        $in: doc.reviews,
      },
    })
  }
})

module.exports = mongoose.model('Campground', Campgroundschema)
