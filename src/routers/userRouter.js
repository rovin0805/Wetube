import express from 'express';
import {
  logout,
  see,
  startGithubLogin,
  finishGithubLogin,
  getEdit,
  postEdit,
  getChangePassword,
  postChangePassword,
} from '../controllers/user';
import {
  protectorMiddleware,
  publicOnlyMiddleware,
  avatarUpload,
  s3DeleteAvatarMiddleware,
} from '../middlewares';

const userRouter = express.Router();

userRouter.get('/logout', protectorMiddleware, logout);
userRouter
  .route('/edit')
  .all(protectorMiddleware)
  .get(getEdit)
  .post(s3DeleteAvatarMiddleware, avatarUpload.single('avatar'), postEdit);
userRouter
  .route('/change-password')
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get('/:id', see);
userRouter.get('/auth/github', publicOnlyMiddleware, startGithubLogin);
userRouter.get(
  '/auth/github/callback',
  publicOnlyMiddleware,
  finishGithubLogin
);

export default userRouter;
