const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/cathcAsync.js')
const ExpressError = require('./utils/ExpressError')
const { campgroundSchema } = require('./schemas.js')

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.set('views engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.engine('ejs', ejsMate)

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

const validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body)
  if (error) {
    const msg = error.details.map((el) => el.message).join(',')
    throw new ExpressError(msg, 400)
  } else {
    next()
  }
}

app.get('/', (req, res) => {
  //res.send('Hello!Welcome to Yelp-Camp')
  res.render('home.ejs')
})

app.get(
  '/campground',
  catchAsync(async (req, res) => {
    const campgrounds = await Campground.find({})
    res.render('campground/index.ejs', { campgrounds })
  })
)

app.get('/campground/new', (req, res) => {
  //res.send('Create new campground')
  res.render('newCamp.ejs')
})

app.post(
  '/campground',
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

app.get(
  '/campground/:id',
  catchAsync(async (req, res) => {
    const campground = await Campground.findById(req.params.id)
    res.render('campground/show.ejs', { campground })
  })
)

app.put(
  '/campground/:id',
  validateCampground,
  catchAsync(async (req, res) => {
    const { id } = req.params
    const camp = await Campground.findByIdAndUpdate(id, {
      ...req.body.campground,
    })

    res.redirect(`/campground/${camp.id}`)
  })
)

app.get(
  '/campground/:id/edit',
  catchAsync(async (req, res) => {
    const camp = await Campground.findById(req.params.id)
    res.render('editC.ejs', { camp })
  })
)

app.delete(
  '/campground/:id',
  catchAsync(async (req, res) => {
    const { id } = req.params
    await Campground.findByIdAndDelete(id)
    res.redirect('/campground')
  })
)

app.get('/dogs', (req, res) => {
  chicken.fly()
})

app.all('*', (req, res, next) => {
  next(new ExpressError())
})

app.use((err, req, res, next) => {
  const { message = 'Error occured', statusCode = '500' } = err
  res.status(statusCode).render('error.ejs', { err })
  console.log('error')
})

app.listen(8005, () => {
  console.log('Hello ! welcome to Yelp-Camp')
})
