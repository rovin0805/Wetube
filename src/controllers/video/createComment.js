import Video from '../../models/Video';
import Comment from '../../models/Comment';
import User from '../../models/User';

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

  const foundUser = await User.findById({ _id: user._id }).populate('comments');
  if (!foundUser) {
    return res.sendStatus(404);
  }

  const comment = await Comment.create({
    text,
    owner: user._id,
    video: videoId,
  });

  video.comments.push(comment._id);
  video.save();
  foundUser.comments.push(comment._id);
  foundUser.save();

  return res.status(201).json({ newCommentId: comment._id });
};

export default createComment;
