import multer from 'multer';

export const localMiddleware = (req, res, next) => {
  res.locals.loggedIn = !!req.session.loggedIn;
  res.locals.user = req.session.user || {};
  res.locals.siteName = 'Wetube';
  next();
};

export const protectorMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    req.flash('error', 'Log in first');
    res.redirect('/login');
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    req.flash('error', 'Not authorized');
    res.redirect('/');
  } else {
    next();
  }
};

export const avatarUpload = multer({
  dest: 'uploads/avatars/',
  limits: { fileSize: 3000000 },
});
export const videoUpload = multer({
  dest: 'uploads/videos/',
  limits: { fieldSize: 100000000 },
});
