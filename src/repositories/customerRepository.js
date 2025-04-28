const db = require('../config/mysql/db.js');
const { fetchAndCacheProducts } = require('../utils/fetchAndCacheProducts.js');
const {
  BadRequestError,
  NotFoundError
} = require('../utils/customErrorHandler.js');

async function getAll() {
  try {
    const [rows] = await db.query('SELECT * FROM customers');
    const products = await fetchAndCacheProducts();

    const customers = rows.map((customer) => {
      const favoriteProductIds = Array.isArray(customer.favorite_products) ? [...new Set(customer.favorite_products)] : [];

      const favoriteProducts = products.filter(product =>
        favoriteProductIds.includes(product.id)
      );

      return {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        favorite_products: favoriteProducts
      };
    });

    return customers;
  } catch (error) {
    throw error;
  }
}

async function create(customer) {
  const { name, email, favorite_products } = customer;

  try {
    const [existing] = await db.query('SELECT id FROM customers WHERE email = ?', [email]);
    if (existing.length > 0) {
      throw new BadRequestError('Email already registered');
    }

    let favoriteProductsJson;
    if (favorite_products !== undefined) {
      if (!Array.isArray(favorite_products) || !favorite_products.every(Number.isInteger)) {
        throw new BadRequestError('favorite_products must be an array of integers');
      }
      favoriteProductsJson = JSON.stringify([...new Set(favorite_products)]);
    }

    const [result] = await db.query(
      'INSERT INTO customers (name, email, favorite_products) VALUES (?, ?, ?)',
      [name, email, favoriteProductsJson]
    );

    return { id: result.insertId, name, email, favorite_products: JSON.parse(favoriteProductsJson) };
  } catch (error) {
    throw error;
  }
}

async function update(id, customer) {
  const { name, email, favorite_products } = customer;

  try {
    const [existing] = await db.query('SELECT id FROM customers WHERE id = ?', [id]);
    if (existing.length === 0) {
      throw new NotFoundError('Customer not found');
    }

    if (email) {
      const [emailCheck] = await db.query('SELECT id FROM customers WHERE email = ? AND id != ?', [email, id]);
      if (emailCheck.length > 0) {
        throw new BadRequestError('Email already registered to another customer');
      }
    }

    let favoriteProductsJson = null;
    if (favorite_products !== undefined) {
      if (!Array.isArray(favorite_products) || !favorite_products.every(Number.isInteger)) {
        throw new BadRequestError('favorite_products must be an array of integers');
      }
      favoriteProductsJson = JSON.stringify([...new Set(favorite_products)]);
    }

    const updateFields = [];
    const updateValues = [];

    if (name) {
      updateFields.push('name = ?');
      updateValues.push(name);
    }
    if (email) {
      updateFields.push('email = ?');
      updateValues.push(email);
    }
    if (favoriteProductsJson !== null) {
      updateFields.push('favorite_products = ?');
      updateValues.push(favoriteProductsJson);
    }

    if (updateFields.length === 0) {
      throw new BadRequestError('No fields to update');
    }

    updateValues.push(id);

    await db.query(
      `UPDATE customers SET ${updateFields.join(', ')} WHERE id = ?`,
      updateValues
    );

    const updatedCustomer = {
      id,
      name,
      email,
      favorite_products: favoriteProductsJson ? JSON.parse(favoriteProductsJson) : undefined
    };

    return updatedCustomer;
  } catch (error) {
    throw error;
  }
}

async function remove(id) {
  try {
    const [existing] = await db.query('SELECT id FROM customers WHERE id = ?', [id]);
    if (existing.length === 0) {
      throw new NotFoundError('Customer not found');
    }

    await db.query('DELETE FROM customers WHERE id = ?', [id]);
    return { message: 'Customer deleted successfully' };
  } catch (error) {
    throw error;
  }
}

module.exports = {
  getAll,
  create,
  update,
  remove
};
