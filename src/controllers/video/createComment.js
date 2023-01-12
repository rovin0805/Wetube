import Video from '../../models/Video';
import Comment from '../../models/Comment';

const createComment = async (req, res) => {
  const {
    params: { id: videoId },
    body: { text },
    session: { user },
  } = req;

  const video = await Video.findById(videoId);
  if (!video) {
    return res.sendStatus(404);
  }

  await Comment.create({
    text,
    owner: user._id,
    video: videoId,
  });

  return res.sendStatus(201);
};

export default createComment;
