const customerController = require('../../src/controllers/customerController.js');
const customerService = require('../../src/services/customerService.js');

jest.mock('../../src/config/redis/redis.js', () => ({
  get: jest.fn(),
  setex: jest.fn()
}));
  
jest.mock('../../src/services/customerService');

describe('Customer Controller', () => {
  let req, res, next;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    next = jest.fn();
  });

  describe('getCustomers', () => {
    it('should return an array containing customers', async () => {
      const fakeCustomers = [{ id: 1, name: 'John Doe', email: 'johndoe@example.com', favorite_products: [] }];
      customerService.getCustomersAsync.mockResolvedValue(fakeCustomers);

      await customerController.getCustomers(req, res, next);

      expect(res.json).toHaveBeenCalledWith(fakeCustomers);
    });

    it('should call next with error in case of failure', async () => {
      const error = new Error('Error');
      customerService.getCustomersAsync.mockRejectedValue(error);

      await customerController.getCustomers(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('createCustomer', () => {
    it('should create a new customer and return status code 201', async () => {
      const newCustomer = { id: 1, name: 'Jane Doe', email: 'jane@example.com', favorite_products: [] };
      req.body = { name: 'Jane Doe', email: 'jane@example.com', favorite_products: [] };
      customerService.createCustomerAsync.mockResolvedValue(newCustomer);

      await customerController.createCustomer(req, res, next);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.json).toHaveBeenCalledWith(newCustomer);
    });

    it('should call next with error in case of failure', async () => {
      const error = new Error('Error');
      req.body = { name: 'Jane Doe', email: 'jane@example.com', favorite_products: [] };
      customerService.createCustomerAsync.mockRejectedValue(error);

      await customerController.createCustomer(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('updateCustomer', () => {
    it('should update an customer an return the updated customer', async () => {
      const updatedCustomer = { id: 1, name: 'Jane Smith', email: 'jane@example.com', favorite_products: [] };
      req.params = { id: '1' };
      req.body = { name: 'Jane Smith', email: 'jane@example.com', favorite_products: [] };
      customerService.updateCustomerAsync.mockResolvedValue(updatedCustomer);

      await customerController.updateCustomer(req, res, next);

      expect(res.json).toHaveBeenCalledWith(updatedCustomer);
    });

    it('should call next with error in case of failure', async () => {
      const error = new Error('Error');
      req.params = { id: '1' };
      req.body = { name: 'Jane Smith', email: 'jane@example.com', favorite_products: [] };
      customerService.updateCustomerAsync.mockRejectedValue(error);

      await customerController.updateCustomer(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });

  describe('deleteCustomer', () => {
    it('should delete an customer an return a success message', async () => {
      const deleteResult = { message: 'Customer deleted successfully' };
      req.params = { id: '1' };
      customerService.deleteCustomerAsync.mockResolvedValue(deleteResult);

      await customerController.deleteCustomer(req, res, next);

      expect(res.json).toHaveBeenCalledWith(deleteResult);
    });

    it('should call next with error in case of failure', async () => {
      const error = new Error('Error');
      req.params = { id: '1' };
      customerService.deleteCustomerAsync.mockRejectedValue(error);

      await customerController.deleteCustomer(req, res, next);

      expect(next).toHaveBeenCalledWith(error);
    });
  });
});
