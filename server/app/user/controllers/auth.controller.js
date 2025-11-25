const authService = require('../services/auth.service');

const sendToken = (res, statusCode, user, token) => {
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  res.cookie('jwt', token, cookieOptions);

  user.Password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    user,
  });
};

exports.signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    const { user, token } = await authService.signup({
      username,
      email,
      password,
    });

    sendToken(res, 201, user, token);
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const { user, token } = await authService.login({
      email,
      password,
    });

    sendToken(res, 200, user, token);
  } catch (err) {
    next(err);
  }
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'expired', {
    httpOnly: true,
    expires: new Date(Date.now() + 1000),
  });

  res.status(200).json({ message: 'Logged out' });
};

exports.getUserInfo = (req, res) => {
  res.json(req.user);
};
