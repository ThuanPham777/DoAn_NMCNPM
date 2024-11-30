const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const db = require('../../../config/db');
require('dotenv').config();

exports.signup = async (req, res) => {
  const { username, email, password, passwordConfirm } = req.body;

  if (!username || !email || !password || !passwordConfirm) {
    return res.status(400).json({ message: 'All fields are required' });
  }
  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ message: 'Invalid email format' });
  }

  // Kiểm tra password và passwordConfirm có khớp không
  if (password !== passwordConfirm) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  let pool;
  try {
    // Kết nối đến cơ sở dữ liệu
    pool = await db();

    // Kiểm tra email đã tồn tại chưa
    const checkUser = await pool
      .request()
      .input('email', email)
      .query('SELECT * FROM [User] WHERE Email = @email');

    if (checkUser.recordset.length > 0) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    // Mã hóa mật khẩu
    const hashedPassword = await bcrypt.hash(password, 10);

    // Gọi stored procedure để thêm người dùng
    await pool
      .request()
      .input('UserName', username)
      .input('Email', email)
      .input('Password', hashedPassword)
      .input('Role', 'Guest')
      .execute('insertUser'); // Gọi stored procedure

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    console.error('Error during signup:', err);
    res.status(500).json({ message: 'Internal server error' });
  } finally {
    if (pool) await pool.close();
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  // Kiểm tra dữ liệu đầu vào
  if (!email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  let pool;
  try {
    // Kết nối database
    pool = await db();

    // Gọi stored procedure `login`
    const result = await pool
      .request()
      .input('Email', email)
      .input('Password', password) // Gửi mật khẩu gốc (stored procedure xử lý)
      .execute('login');

    // Lấy kết quả trả về từ stored procedure
    const recordset = result.recordset;

    if (recordset.length === 0 || recordset[0].ErrorMessage) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Lấy thông tin người dùng nếu login thành công
    const user = result.recordset[0]; // Lấy thông tin người dùng
    const isPasswordValid = await bcrypt.compare(password, user.Password); // Kiểm tra mật khẩu

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
