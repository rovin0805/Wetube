import Video from '../models/Video';

export const home = async (req, res) => {
  // Video.find({}, (err, videos) =>
  //   res.render('home', { pageTitle: 'Home', videos })
  // );
  try {
    const videos = await Video.find({}).sort({ createdAt: 'desc' });
    return res.render('home', { pageTitle: 'Home', videos });
  } catch (err) {
    return res.render('Server Error');
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (video) {
    return res.render('watch', { pageTitle: video.title, video });
  } else {
    return res.render('404', { pageTitle: 'Video Not Found 404' });
  }
};

export const getEdit = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.render('404', { pageTitle: 'Video Not Found 404' });
  }
  return res.render('edit', { pageTitle: `Edit : ${video.title} `, video });
};

export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const video = await Video.exists({ _id: id });
  if (!video) {
    return res.render('404', { pageTitle: 'Video Not Found 404' });
  }
  try {
    await Video.findByIdAndUpdate(id, {
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect(`/videos/${id}`);
  } catch (err) {
    return res.render('Update Error');
  }
};

export const getUpload = (req, res) => {
  return res.render('upload', { pageTitle: 'Upload Video' });
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  const videoObj = {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  };

  try {
    // const video = new Video(videoObj);
    // await video.save();
    await Video.create(videoObj);
    return res.redirect('/');
  } catch (err) {
    return res.render('upload', {
      pageTitle: 'Upload Video',
      error: err._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  try {
    await Video.findByIdAndDelete(id);
    return res.redirect('/');
  } catch (err) {
    return res.render('Delete Error');
  }
};
