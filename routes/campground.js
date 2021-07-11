const express = require('express')
const router = express.Router({ mergeParams: true })

const catchAsync = require('../utils/cathcAsync.js')
const ExpressError = require('../utils/ExpressError')
const { campgroundSchema } = require('../schemas.js')
const Campground = require('../models/campground')

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

router.get('/new', (req, res) => {
  //res.send('Create new campground')
  res.render('newCamp.ejs')
})

router.post(
  '/',
  validateCampground,
  catchAsync(async (req, res, next) => {
    // //res.send(req.body)
    // if (!req.body.campground)
    //   throw new ExpressError('Invalid Campground Data', 400
    const camp = new Campground(req.body.campground)
    await camp.save()
    res.redirect(`/campground/${camp.id}`)
  })
)

router.get(
  '/:id',
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id).populate(
      'reviews'
    )
    res.render('campground/show.ejs', { campground })
  })
)

router.put(
  '/:id',
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    })

    res.redirect(`/campground/${camp.id}`)
  })
)

router.get(
  '/:id/edit',
  catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    res.render('editC.ejs', { camp })
  })
)

router.delete(
  '/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campground')
  })
)

module.exports = router