import Video from '../models/Video';

export const home = async (req, res) => {
  // Video.find({}, (err, videos) =>
  //   res.render('home', { pageTitle: 'Home', videos })
  // );
  try {
    const videos = await Video.find({});
    return res.render('home', { pageTitle: 'Home', videos });
  } catch (err) {
    return res.render('Server Error');
  }
};

export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  return res.render('watch', { pageTitle: video.title, video });
};

export const getEdit = (req, res) => {
  const { id } = req.params;
  return res.render('edit', { pageTitle: `Editing: ` });
};

export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render('upload', { pageTitle: 'Upload Video' });
};

export const postUpload = async (req, res) => {
  const { title, description, hashtags } = req.body;
  const videoObj = {
    title,
    description,
    hashtags: hashtags
      .split(',')
      .map((word) =>
        word.trim().startsWith('#') ? word.trim() : `#${word.trim()}`
      ),
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
