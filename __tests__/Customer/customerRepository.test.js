const db = require('../../src/config/mysql/db.js');
const { fetchAndCacheProducts } = require('../../src/utils/fetchAndCacheProducts.js');
const { BadRequestError, NotFoundError } = require('../../src/utils/customErrorHandler.js');
const customerRepository = require('../../src/repositories/customerRepository.js');

jest.mock('../../src/config/redis/redis.js', () => ({
  get: jest.fn(),
  setex: jest.fn()
}));
jest.mock('../../src/config/mysql/db.js');
jest.mock('../../src/utils/fetchAndCacheProducts.js');

describe('Customer Repository', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getAll', () => {
    it('should return all customers within your favorite products if the customer has any favorite product', async () => {
      const fakeCustomers = [
        { id: 1, name: 'John Doe', email: 'john@example.com', favorite_products: [1, 2] }
      ];

      const fakeProducts = [
        {
          "id": 1,
          "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
          "price": 109.95,
          "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
          "category": "men's clothing",
          "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
          "rating": {
            "rate": 3.9,
            "count": 120
          }
        },
        {
          "id": 2,
          "title": "Mens Casual Premium Slim Fit T-Shirts ",
          "price": 22.3,
          "description": "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
          "category": "men's clothing",
          "image": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
          "rating": {
            "rate": 4.1,
            "count": 259
          }
        },
        {
          "id": 3,
          "title": "Mens Cotton Jacket",
          "price": 55.99,
          "description": "great outerwear jackets for Spring/Autumn/Winter, suitable for many occasions, such as working, hiking, camping, mountain/rock climbing, cycling, traveling or other outdoors. Good gift choice for you or your family member. A warm hearted love to Father, husband or son in this thanksgiving or Christmas Day.",
          "category": "men's clothing",
          "image": "https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg",
          "rating": {
            "rate": 4.7,
            "count": 500
          }
        }
      ];

      db.query.mockResolvedValue([fakeCustomers]);
      fetchAndCacheProducts.mockResolvedValue(fakeProducts);

      const result = await customerRepository.getAll();

      expect(result).toEqual([
        {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          favorite_products: [
            {
              "id": 1,
              "title": "Fjallraven - Foldsack No. 1 Backpack, Fits 15 Laptops",
              "price": 109.95,
              "description": "Your perfect pack for everyday use and walks in the forest. Stash your laptop (up to 15 inches) in the padded sleeve, your everyday",
              "category": "men's clothing",
              "image": "https://fakestoreapi.com/img/81fPKd-2AYL._AC_SL1500_.jpg",
              "rating": {
                "rate": 3.9,
                "count": 120
              }
            },
            {
              "id": 2,
              "title": "Mens Casual Premium Slim Fit T-Shirts ",
              "price": 22.3,
              "description": "Slim-fitting style, contrast raglan long sleeve, three-button henley placket, light weight & soft fabric for breathable and comfortable wearing. And Solid stitched shirts with round neck made for durability and a great fit for casual fashion wear and diehard baseball fans. The Henley style round neckline includes a three-button placket.",
              "category": "men's clothing",
              "image": "https://fakestoreapi.com/img/71-3HjGNDUL._AC_SY879._SX._UX._SY._UY_.jpg",
              "rating": {
                "rate": 4.1,
                "count": 259
              }
            }
          ]
        }
      ]);

      expect(db.query).toHaveBeenCalledWith('SELECT * FROM customers');
      expect(fetchAndCacheProducts).toHaveBeenCalledTimes(1);
    });

    it('should throw error if something goes wrong during the execution of the query', async () => {
      db.query.mockRejectedValue(new Error('Database error'));
      await expect(customerRepository.getAll()).rejects.toThrow('Database error');
    });
  });

  describe('create', () => {
    it('should create with success a new customer without favorite_products', async () => {
      const newCustomer = { id: 1, name: 'John Doe', email: 'john@example.com', favorite_products: [] };
      const fakeResult = { insertId: 1 };

      db.query.mockResolvedValueOnce([[]]);
      db.query.mockResolvedValueOnce([fakeResult]);

      const result = await customerRepository.create(newCustomer);

      expect(result).toEqual({
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        favorite_products: []
      });

      expect(db.query).toHaveBeenNthCalledWith(
        1,
        'SELECT id FROM customers WHERE email = ?',
        ['john@example.com']
      );
      expect(db.query).toHaveBeenNthCalledWith(
        2,
        'INSERT INTO customers (name, email, favorite_products) VALUES (?, ?, ?)',
        ['John Doe', 'john@example.com', '[]']
      );
    });

    it('should create with success a new customer with favorite_products', async () => {
      const newCustomer = { name: 'John Smith', email: 'johnsmith@example.com', favorite_products: [2, 2, 3] };
      const fakeResult = { insertId: 5 };

      db.query.mockResolvedValueOnce([[]]);
      db.query.mockResolvedValueOnce([fakeResult]);

      const result = await customerRepository.create(newCustomer);

      expect(result).toEqual({
        id: 5,
        name: 'John Smith',
        email: 'johnsmith@example.com',
        favorite_products: [2, 3]
      });
    });

    it('should throw BadRequestError if there is a customer registered with the provided e-mail', async () => {
      const newCustomer = { name: 'John Smith', email: 'johnsmith@example.com', favorite_products: [] };
      db.query.mockResolvedValue([[{ id: 10 }]]);
      try {
        await customerRepository.create(10, newCustomer);
        throw new BadRequestError('Email already registered');
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestError);
        expect(err.message).toBe('Email already registered');
      }
    });

    it('should throw BadRequestError if favorite_products is not an array of integers', async () => {
      const invalidDto = {
        name: 'John Smith',
        email: 'johnsmith@example.com',
        favorite_products: 'foo'
      };
  
      db.query.mockResolvedValueOnce([[]]);
  
      try {
        await customerRepository.create(invalidDto);
        throw new BadRequestError('favorite_products must be an array of integers');
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestError);
        expect(err.message).toBe('favorite_products must be an array of integers');
      }
    });
  });

  describe('update', () => {
    it('should update a customer an return the customer with the updated data', async () => {
      const dto = { name: 'Jane Smith', email: 'janesmith@example.com', favorite_products: [4] };

      db.query
        .mockResolvedValueOnce([[{ id: 1 }]])
        .mockResolvedValueOnce([[]])
        .mockResolvedValueOnce([{ affectedRows: 1 }]);
  
      const result = await customerRepository.update(1, dto);
  
      expect(result).toEqual({
        id: 1,
        name: 'Jane Smith',
        email: 'janesmith@example.com',
        favorite_products: [4]
      });
  
      expect(db.query).toHaveBeenNthCalledWith(1, 'SELECT id FROM customers WHERE id = ?', [1]);
      expect(db.query).toHaveBeenNthCalledWith(2, 'SELECT id FROM customers WHERE email = ? AND id != ?', ['janesmith@example.com', 1]);
      expect(db.query).toHaveBeenNthCalledWith(3, 'UPDATE customers SET name = ?, email = ?, favorite_products = ? WHERE id = ?', ['Jane Smith', 'janesmith@example.com', JSON.stringify([4]), 1]);
    });
  
    it('should throw NotFoundError if customer does not exists', async () => {
      db.query.mockResolvedValueOnce([[]]);
  
      try {
        await customerRepository.update(999, {});
        throw new NotFoundError('Customer not found');
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundError);
        expect(err.message).toBe('Customer not found');
      }
    });
  
    it('should throw BadRequestError if the email is already registered to another customer', async () => {
      const dto = { id: 1, name: 'John Doe', email: 'john@example.com', favorite_products: [] }
      db.query.mockResolvedValueOnce([{ id: 1, name: 'John Doe', email: 'john@example.com', favorite_products: [] }]);
      db.query.mockResolvedValueOnce([[{ id: 1, name: 'John Doe', email: 'john@example.com', favorite_products: [] }]]);
  
      try {
        await customerRepository.update(1, dto);
        throw new BadRequestError('Email already registered to another customer');
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestError);
        expect(err.message).toBe('Email already registered to another customer');
      }
    });

    it('should throw BadRequestError if favorite_products is not an array of integers', async () => {
      const invalidDto = { id: 1, name: 'John Doe', email: 'john@example.com', favorite_products: 'foo' }
      db.query.mockResolvedValueOnce([{ id: 1, name: 'John Doe', email: 'john@example.com', favorite_products: [] }]);
      db.query.mockResolvedValueOnce([[]]);
  
      try {
        await customerRepository.update(1, invalidDto);
        throw new BadRequestError('favorite_products must be an array of integers');
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestError);
        expect(err.message).toBe('favorite_products must be an array of integers');
      }
    });

    it('should throw BadRequestError if there are no fields to update', async () => {
      db.query.mockResolvedValueOnce([[{ id: 1 }]]);
  
      try {
        await customerRepository.update(1, {});
        throw new BadRequestError('No fields to update');
      } catch (err) {
        expect(err).toBeInstanceOf(BadRequestError);
        expect(err.message).toBe('No fields to update');
      }
    });
  });

  describe('remove', () => {
    it('should remove a customer if the customer exists', async () => {
      db.query.mockResolvedValueOnce([[{ id: 1 }]]);
      db.query.mockResolvedValueOnce([]);

      const result = await customerRepository.remove(1);
      expect(result).toEqual({ message: 'Customer deleted successfully' });

      expect(db.query).toHaveBeenNthCalledWith(1, 'SELECT id FROM customers WHERE id = ?', [1]);
      expect(db.query).toHaveBeenNthCalledWith(2, 'DELETE FROM customers WHERE id = ?', [1]);
    });

    it('should throw NotFoundError if customer does not exists', async () => {
      db.query.mockResolvedValueOnce([[]]);
      try {
        await customerRepository.remove(999, {});
        throw new NotFoundError('Customer not found');
      } catch (err) {
        expect(err).toBeInstanceOf(NotFoundError);
        expect(err.message).toBe('Customer not found');
      }
    });
  });
});
