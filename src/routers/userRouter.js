import express from 'express';
import {
  remove,
  edit,
  logout,
  see,
  startGithubLogin,
  finishGithubLogin,
} from '../controllers/userController';

const userRouter = express.Router();

userRouter.get('/logout', logout);
userRouter.get('/edit', edit);
userRouter.get('/delete', remove);
userRouter.get(':id', see);
userRouter.get('/auth/github', startGithubLogin);
userRouter.get('/auth/github/callback', finishGithubLogin);

export default userRouter;
