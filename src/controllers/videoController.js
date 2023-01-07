import Video from '../models/Video';
import User from '../models/User';

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
    const video = await Video.findById(id).populate('owner');
    if (!video) {
      return res
        .status(404)
        .render('404', { pageTitle: 'Video Not Found 404' });
    }
    return res.render('watch', { pageTitle: video.title, video });
  } catch (err) {
    return res.send('Watch Video Error');
  }
};

export const getEdit = async (req, res) => {
  try {
    const {
      params: { id: videoId },
      session: {
        user: { _id: userId },
      },
    } = req;
    const video = await Video.findById(videoId);
    if (!video) {
      return res
        .status(404)
        .render('404', { pageTitle: 'Video Not Found 404' });
    }
    if (String(video.owner) !== userId) {
      return res.status(403).redirect('/');
    }
    return res.render('edit', { pageTitle: `Edit : ${video.title} `, video });
  } catch (err) {
    return res.send('Edit Video Error');
  }
};

export const postEdit = async (req, res) => {
  try {
    const {
      params: { id: videoId },
      body: { title, description, hashtags },
      session: {
        user: { _id: userId },
      },
    } = req;
    const video = await Video.findById(videoId);
    if (!video) {
      return res
        .status(404)
        .render('404', { pageTitle: 'Video Not Found 404' });
    }
    if (String(video.owner) !== userId) {
      return res.status(403).redirect('/');
    }
    await Video.findByIdAndUpdate(videoId, {
      title,
      description,
      hashtags: Video.formatHashtags(hashtags),
    });
    return res.redirect(`/videos/${videoId}`);
  } catch (err) {
    return res.send('Update Error');
  }
};

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

export const deleteVideo = async (req, res) => {
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
