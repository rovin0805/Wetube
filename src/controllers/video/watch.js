import Video from '../../models/Video';

const watch = async (req, res) => {
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

export default watch;
