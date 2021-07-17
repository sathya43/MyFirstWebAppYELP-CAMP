const express = require('express')
const passport = require('passport')
const router = express.Router()
const User = require('../models/user')
//const catchAsync = require('../utils/cathcAsync.js')
const ExpressError = require('../utils/ExpressError')
const userController = require('../controller/users')

const catchAsync = (func) => {
  return (req, res, next) => {
    func(req, res, next).catch(next)
  }
}

router
  .route('/register')
  .get(catchAsync(userController.renderRegistrationForm))
  .post(catchAsync(userController.register))

router
  .route('/login')
  .get(userController.renderLoginForm)
  .post(
    passport.authenticate('local', {
      failureFlash: true,
      failureRedirect: '/login',
    }),
    userController.login
  )

router.route('/logout').get(userController.logout)

module.exports = router
