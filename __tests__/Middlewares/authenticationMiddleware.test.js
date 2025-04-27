const authenticationMiddleware = require('../../src/middlewares/authenticationMiddleware.js');
const jwt = require('jsonwebtoken');
const redis = require('../../src/config/redis/redis.js');
const { UnauthorizedError } = require('../../src/utils/customErrorHandler.js');

jest.mock('jsonwebtoken');
jest.mock('../../src/config/redis/redis.js', () => ({
    get: jest.fn(),
    setex: jest.fn()
}));

describe('Authentication Middleware', () => {
  let req;
  let next;

  beforeAll(() => {
    process.env.JWT_SECRET = 'supersecret';
  });

  beforeEach(() => {
    req = {
      headers: {
        authorization: 'valid.token.here',
      },
    };
    next = jest.fn();
    jest.clearAllMocks();
  });

  it('should throw UnauthorizedError if no Authorization header', async () => {
    req.headers.authorization = undefined;

    await authenticationMiddleware(req, null, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    const err = next.mock.calls[0][0];
    expect(err.message).toBe('No token provided');
  });

  it('should throw UnauthorizedError if jwt.verify fails', async () => {
    jwt.verify.mockImplementation(() => { throw new Error('Malformed token'); });

    await authenticationMiddleware(req, null, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
    const err = next.mock.calls[0][0];
    expect(err.message).toBe('Malformed token');
  });

  it('should throw UnauthorizedError if token not in Redis', async () => {
    jwt.verify.mockReturnValue({ data: 'testuser' });
    redis.get.mockResolvedValue(null);

    await authenticationMiddleware(req, null, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    const err = next.mock.calls[0][0];
    expect(err.message).toBe('Invalid or expired token');
  });

  it('should throw UnauthorizedError if stored token does not match', async () => {
    jwt.verify.mockReturnValue({ data: 'testuser' });
    redis.get.mockResolvedValue('other.token.value');

    await authenticationMiddleware(req, null, next);

    expect(next).toHaveBeenCalledWith(expect.any(UnauthorizedError));
    const err = next.mock.calls[0][0];
    expect(err.message).toBe('Invalid or expired token');
  });

  it('should call next() with no args if token is valid and matches Redis', async () => {
    jwt.verify.mockReturnValue({ data: 'testuser' });
    redis.get.mockResolvedValue('valid.token.here');

    await authenticationMiddleware(req, null, next);

    expect(jwt.verify).toHaveBeenCalledWith('valid.token.here', 'supersecret');
    expect(redis.get).toHaveBeenCalledWith('token:testuser');
    expect(next).toHaveBeenCalledWith();
  });
});
