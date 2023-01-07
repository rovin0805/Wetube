import User from '../../models/User';
import bcrypt from 'bcrypt';

export const getLogin = (req, res) =>
  res.render('login', { pageTitle: 'Log In' });

export const postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username, socialOnly: false });

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

    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect('/');
  } catch (err) {
    return res.status(400).render('login', {
      pageTitle: 'Log In',
      error: err._message,
    });
  }
};
