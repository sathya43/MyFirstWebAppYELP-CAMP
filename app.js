if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

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
const passport = require('passport')
const LocalStrategy = require('passport-local')
const User = require('./models/user')

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const session = require('express-session')
const flash = require('connect-flash')

const campgroundRoute = require('./routes/campground')
const reviewRoute = require('./routes/reviews')
const userRoute = require('./routes/user')

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

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  // console.log(req.session)
  // if (!['/login', '/register', '/'].includes(req.originalUrl)) {
  //   console.log(req.originalUrl)
  //   req.session.returnTo = req.originalUrl
  // }
  res.locals.isSignedInUser = req.user
  res.locals.success = req.flash('success')
  res.locals.error = req.flash('error')
  next()
})

// app.get('/fake', async (req, res) => {
//   const user = new User({
//     email: 'satdjasdaskdadhakj@gmail.com',
//     username: 'abcxyasdadadz',
//   })
//   const newUser = await User.register(user, 'chidasdascken')
//   res.render(newUser)
// })

app.get('/', (req, res) => {
  //res.send('Hello!Welcome to Yelp-Camp')
  res.render('home.ejs')
})

app.use('/campground', campgroundRoute)
app.use('/campground/:id/review', reviewRoute)
app.use('/', userRoute)
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

app.listen(3001, () => {
  console.log('Hello ! welcome to Yelp-Camp')
})
