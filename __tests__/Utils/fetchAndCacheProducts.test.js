// __tests__/Utils/fetchAndCacheProducts.test.js
const { fetchAndCacheProducts } = require('../../src/utils/fetchAndCacheProducts.js');
const redisClient = require('../../src/config/redis/redis.js');
const { InternalServerError } = require('../../src/utils/customErrorHandler.js');

jest.mock('../../src/config/redis/redis.js', () => ({
  get: jest.fn(),
  setex: jest.fn(),
}));

global.fetch = jest.fn();

describe('fetchAndCacheProducts', () => {
  const fakeUrl = 'https://fakestore.test/products';

  beforeAll(() => {
    process.env.FAKE_STORE_API_BASE_URL = fakeUrl;
  });

  let consoleErrorSpy;
  beforeEach(() => {
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it('returns parsed cache when present', async () => {
    const cached = JSON.stringify([{ id: 1, name: 'foo' }]);
    redisClient.get.mockResolvedValue(cached);

    const result = await fetchAndCacheProducts();

    expect(redisClient.get).toHaveBeenCalledWith('products');
    expect(result).toEqual([{ id: 1, name: 'foo' }]);
    expect(global.fetch).not.toHaveBeenCalled();
  });

  it('fetches, caches, and returns products when cache is empty', async () => {
    redisClient.get.mockResolvedValue(null);

    const products = [{ id: 2, name: 'bar' }];
    const mockResponse = {
      ok: true,
      json: jest.fn().mockResolvedValue(products),
    };
    global.fetch.mockResolvedValue(mockResponse);

    const result = await fetchAndCacheProducts();

    expect(redisClient.get).toHaveBeenCalledWith('products');
    expect(global.fetch).toHaveBeenCalledWith(fakeUrl);
    expect(mockResponse.json).toHaveBeenCalled();
    expect(redisClient.setex).toHaveBeenCalledWith(
      'products',
      expect.any(Number),
      JSON.stringify(products)
    );
    expect(result).toEqual(products);
  });

  it('throws InternalServerError on non-ok response', async () => {
    redisClient.get.mockResolvedValue(null);
    global.fetch.mockResolvedValue({ ok: false });

    await expect(fetchAndCacheProducts()).rejects.toBeInstanceOf(InternalServerError);
  });

  it('throws InternalServerError on fetch or cache errors', async () => {
    redisClient.get.mockRejectedValue(new Error('Redis down'));

    await expect(fetchAndCacheProducts()).rejects.toBeInstanceOf(InternalServerError);
  });
});
