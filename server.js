require('dotenv').config();
const app = require('./src/app.js');
const db = require('./src/config/mysql/db.js');
const redis = require('./src/config/redis/redis.js');

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
    app.listen(PORT, () => {
      console.info(`Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error('Failed to connect to external services:', error);
    process.exit(1);
  }
}

startServer();