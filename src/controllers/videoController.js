import Video from '../models/Video';

export const home = async (req, res) => {
  try {
    // Video.find({}, (err, videos) =>
    //   res.render('home', { pageTitle: 'Home', videos })
    // );
    const videos = await Video.find({}).sort({ createdAt: 'desc' });
    return res.render('home', { pageTitle: 'Home', videos });
  } catch (err) {
    return res.send('Server Error');
  }
};

export const watch = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (video) {
      return res.render('watch', { pageTitle: video.title, video });
    } else {
      return res
        .status(404)
        .render('404', { pageTitle: 'Video Not Found 404' });
    }
  } catch (err) {
    return res.send('Watch Video Error');
  }
};

export const getEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const video = await Video.findById(id);
    if (!video) {
      return res
        .status(404)
        .render('404', { pageTitle: 'Video Not Found 404' });
    }
    return res.render('edit', { pageTitle: `Edit : ${video.title} `, video });
  } catch (err) {
    return res.send('Edit Video Error');
  }
};

export const postEdit = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, hashtags } = req.body;
    const video = await Video.exists({ _id: id });
    if (!video) {
      return res
        .status(404)
        .render('404', { pageTitle: 'Video Not Found 404' });
    }
    await Video.findByIdAndUpdate(id, {
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect(`/videos/${id}`);
  } catch (err) {
    return res.send('Update Error');
  }
};

export const getUpload = (req, res) =>
  res.render('upload', { pageTitle: 'Upload Video' });

export const postUpload = async (req, res) => {
  try {
    const file = req.file;
    const { title, description, hashtags } = req.body;
    const videoObj = {
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
      fileUrl: file?.path,
    };

    // const video = new Video(videoObj);
    // await video.save();
    await Video.create(videoObj);
    return res.redirect('/');
  } catch (err) {
    return res.status(400).render('upload', {
      pageTitle: 'Upload Video',
      error: err._message,
    });
  }
};

export const deleteVideo = async (req, res) => {
  try {
    const { id } = req.params;
    await Video.findByIdAndDelete(id);
    return res.redirect('/');
  } catch (err) {
    return res.send('Delete Error');
  }
};

export const search = async (req, res) => {
  try {
    const { keyword } = req.query;
    let videos = [];
    if (keyword) {
      videos = await Video.find({
        title: {
          $regex: new RegExp(keyword, 'i'),
        },
      });
    }
    return res.render('search', { pageTitle: 'Search', videos });
  } catch (err) {
    return res.send('Search Error');
  }
};
