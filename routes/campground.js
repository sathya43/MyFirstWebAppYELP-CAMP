const express = require('express')
const router = express.Router({ mergeParams: true })

const catchAsync = require('../utils/cathcAsync.js')
const ExpressError = require('../utils/ExpressError')
const { campgroundSchema } = require('../schemas.js')
const Campground = require('../models/campground')
const isLoggedIn = require('../middleware')
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

router.get(
  '/',
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campground/index.ejs', { campgrounds })
  })
)

router.get('/new', isLoggedIn, (req, res) => {
  //res.send('Create new campground')

  res.render('newCamp.ejs')
})

router.post(
  '/',
  isLoggedIn,
  validateCampground,
  catchAsync(async (req, res) => {
    // //res.send(req.body)
    // if (!req.body.campground)
    //   throw new ExpressError('Invalid Campground Data', 400
    const camp = new Campground(req.body.campground)
    camp.author = req.user._id
    await camp.save()
    req.flash('success', 'Successfully created a new Campground')
    res.redirect(`/campground/${camp.id}`)
  })
)

router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
      .populate({
        path: 'reviews',
        populate: {
          path: 'author',
        },
      })
      .populate('author')
    if (!campground) {
      req.flash('error', 'Cannot find the campground')
      return res.redirect('/campground')
    }
    res.render('campground/show.ejs', { campground })
  })
)

router.put(
  '/:id',
  validateCampground,
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params
    // const campground = await Campground.findById(id)
    // if (!campground.author.equals(req.user._id)) {
    //   req.flash('error', 'You do not have permission to do that')
    //   return res.redirect(`/campground/${campground.id}`)
    // }
    const camp = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    })
    req.flash('success', 'Successfully created a Updated Campground')

    res.redirect(`/campground/${camp.id}`)
  })
)

router.get(
  '/:id/edit',
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    if (!camp) {
      req.flash('error', 'Cannot find the campground')
      return res.redirect('/campground')
    }
    res.render('editC.ejs', { camp })
  })
)

router.delete(
  '/:id',
  isLoggedIn,
  isAuthor,
  catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campground')
  })
)

module.exports = router
