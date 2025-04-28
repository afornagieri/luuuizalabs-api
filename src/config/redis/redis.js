const Redis = require('ioredis');
const { InternalServerError } = require('../../utils/customErrorHandler.js');

let redis;

try {
  redis = new Redis({
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
    password: process.env.REDIS_PASSWORD || undefined,
  });

  redis.on('error', (err) => {
    console.error('Redis connection error:', err);
  });

} catch (err) {
  throw new InternalServerError('Failed to initialize Redis connection');
}

module.exports = redis;
