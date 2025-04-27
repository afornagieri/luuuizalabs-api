const redis = require('../config/redis/redis');
const { generateToken } = require('../utils/jwt');
const { BadRequestError } = require('../utils/customErrorHandler');

const login = async (req, res, next) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      throw new BadRequestError('Username and password are required');
    }

    if (username !== process.env.JWT_AUTH_USERNAME || password !== process.env.JWT_AUTH_PASSWORD) {
      throw new BadRequestError('Invalid username or password');
    }

    const existingToken = await redis.get(`token:${username}`);

    if (existingToken) {
      return res.status(200).json({
        message: 'Successful logged in, token already exists'
      });
    }

    const token = generateToken(username);

    await redis.setex(`token:${username}`, 900, token);

    return res.status(200).json({ message: 'Successful logged in', token, expiresIn: '15min' });
  } catch (error) {
    next(error);
  }
};

module.exports = { login };
