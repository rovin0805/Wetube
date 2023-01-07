import Video from '../../models/Video';
import User from '../../models/User';

export const getUpload = (req, res) =>
  res.render('upload', { pageTitle: 'Upload Video' });

export const postUpload = async (req, res) => {
  try {
    const {
      session: {
        user: { _id },
      },
      file: { path },
      body: { title, description, hashtags },
    } = req;
    const videoObj = {
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
      fileUrl: path,
      owner: _id,
    };

    // const video = new Video(videoObj);
    // await video.save();
    const newVideo = await Video.create(videoObj);
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    await user.save();

    return res.redirect('/');
  } catch (err) {
    return res.status(400).render('upload', {
      pageTitle: 'Upload Video',
      error: err._message,
    });
  }
};
