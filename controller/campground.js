// module.exports.
const Campground = require('../models/campground')
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campground/index.ejs', { campgrounds })
}

module.exports.renderNewForm = (req, res) => {
  //res.send('Create new campground')

  res.render('newCamp.ejs')
}

module.exports.createCampground = async (req, res) => {
  // //res.send(req.body)
  // if (!req.body.campground)
  //   throw new ExpressError('Invalid Campground Data', 400
  const camp = new Campground(req.body.campground)
  camp.author = req.user._id
  await camp.save()
  req.flash('success', 'Successfully created a new Campground')
  res.redirect(`/campground/${camp.id}`)
}

module.exports.showCampground = async (req, res) => {
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
}

module.exports.updateCampground = async (req, res) => {
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
}

module.exports.editCampground = async (req, res) => {
  const camp = await Campground.findById(req.params.id)
  if (!camp) {
    req.flash('error', 'Cannot find the campground')
    return res.redirect('/campground')
  }
  res.render('editC.ejs', { camp })
}

module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params
  await Campground.findByIdAndDelete(id)
  res.redirect('/campground')
}