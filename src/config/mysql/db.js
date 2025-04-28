const { createPool } = require('mysql2/promise');
const { InternalServerError } = require('../../utils/customErrorHandler.js');

let db;
const WAIT_FOR_CONNECTIONS = true;
const CONNECTION_LIMIT = 10;
const QUEUE_LIMIT = 0;

try {
  db = createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.MYSQL_ROOT_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: WAIT_FOR_CONNECTIONS,
    connectionLimit: CONNECTION_LIMIT,
    queueLimit: QUEUE_LIMIT
  });
} catch (error) {
  throw new InternalServerError('Failed to initialize database connection pool');
}

module.exports = db;
