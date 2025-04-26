const db = require('../config/db.js');

async function getAll() {
  const [rows] = await db.execute('SELECT id, name, email, favorite_products FROM customers');
  return rows;
}

module.exports = {
  getAll
}