import express from 'express';
import {
  logout,
  see,
  startGithubLogin,
  finishGithubLogin,
  getEdit,
  postEdit,
} from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/logout', logout);
userRouter.route('/edit').get(getEdit).post(postEdit);
userRouter.get(':id', see);
userRouter.get('/auth/github', startGithubLogin);
userRouter.get('/auth/github/callback', finishGithubLogin);

export default userRouter;
