const prisma = require('../../../prisma');
const bcrypt = require('bcryptjs');
const AppError = require('../../../utils/appError');
const { signToken } = require('../../../utils/jwt');

class AuthService {
  async signup({ username, email, password }) {
    // Check email exists
    const exists = await prisma.user.findUnique({ where: { Email: email } });
    if (exists) throw new AppError('Email already exists', 400);

    // Hash password
    const hashed = await bcrypt.hash(password, 10);

    // Create user
    const newUser = await prisma.user.create({
      data: {
        UserName: username,
        Email: email,
        Password: hashed,
        Role: 'Manager',
      },
    });

    // Generate token
    const token = signToken({ id: newUser.UserID });

    return { user: newUser, token };
  }

  async login({ email, password }) {
    const user = await prisma.user.findUnique({ where: { Email: email } });
    if (!user) throw new AppError('Invalid email or password', 401);

    const isValid = await bcrypt.compare(password, user.Password);
    if (!isValid) throw new AppError('Invalid email or password', 401);

    const token = signToken({ id: user.UserID });

    return { user, token };
  }

  async getUserById(id) {
    const user = await prisma.user.findUnique({
      where: { UserID: id },
      select: { UserID: true, UserName: true, Email: true, Role: true },
    });
    return user;
  }
}

module.exports = new AuthService();
