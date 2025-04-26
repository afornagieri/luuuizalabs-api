import { createPool } from 'mysql2/promise';

const db = createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASS || '123456',
  database: process.env.DB_NAME || 'aiqfome'
});

export default db;
