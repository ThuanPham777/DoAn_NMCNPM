const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../../config/db');
const AppError = require('../../../utils/appError');
require('dotenv').config();

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user.UserID);

  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;

  // Send cookie to the client
  res.cookie('jwt', token, cookieOptions);

  // Remove password from output (not secure)
  user.Password = undefined;

  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user: {
        id: user.UserId,
        username: user.UserName,
        email: user.Email,
        role: user.Role,
      },
    },
  });
};

exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  let pool;
  try {
    pool = await db();

    // Check if email already exists
    const checkUser = await pool
      .request()
      .input('Email', email)
      .query('SELECT * FROM [User] WHERE Email = @Email');

    if (checkUser.recordset.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Call the insertUser stored procedure
    const result = await pool
      .request()
      .input('UserName', username)
      .input('Email', email)
      .input('Password', hashedPassword)
      .input('Role', 'Guest')
      .execute('insertUser');

    // Fetch the newly created user to include in the response
    const user = result.recordset[0];

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Failed to retrieve user information' });
    }

    // Sử dụng createSendToken để tạo và gửi token
    console.log('created:', JSON.stringify(user, null, 2));
    createSendToken(user, 201, res);
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (pool) await pool.close();
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  let pool;
  try {
    pool = await db();

    // Gọi stored procedure để lấy thông tin người dùng
    const result = await pool.request().input('Email', email).execute('login');

    if (result.recordset.length === 0) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const user = result.recordset[0];

    // So sánh mật khẩu người dùng nhập vào với mật khẩu đã mã hóa trong cơ sở dữ liệu
    const isPasswordValid = await bcrypt.compare(password, user.Password);

    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Sử dụng createSendToken để tạo và gửi token
    createSendToken(user, 200, res);
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (pool) await pool.close();
  }
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });
  res.status(200).json({ status: 'success' });
};

// Hàm kiểm tra người dùng tồn tại
const getUserById = async (userId) => {
  let pool;
  try {
    pool = await db(); // Kết nối đến cơ sở dữ liệu
    const result = await pool
      .request()
      .input('UserID', userId)
      .query('SELECT * FROM [User] WHERE UserID = @UserID');

    // Kiểm tra nếu không tìm thấy người dùng
    if (result.recordset.length === 0) {
      return null;
    }

    return result.recordset[0]; // Trả về người dùng nếu tồn tại
  } catch (err) {
    console.error('Error querying database:', err);
  } finally {
    if (pool) await pool.close();
  }
};

const verifyToken = (token) => {
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        reject(err);
      } else {
        resolve(decoded);
      }
    });
  });
};
// Middleware protect
exports.protect = async (req, res, next) => {
  // 1) Lấy token và kiểm tra nếu có
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  console.log('token: ' + token);

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access', 401)
    );
  }

  try {
    // 2) Giải mã token
    const decoded = await verifyToken(token);
    console.log(decoded); // Kiểm tra xem decoded có giá trị không

    // 3) Kiểm tra xem người dùng có tồn tại không
    const currentUser = await getUserById(decoded.id);

    if (!currentUser) {
      return next(
        new AppError('The user belonging to this token no longer exists.', 401)
      );
    }

    // 4) Gán người dùng vào req.user để tiếp tục xử lý
    req.user = currentUser;

    // Grant access to the protected route
    next();
  } catch (error) {
    console.error('JWT verification error:', error.message);
    return next(new AppError('Invalid or expired token.', 403));
  }
};

exports.getUserInfo = async (req, res) => {
  const { UserID } = req.user; // Lấy userId từ token (đã được gán trong middleware protect)
  console.log(UserID);

  let pool;
  try {
    // Kết nối đến cơ sở dữ liệu
    pool = await db();

    // Truy vấn để lấy thông tin người dùng
    const result = await pool
      .request()
      .input('UserID', UserID)
      .query(
        'SELECT UserID, UserName, Email, Role FROM [User] WHERE UserID = @UserID'
      );

    const user = result.recordset[0]; // Lấy thông tin người dùng từ DB

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user); // Trả về thông tin người dùng
    console.log(user);
  } catch (err) {
    console.error('Error fetching user info:', err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (pool) await pool.close(); // Đảm bảo đóng kết nối
  }
};
