import User from '../models/User';
import bcrypt from 'bcrypt';

export const getJoin = (req, res) =>
  res.render('join', { pageTitle: 'Create Account' });

export const postJoin = async (req, res) => {
  try {
    const { email, username, password, password2, location } = req.body;

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

    await User.create({ email, username, password, location });
    res.redirect('/login');
  } catch (err) {
    return res.status(400).render('join', {
      pageTitle: 'Create Account',
      error: err._message,
    });
  }
};

export const getLogin = (req, res) =>
  res.render('login', { pageTitle: 'Log In' });

export const postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(400).render('login', {
        pageTitle: 'Log In',
        error: 'An account with this username does not exist',
      });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).render('login', {
        pageTitle: 'Log In',
        error: 'Wrong password',
      });
    }

    return res.redirect('/');
  } catch (err) {
    return res.status(400).render('login', {
      pageTitle: 'Log In',
      error: err._message,
    });
  }
};

export const edit = (req, res) => res.send('Edit User');

export const remove = (req, res) => res.send('Remove User');

export const logout = (req, res) => res.send('Log out');

export const see = (req, res) => res.send('See User');
