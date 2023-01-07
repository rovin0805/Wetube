import Video from '../../models/Video';

const search = async (req, res) => {
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

export default search;
