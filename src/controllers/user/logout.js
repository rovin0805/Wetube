const logout = (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};

export default logout;
