import express from 'express';
import { deleteVideo, edit, see, upload } from '../controllers/videoController';

const videoRouter = express.Router();

videoRouter.get('/upload', upload); //upload를 위에 쓴 이유 : respond 를 받아올때 /:id 의 변수 중 하나라고 인식하기 때문
videoRouter.get('/:id', see);
videoRouter.get('/:id/edit', edit);
videoRouter.get('/:id/delete', deleteVideo);

export default videoRouter;
