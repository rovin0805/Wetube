import User from '../models/User';

export const getJoin = (req, res) =>
  res.render('join', { pageTitle: 'Create Account' });

export const postJoin = async (req, res) => {
  try {
    const { email, username, password, password2, location } = req.body;

    if (password !== password2) {
      return res.render('join', {
        pageTitle: 'Create Account',
        error: 'Password confirmation does not match',
      });
    }

    const existingUser = await User.exists({ $or: [{ email }, { username }] });
    if (existingUser) {
      return res.render('join', {
        pageTitle: 'Create Account',
        error: 'The username or email is already taken',
      });
    }

    await User.create({ email, username, password, location });
    res.redirect('/login');
  } catch (err) {
    res.send('Create Account Error');
  }
};

export const edit = (req, res) => res.send('Edit User');

export const remove = (req, res) => res.send('Remove User');

export const login = (req, res) => res.send('Login');

export const logout = (req, res) => res.send('Log out');

export const see = (req, res) => res.send('See User');
