const { createPool } = require('mysql2/promise');
const { InternalServerError } = require('../../utils/customErrorHandler.js');

let db;

try {
  db = createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASS || '123456',
    database: process.env.DB_NAME || 'aiqfome',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });
} catch (error) {
  throw new InternalServerError('Failed to initialize database connection pool');
}

module.exports = db;
