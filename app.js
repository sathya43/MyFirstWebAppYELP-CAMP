const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const Campground = require('./models/campground')
const methodOverride = require('method-override')

mongoose.set('returnOriginal', false)

const app = express()
app.use(express.urlencoded({ extended: true }))
app.use(methodOverride('_method'))

app.set('views engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))

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

app.get('/', (req, res) => {
  //res.send('Hello!Welcome to Yelp-Camp')
  res.render('home.ejs')
})

app.get('/campground', async (req, res) => {
  const campgrounds = await Campground.find({})
  res.render('campground/index.ejs', { campgrounds })
})

app.get('/campground/new', (req, res) => {
  //res.send('Create new campground')
  res.render('newCamp.ejs')
})

app.post('/campground', async (req, res) => {
  //res.send(req.body)
  const camp = new Campground(req.body.campground)
  await camp.save()
  res.redirect(`/campground/${camp.id}`)
})

app.get('/campground/:id', async (req, res) => {
  const camp = await Campground.findById(req.params.id)
  res.render('campground/show.ejs', { camp })
})

app.put('/campground/:id', async (req, res) => {
  const { id } = req.params
  const camp = await Campground.findByIdAndUpdate(id, {
    ...req.body.campground,
  })

  res.redirect(`/campground/${camp.id}`)
})

app.get('/campground/:id/edit', async (req, res) => {
  const camp = await Campground.findById(req.params.id)
  res.render('editC.ejs', { camp })
})

app.delete('/campground/:id', async (req, res) => {
  const { id } = req.params
  await Campground.findByIdAndDelete(id)
  res.redirect('/campground')
})

app.listen(3001, () => {
  console.log('Hello ! welcome to Yelp-Camp')
})
