import Video from '../../models/Video';

const home = async (req, res) => {
  try {
    // Video.find({}, (err, videos) =>
    //   res.render('home', { pageTitle: 'Home', videos })
    // );
    const videos = await Video.find({})
      .sort({ createdAt: 'desc' })
      .populate('owner');
    return res.render('home', { pageTitle: 'Home', videos });
  } catch (err) {
    return res.send('Server Error');
  }
};

export default home;
