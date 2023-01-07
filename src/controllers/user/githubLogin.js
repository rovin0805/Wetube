import fetch from 'cross-fetch';
import User from '../../models/User';

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
