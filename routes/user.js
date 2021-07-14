const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/user')
//const catchAsync = require('../utils/cathcAsync.js')
const ExpressError = require('../utils/ExpressError')

const catchAsync = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next)
  }
}

router.get(
  '/register',
  catchAsync(async (req, res) => {
    res.render('user/register.ejs')
  })
)

router.post(
  '/register',
  catchAsync(async (req, res, next) => {
    try {
      const { username, email, password } = req.body
      const user = new User({ username, email })
      const regUser = await User.register(user, password)
      console.log(regUser)
      req.login(regUser, (err) => {
        if (err) {
          return next(err)
        }
        req.flash('success', 'Registration done')
        res.redirect('/campground')
      })
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('/register')
    }
  })
)

router.get('/login', (req, res) => {
  res.render('user/login.ejs')
})

router.post(
  '/login',
  passport.authenticate('local', {
    failureFlash: true,
    failureRedirect: '/login',
  }),
  (req, res) => {
    req.flash('success', 'welcome back!')
    const redirectUrl = req.session.returnTo || '/campground'
    delete req.session.returnTo
    res.redirect(redirectUrl)
  }
)

router.get('/logout', (req, res) => {
  req.logout()
  req.flash('success', 'Logged Out')
  res.redirect('/campground')
})

module.exports = router
