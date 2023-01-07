import Video from '../../models/Video';
import User from '../../models/User';

const deleteVideo = async (req, res) => {
  try {
    const {
      params: { id: videoId },
      session: {
        user: { _id: userId },
      },
    } = req;
    const video = await Video.findById(videoId);
    const user = await User.findById(userId);

    if (!video) {
      return res.status(404).render('404', { pageTitle: 'Video not found.' });
    }
    if (String(video.owner) !== userId) {
      return res.status(403).redirect('/');
    }

    await Video.findByIdAndDelete(videoId);
    user.videos.splice(user.videos.indexOf(videoId), 1);
    user.save();

    return res.redirect('/');
  } catch (err) {
    return res.send('Delete Error');
  }
};

export default deleteVideo;
