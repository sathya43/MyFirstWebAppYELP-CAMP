const express = require('express')
const router = express.Router({ mergeParams: true })

const catchAsync = require('./cathcAsync.js')
const ExpressError = require('../utils/ExpressError')
const { reviewSchema } = require('../schemas.js')
const Campground = require('../models/campground')
const Review = require('../models/reviews')
const isLoggedIn = require('../middleware')
const reviewController = require('../controller/reviews')

const cathcAsync = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next)
  }
}

// const isReviewAuthor = async (req, res, next) => {
//   const { id, reviewId } = req.params
//   const review = await Review.findById(reviewId)
//   if (!review.author.equals(req.user._id)) {
//     req.flash('error', 'You do not have permission to do that')
//     return res.redirect(`/campground/${id}`)
//   }
//   next()
// }

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
  isLoggedIn,
  cathcAsync(reviewController.createReview)
)

router.delete(
  '/:reviewId',
  isLoggedIn,
  catchAsync(reviewController.deleteReview)
)

module.exports = router
