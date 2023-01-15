import Video from '../../models/Video';
import User from '../../models/User';

export const getUpload = (req, res) =>
  res.render('video/upload', { pageTitle: 'Upload Video' });

export const postUpload = async (req, res) => {
  try {
    const {
      session: {
        user: { _id },
      },
      files: { video, thumbnail },
      body: { title, description, hashtags },
    } = req;
    const videoObj = {
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
      fileUrl: video[0]?.location || video[0]?.path,
      thumbnailUrl: thumbnail[0]?.location || thumbnail[0]?.path,
      owner: _id,
    };

    // const video = new Video(videoObj);
    // await video.save();
    const newVideo = await Video.create(videoObj);
    const user = await User.findById(_id);
    user.videos.push(newVideo._id);
    await user.save();

    req.flash('success', 'Upload success.');
    return res.redirect('/');
  } catch (err) {
    return res.status(400).render('video/upload', {
      pageTitle: 'Upload Video',
      error: err._message,
    });
  }
};
