import db from '../config/db.js';

export async function getAll() {
  const [rows] = await db.execute('SELECT id, name, email, favorite_products FROM customers');
  return rows;
}
