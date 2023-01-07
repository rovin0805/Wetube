import express from 'express';
import { getJoin, getLogin, postJoin, postLogin } from '../controllers/user';
import { home, search } from '../controllers/video';
import { publicOnlyMiddleware } from '../middlewares';

const rootRouter = express.Router();

rootRouter.get('/', home);
rootRouter.route('/join').all(publicOnlyMiddleware).get(getJoin).post(postJoin);
rootRouter
  .route('/login')
  .all(publicOnlyMiddleware)
  .get(getLogin)
  .post(postLogin);
rootRouter.get('/search', search);

export default rootRouter;
