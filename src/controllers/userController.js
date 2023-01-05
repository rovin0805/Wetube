import User from '../models/User';
import bcrypt from 'bcrypt';
import fetch from 'cross-fetch';

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

export const startGithubLogin = (req, res) => {
  const baseUrl = 'https://github.com/login/oauth/authorize';
  const config = {
    client_id: process.env.GITHUB_CLIENT_ID,
    allow_signup: false,
    scope: 'read:user user:email',
  };
  const params = new URLSearchParams(config).toString();
  return res.redirect(`${baseUrl}?${params}`);
};

export const finishGithubLogin = async (req, res) => {
  const baseUrl = 'https://github.com/login/oauth/access_token';
  const config = {
    client_id: process.env.GITHUB_CLIENT_ID,
    client_secret: process.env.GITHUB_CLIENT_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();

  const tokenRes = await (
    await fetch(`${baseUrl}?${params}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
      },
    })
  ).json();

  if ('access_token' in tokenRes) {
    const { access_token } = tokenRes;
    const GITHUB_API = 'https://api.github.com';

    const getGithubData = async (extraUrl = '') => {
      const url = `${GITHUB_API}/user`;
      return await (
        await fetch(url + extraUrl, {
          headers: {
            Authorization: `token ${access_token}`,
          },
        })
      ).json();
    };

    const [userRes, emailRes] = await Promise.all([
      getGithubData(),
      getGithubData('/emails'),
    ]);
    const emailObj = emailRes.find((email) => {
      return email?.primary && email?.verified;
    });
    if (!emailObj) {
      return res.redirect('/login');
    }

    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      user = await User.create({
        name: userRes.name,
        username: userRes.login,
        email: emailObj.email,
        password: '',
        socialOnly: true,
        location: userRes.location,
        avatarUrl: userRes.avatar_url,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    return res.redirect('/');
  } else {
    res.redirect('/login');
  }
};

export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect('/');
};

export const edit = (req, res) => res.send('Edit User');

export const see = (req, res) => res.send('See User');
