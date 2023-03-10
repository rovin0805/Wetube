import User from '../../models/User';

const see = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).populate({
      path: 'videos',
      populate: {
        path: 'owner',
        model: 'User',
      },
    });
    if (!user) {
      return res.status(400).render('404', { pageTitle: 'User Not Found 404' });
    }
    return res.render('user/profile', {
      pageTitle: `${user.username}'s Profile`,
      user,
    });
  } catch (err) {}
};

export default see;
