const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const Campground = require('./models/campground')
const methodOverride = require('method-override')
const ejsMate = require('ejs-mate')
const catchAsync = require('./utils/cathcAsync.js')
const ExpressError = require('./utils/ExpressError')
const cathcAsync = require('./utils/cathcAsync.js')
const Review = require('./models/reviews')

const session = require('express-session')
const flash = require('connect-flash')

const campground = require('./routes/campground')
const review = require('./routes/reviews')

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
      useFindAndModify: false,
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

const sessionConfig = {
  secret: 'This is a top secret',
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
}
app.use(session(sessionConfig))
app.use(flash())

app.use((req, res, next) => {
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})

app.get('/', (req, res) => {
  //res.send('Hello!Welcome to Yelp-Camp')
  res.render('home.ejs')
})

app.use('/campground', campground)
app.use('/campground/:id/review', review)
app.use(express.static(path.join(__dirname, 'public')))

// app.get('/dogs', (req, res) => {
//   chicken.fly()
// })

// app.all('*', (req, res, next) => {
//   next(new ExpressError());
// })

app.use((err, req, res, next) => {
  const { message = 'Error occured', statusCode = '500' } = err
  res.status(statusCode).render('error.ejs', { err })
  console.log(err)
})

app.listen(3005, () => {
  console.log('Hello ! welcome to Yelp-Camp')
})
