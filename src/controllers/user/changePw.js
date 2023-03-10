import User from '../../models/User';
import bcrypt from 'bcrypt';

export const getChangePassword = (req, res) => {
  if (req.session.socialOnly) {
    req.flash('error', "Can't change password.");
    return res.redirect('/');
  }
  res.render('user/change-password', { pageTitle: 'Change Password' });
};

export const postChangePassword = async (req, res) => {
  const {
    session: {
      user: { _id, password },
    },
    body: { oldPassword, newPassword, newPasswordConfirmation },
  } = req;

  const match = await bcrypt.compare(oldPassword, password);
  if (!match) {
    return res.status(400).render('user/change-password', {
      pageTitle: 'Change Password',
      error: 'The current password is incorrect.',
    });
  }

  if (newPassword !== newPasswordConfirmation) {
    return res.status(400).render('user/change-password', {
      pageTitle: 'Change Password',
      error: 'The new password dose not match the confirmation.',
    });
  }

  if (oldPassword === newPassword) {
    return res.status(400).render('user/change-password', {
      pageTitle: 'Change Password',
      error: 'The old password equals new password',
    });
  }

  const user = await User.findById(_id);
  user.password = newPassword;
  await user.save();

  req.session.destroy();
  req.flash('success', 'Changes saved.');
  return res.redirect('user/login');
};
