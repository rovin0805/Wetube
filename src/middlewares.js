import multer from 'multer';
import multerS3 from 'multer-s3';
import { S3Client } from '@aws-sdk/client-s3';

const s3 = new S3Client({
  credentials: {
    accessKeyId: process.env.AWS_KEY_ID,
    secretAccessKey: process.env.AWS_ACCESS_KEY,
  },
  region: 'ap-northeast-1',
});

const multerStorage = multerS3({
  s3,
  bucket: 'wetube-ej',
  acl: 'public-read',
  key: function (req, file, cb) {
    cb(null, Date.now().toString());
  },
});

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
  storage: multerStorage,
});
export const videoUpload = multer({
  dest: 'uploads/videos/',
  limits: { fieldSize: 100000000 },
  storage: multerStorage,
});
