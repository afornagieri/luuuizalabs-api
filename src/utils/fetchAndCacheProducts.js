const redisClient = require('../config/redis/redis.js');
const { InternalServerError } = require('./customErrorHandler.js');

const PRODUCT_EXPIRATION_SECONDS = 82800;

async function fetchAndCacheProducts() {
  try {
    const cached = await redisClient.get('products');

    if (cached) {
      return JSON.parse(cached);
    }

    const response = await fetch(process.env.FAKE_STORE_API_BASE_URL);
    if (!response.ok) {
      throw new Error('Failed to fetch products from API');
    }

    const products = await response.json();

    await redisClient.setex(
      'products',
      PRODUCT_EXPIRATION_SECONDS,
      JSON.stringify(products)
    );

    return products;
  } catch (error) {
    console.error('Error fetching and caching products:', error);
    throw new InternalServerError('Failed to fetch products');
  }
}

module.exports = {
  fetchAndCacheProducts
};
