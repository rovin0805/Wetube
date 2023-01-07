import User from '../../models/User';

export const getEdit = (req, res) =>
  res.render('user/edit-profile', { pageTitle: 'Edit Profile' });

export const postEdit = async (req, res) => {
  try {
    const {
      session: {
        user: { _id, email: oldEmail, username: oldUsername, avatarUrl },
      },
      body: { email, username },
      file,
    } = req;

    let searchFilter = [];
    if (oldEmail !== email) {
      searchFilter.push({ email });
    }
    if (oldUsername !== username) {
      searchFilter.push({ username });
    }
    if (searchFilter.length > 0) {
      const foundUser = await User.find({ $or: searchFilter });
      if (foundUser && foundUser._id.toString() !== _id) {
        return res.status(400).render('user/edit-profile', {
          pageTitle: 'Edit Profile',
          error: 'This username/email is already taken.',
        });
      }
    }

    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { ...req.body, avatarUrl: file?.path || avatarUrl },
      {
        new: true,
      }
    );
    req.session.user = updatedUser;
    return res.redirect('/users/edit');
  } catch (err) {
    return res.send('Edit Video Error');
  }
};
