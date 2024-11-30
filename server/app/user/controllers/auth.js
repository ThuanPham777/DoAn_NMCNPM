const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../../config/db');
require('dotenv').config();

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
    const user = result.recordset[0]; // User data will be returned here

    if (!user) {
      return res
        .status(400)
        .json({ message: 'Failed to retrieve user information' });
    }

    res.status(201).json({ message: 'User created successfully', user });
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
    // Kết nối đến database
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

    // Tạo JWT token
    const token = jwt.sign(
      { userId: user.UserID, role: user.Role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    // Trả về phản hồi thành công
    res.json({
      message: 'Logged in successfully',
      token,
      user: {
        id: user.UserID,
        name: user.UserName,
        email: user.Email,
        role: user.Role,
      },
    });
  } catch (err) {
    console.error('Error during login:', err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (pool) await pool.close(); // Đảm bảo kết nối được đóng
  }
};

exports.getUserInfo = async (req, res) => {
  const { userId } = req.user; // Lấy userId từ token

  let pool;
  try {
    // Kết nối đến cơ sở dữ liệu
    pool = await db();

    // Truy vấn để lấy thông tin người dùng
    const result = await pool
      .request()
      .input('UserID', userId)
      .query(
        'SELECT UserID, UserName, Email, Role FROM [User] WHERE UserID = @UserID'
      );

    const user = result.recordset[0]; // Lấy thông tin người dùng từ DB

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user); // Trả về thông tin người dùng
  } catch (err) {
    console.error('Error fetching user info:', err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (pool) await pool.close(); // Đảm bảo đóng kết nối
  }
};
