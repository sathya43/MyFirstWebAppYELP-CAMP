const express = require('express')
const router = express.Router({ mergeParams: true })

const catchAsync = require('./cathcAsync.js')
const ExpressError = require('../utils/ExpressError')
const { reviewSchema } = require('../schemas.js')
const Campground = require('../models/campground')
const Review = require('../models/reviews')

const cathcAsync = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next)
  }
}

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

router.post(
  '/',
  validateReview,
  cathcAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    const review = new Review(req.body.review)
    campground.reviews.push(review)
    await review.save()
    await campground.save()
    req.flash('success', 'Successfully created a new Review')
    res.redirect(`/campground/${campground._id}`)
  })
)

router.delete(
  '/:reviewId',
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params
    await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId } })
    await Review.findByIdAndDelete(reviewId)
    res.redirect(`/campground/${id}`)
  })
)

module.exports = router
