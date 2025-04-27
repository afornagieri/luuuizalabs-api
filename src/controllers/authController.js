const { generateToken } = require('../utils/jwt');
const { BadRequestError } = require('../utils/customErrorHandler');

const login = async (req, res, next) => {
  try {
    const { login, password } = req.body;

    if (!login || !password) {
      throw new BadRequestError('Login and password are required');
    }

    if (login !== process.env.JWT_AUTH_LOGIN || password !== process.env.JWT_AUTH_PASSWORD) {
      throw new BadRequestError('Invalid login or password');
    }

    const token = generateToken(login.concat(password));

    return res.status(200).json({ message: 'Login successful', token, expiresIn: '15min' });
  } catch (error) {
    next(error);
  }
};

module.exports = { login };
