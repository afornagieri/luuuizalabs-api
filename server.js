const app = require('./src/app.js');
const db = require('./src/config/mysql/db.js');
const redis = require('./src/config/redis/redis.js');

require('dotenv').config();

async function startServer() {
  try {
    console.info('Connecting to MySQL...');
    const connection = await db.getConnection();
    console.info('Connected successfully!');
    connection.release();

    console.info('Connecting to Redis...');
    await redis.ping();
    console.info('Connected successfully!');

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, '0.0.0.0', () => {
      console.log(`Server running on http://0.0.0.0:${PORT}`);
    });

  } catch (error) {
    console.error('Failed to connect to external services:', error);
    process.exit(1);
  }
}

startServer();