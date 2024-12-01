const jwt = require('jsonwebtoken');
exports.authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      status: 'fail',
      message: 'Unauthorized: Missing or malformed token',
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Giải mã token và gắn thông tin người dùng vào req.user
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    console.log('req.user:', JSON.stringify(req.user, null, 2));
    next(); // Tiếp tục xử lý middleware tiếp theo
  } catch (error) {
    console.error('JWT verification error:', error.message);

    // Phân loại lỗi JWT
    const message =
      error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';

    res.status(403).json({
      status: 'fail',
      message,
    });
  }
};

exports.authorize =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Forbidden: Access denied' });
    }
    next();
  };
