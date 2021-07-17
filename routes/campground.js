const express = require('express')
const router = express.Router({ mergeParams: true })

const catchAsync = require('../utils/cathcAsync.js')
const ExpressError = require('../utils/ExpressError')
const { campgroundSchema } = require('../schemas.js')
const Campground = require('../models/campground')
const isLoggedIn = require('../middleware')
const campgroundController = require('../controller/campground')
// const isAuthor = require('../middleware')
//const { isLoggedIn, isAuthor, validateCampground } = require('../middleware')

const isAuthor = async (req, res, next) => {
  const { id } = req.params
  const campground = await Campground.findById(id)
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'You do not have permission to do that')
    return res.redirect(`/campground/${campground.id}`)
  }
  next()
}

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

router
  .route('/')
  .get(catchAsync(campgroundController.index))
  .post(
    isLoggedIn,
    validateCampground,
    catchAsync(campgroundController.createCampground)
  )

router.route('/new').get(isLoggedIn, campgroundController.renderNewForm)

router
  .route('/:id')
  .get(catchAsync(campgroundController.showCampground))
  .put(
    validateCampground,
    isLoggedIn,
    isAuthor,
    catchAsync(campgroundController.updateCampground)
  )
  .delete(
    isLoggedIn,
    isAuthor,
    catchAsync(campgroundController.deleteCampground)
  )

router
  .route('/:id/edit')
  .get(isLoggedIn, isAuthor, catchAsync(campgroundController.editCampground))

module.exports = router
