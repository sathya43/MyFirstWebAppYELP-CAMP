// if (process.env.NODE_ENV !== 'production') {
//   require('dotenv').config()
// }
require('dotenv').config()

// mongodb+srv://dogesathya:<password>@yelp-cluster.ox1n9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority

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
const mongoSanitize = require('express-mongo-sanitize')
const helmet = require('helmet')

mongoose.set('useNewUrlParser', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useCreateIndex', true)

const session = require('express-session')
const flash = require('connect-flash')

const MongoStore = require('connect-mongo')
console.log(MongoStore)

const campgroundRoute = require('./routes/campground')
const reviewRoute = require('./routes/reviews')
const userRoute = require('./routes/user')

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.set('views engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

app.engine('ejs', ejsMate)

//const dbUrl = process.env.DB_URL
const dbUrl = process.env.DB_URL || 'mongodb://localhost:27017/yelp-camp'

const conectionvar = catchAsync(async () => {
  await mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
})
conectionvar()

// mongoose.connect(dbUrl, {
//   useNewUrlParser: true,
//   useCreateIndex: true,
//   useUnifiedTopology: true,
//   useFindAndModify: false,
// })

const db = mongoose.connection
db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
  console.log('DataBase Connected')
})

// const store = new MongoDBStore({
//   url: dbUrl,
// secret: 'ThisIsAsecret',
// touchAfter: 24 * 60 * 60,
// })

const secret = process.env.SECRET || 'thisshouldbeabettersecret!'

const sessionConfig = {
  name: 'session',
  secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
    // secure: true,
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
  },
  store: MongoStore.create({
    secret,
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
  }),
}
app.use(session(sessionConfig))
app.use(flash())
app.use(helmet())

const scriptSrcUrls = [
  'https://stackpath.bootstrapcdn.com/',

  'https://api.tiles.mapbox.com/',
  'https://api.mapbox.com/',
  'https://kit.fontawesome.com/',
  'https://cdnjs.cloudflare.com/',
  'https://cdn.jsdelivr.net',
  'https://cdn.jsdelivr.net/npm/',
]
const styleSrcUrls = [
  'https://kit-free.fontawesome.com/',
  'https://stackpath.bootstrapcdn.com/',
  'https://api.mapbox.com/',
  'https://api.tiles.mapbox.com/',
  'https://fonts.googleapis.com/',
  'https://use.fontawesome.com/',
  'https://cdn.jsdelivr.net/npm/',
]
const connectSrcUrls = [
  'https://api.mapbox.com/',
  'https://a.tiles.mapbox.com/',
  'https://b.tiles.mapbox.com/',
  'https://events.mapbox.com/',
]
const fontSrcUrls = []
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      defaultSrc: [],
      connectSrc: ["'self'", ...connectSrcUrls],
      scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
      styleSrc: ["'unsafe-inline'", "'self'", ...styleSrcUrls],
      workerSrc: ["'self'", 'blob:'],
      objectSrc: [],
      imgSrc: [
        "'self'",
        'blob:',
        'data:',
        'https://res.cloudinary.com/dogesathya/', //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
        'https://images.unsplash.com/',
      ],
      fontSrc: ["'self'", ...fontSrcUrls],
    },
  })
)

app.use(passport.initialize())
app.use(passport.session())
passport.use(new LocalStrategy(User.authenticate()))
app.use(mongoSanitize())

passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req, res, next) => {
  // console.log(req.session)
  // if (!['/login', '/register', '/'].includes(req.originalUrl)) {
  //   console.log(req.originalUrl)
  //   req.session.returnTo = req.originalUrl
  // }
  // console.log(req.query)
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

const port = process.env.PORT || 3000
app.listen(3005, () => {
  console.log('Hello ! welcome to Yelp-Camp')
})
