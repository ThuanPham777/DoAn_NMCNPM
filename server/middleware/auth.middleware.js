const { verifyToken } = require('../utils/jwt');
const authService = require('../app/user/services/auth.service');
const AppError = require('../utils/appError');

exports.protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  if (!token) return next(new AppError('Not logged in', 401));

  try {
    const decoded = await verifyToken(token);

    const user = await authService.getUserById(decoded.id);
    if (!user) return next(new AppError('User no longer exists', 401));

    req.user = user;
    next();
  } catch (err) {
    next(new AppError('Invalid or expired token', 401));
  }
};
