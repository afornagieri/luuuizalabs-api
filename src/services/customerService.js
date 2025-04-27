const customerRepository = require('../repositories/customerRepository');
const { BadRequestError } = require('../utils/customErrorHandler');

async function getCustomersAsync() {
  return await customerRepository.getAll();
}

async function createCustomerAsync(data) {
  const { name, email, favorite_products } = data;

  if (!name || !email) {
    throw new BadRequestError('Name and email are required');
  }

  if (favorite_products && (!Array.isArray(favorite_products) || !favorite_products.every(Number.isInteger))) {
    throw new BadRequestError('favorite_products must be an array of integers');
  }

  return await customerRepository.create({ name, email, favorite_products });
}

async function updateCustomerAsync(id, data) {
  if (data.favorite_products && (!Array.isArray(data.favorite_products) || !data.favorite_products.every(Number.isInteger))) {
    throw new BadRequestError('favorite_products must be an array of integers');
  }

  return await customerRepository.update(id, data);
}

async function deleteCustomerAsync(id) {
  return await customerRepository.remove(id);
}

module.exports = {
  getCustomersAsync,
  createCustomerAsync,
  updateCustomerAsync,
  deleteCustomerAsync
};
