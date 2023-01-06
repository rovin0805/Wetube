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
} from '../controllers/userController';
import { protectorMiddleware, publicOnlyMiddleware } from '../middlewares';

const userRouter = express.Router();

userRouter.get('/logout', protectorMiddleware, logout);
userRouter.route('/edit').all(protectorMiddleware).get(getEdit).post(postEdit);
userRouter
  .route('/change-password')
  .all(protectorMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get(':id', see);
userRouter.get('/auth/github', publicOnlyMiddleware, startGithubLogin);
userRouter.get(
  '/auth/github/callback',
  publicOnlyMiddleware,
  finishGithubLogin
);

export default userRouter;
