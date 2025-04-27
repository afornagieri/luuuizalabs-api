const jwt = require('jsonwebtoken');
const redis = require('../config/redis/redis.js');
const { UnauthorizedError } = require('../utils/customErrorHandler.js');

async function authenticationMiddleware(req, _, next) {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const username = decoded.data;

    const storedToken = await redis.get(`token:${username}`);
    if (!storedToken || storedToken !== token) {
      throw new UnauthorizedError('Invalid or expired token');
    }

    next();
  } catch (err) {
    next(err);
  }
}

module.exports = authenticationMiddleware;
