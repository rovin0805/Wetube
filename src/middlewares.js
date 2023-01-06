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
    res.redirect('/login');
  }
};

export const publicOnlyMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    res.redirect('/');
  } else {
    next();
  }
};

export const uploadFiles = multer({ dest: 'uploads/' });
