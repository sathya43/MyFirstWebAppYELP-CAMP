const User = require('../models/user')

module.exports.renderRegistrationForm = async (req, res) => {
  res.render('user/register.ejs')
}

module.exports.register = async (req, res, next) => {
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
}

module.exports.renderLoginForm = (req, res) => {
  res.render('user/login.ejs')
}

module.exports.login = (req, res) => {
  req.flash('success', 'welcome back!')
  const redirectUrl = req.session.returnTo || '/campground'
  delete req.session.returnTo
  res.redirect(redirectUrl)
}

module.exports.logout = (req, res) => {
  req.logout()
  req.flash('success', 'Logged Out')
  res.redirect('/campground')
}
