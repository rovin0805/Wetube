import User from '../../models/User';

export const getJoin = (req, res) =>
  res.render('join', { pageTitle: 'Create Account' });

export const postJoin = async (req, res) => {
  try {
    const { email, name, username, password, password2, location } = req.body;

    if (password !== password2) {
      return res.status(400).render('join', {
        pageTitle: 'Create Account',
        error: 'Password confirmation does not match',
      });
    }

    const existingUser = await User.exists({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.status(400).render('join', {
        pageTitle: 'Create Account',
        error: 'The username or email is already taken',
      });
    }

    await User.create({ email, name, username, password, location });
    res.redirect('/login');
  } catch (err) {
    return res.status(400).render('join', {
      pageTitle: 'Create Account',
      error: err._message,
    });
  }
};
