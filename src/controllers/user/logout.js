const logout = (req, res) => {
  req.flash('info', 'Bye Bye');
  req.session.user = null;
  res.locals.loggedInUser = req.session.user;
  req.session.loggedIn = false;
  return res.redirect('/');
};

export default logout;
