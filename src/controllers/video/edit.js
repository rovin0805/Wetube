import Video from '../../models/Video';

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
