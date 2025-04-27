const customerService = require('../services/index.js');

async function getCustomers(_, res, next) {
  try {
    const result = await customerService.getCustomersAsync();
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

async function createCustomer(req, res, next) {
  try {
    const customer = req.body;
    const result = await customerService.createCustomerAsync(customer);
    return res.status(201).json(result);
  } catch (error) {
    next(error);
  }
}

async function updateCustomer(req, res, next) {
  try {
    const id = req.params.id;
    const customer = req.body;
    const result = await customerService.updateCustomerAsync(id, customer);
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

async function deleteCustomer(req, res, next) {
  try {
    const id = req.params.id;
    const result = await customerService.deleteCustomerAsync(id);
    return res.json(result);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer
};
