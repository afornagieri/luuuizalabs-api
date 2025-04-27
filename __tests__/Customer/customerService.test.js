const customerService = require('../../src/services/customerService.js');
const customerRepository = require('../../src/repositories/customerRepository.js');

jest.mock('../../src/config/redis/redis.js', () => ({
  get: jest.fn(),
  setex: jest.fn()
}));

jest.mock('../../src/repositories/customerRepository', () => ({
  getAll: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  remove: jest.fn(),
}));  

describe('Customer Service', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getCustomersAsync', () => {
    it('should return all customers', async () => {
      const fakeCustomers = [{ id: 1, name: 'John Doe', email: 'johndoe@example.com', favorite_products: [] }];
      customerRepository.getAll.mockResolvedValue(fakeCustomers);

      const result = await customerService.getCustomersAsync();

      expect(result).toEqual(fakeCustomers);
      expect(customerRepository.getAll).toHaveBeenCalledTimes(1);
    });

    it('Should thrown an error while trying to retrieve all customers from database', async () => {
      customerRepository.getAll.mockRejectedValue(new Error('DB error'));

      await expect(customerService.getCustomersAsync())
        .rejects
        .toThrow('DB error');
    });
  });

  describe('createCustomerAsync', () => {
    it('should create a new customer successfully', async () => {
      const newCustomer = { name: 'John Doe', email: 'johndoe@example.com', favorite_products: [] };
      const createdCustomer = { id: 1, ...newCustomer };
      customerRepository.create.mockResolvedValue(createdCustomer);

      const result = await customerService.createCustomerAsync(newCustomer);

      expect(result).toEqual(createdCustomer);
      expect(customerRepository.create).toHaveBeenCalledWith(newCustomer);
    });

    it('should throw BadRequestError if name or email is null or undefined', async () => {
      const invalidCustomer = { name: null, email: 'johndoe@example.com', favorite_products: 'foo' };
    
      await expect(customerService.createCustomerAsync(invalidCustomer))
        .rejects
        .toThrow('Name and email are required');
    });

    it('should throw BadRequestError if favorite_products is not an array of integers', async () => {
      const invalidCustomer = { name: 'John Doe', email: 'johndoe@example.com', favorite_products: 'foo' };
    
      await expect(customerService.createCustomerAsync(invalidCustomer))
        .rejects
        .toThrow('favorite_products must be an array of integers');
    });

    it('should throw an error if something goes wrong when trying to insert a customer into the database', async () => {
      const newCustomer = { name: 'John Doe', email: 'johndoe@example.com', favorite_products: [] };
      customerRepository.create.mockRejectedValue(new Error('DB error'));

      await expect(customerService.createCustomerAsync(newCustomer))
        .rejects
        .toThrow('DB error');
    });
  });

  describe('updateCustomerAsync', () => {
    it('should update a customer successfully', async () => {
      const id = 1;
      const updateData = { name: 'John Doe', email: 'johndoe@example.com', favorite_products: [] };
      const updatedCustomer = { id, ...updateData };
      customerRepository.update.mockResolvedValue(updatedCustomer);

      const result = await customerService.updateCustomerAsync(id, updateData);

      expect(result).toEqual(updatedCustomer);
      expect(customerRepository.update).toHaveBeenCalledWith(id, updateData);
    });

    it('should throw BadRequestError if favorite_products is not an array of integers', async () => {
      const id = 1;
      const invalidUpdate = { name: 'John Doe', favorite_products: 'foo' };

      await expect(customerService.updateCustomerAsync(id, invalidUpdate))
        .rejects
        .toThrow('favorite_products must be an array of integers');
    });

    it('should throw an error if something goes wrong when trying to update a customer', async () => {
      const id = 1;
      const updateData = { name: 'John Doe', email: 'johndoe@example.com', favorite_products: [] };
      customerRepository.update.mockRejectedValue(new Error('DB error'));

      await expect(customerService.updateCustomerAsync(id, updateData))
        .rejects
        .toThrow('DB error');
    });
  });

  describe('deleteCustomerAsync', () => {
    it('should delete a customer successfully', async () => {
      const id = 1;
      customerRepository.remove.mockResolvedValue({ success: true });

      const result = await customerService.deleteCustomerAsync(id);

      expect(result).toEqual({ success: true });
      expect(customerRepository.remove).toHaveBeenCalledWith(id);
    });

    it('should throw an error if something goes wrong when trying to delete a customer from database', async () => {
      const id = 1;
      customerRepository.remove.mockRejectedValue(new Error('DB error'));

      await expect(customerService.deleteCustomerAsync(id))
        .rejects
        .toThrow('DB error');
    });
  });
});
