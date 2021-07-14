const isLoggedIn = (req, res, next) => {
  //console.log(req.user)
  if (!req.isAuthenticated()) {
    req.session.returnTo = req.originalUrl
    req.flash('error', 'You must be logged in')
    return res.redirect('/login')
  }
  next()
}

module.exports = isLoggedIn
