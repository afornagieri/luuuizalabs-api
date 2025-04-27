const { login } = require('../../src/controllers/authController.js');
const redis = require('../../src/config/redis/redis.js');
const { generateToken } = require('../../src/utils/jwt.js');
const { BadRequestError } = require('../../src/utils/customErrorHandler.js');

jest.mock('../../src/config/redis/redis.js', () => ({
  get: jest.fn(),
  setex: jest.fn()
}));

jest.mock('../../src/utils/jwt.js');

describe('authController', () => {
  let req;
  let res;
  let next;

  beforeAll(() => {
    process.env.JWT_AUTH_USERNAME = 'testuser';
    process.env.JWT_AUTH_PASSWORD = 'testpassword';
  });

  beforeEach(() => {
    req = {
      body: {
        username: 'testuser',
        password: 'testpassword',
      },
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return an error if username or password is missing', async () => {
    req.body.username = '';

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    const err = next.mock.calls[0][0];
    expect(err.message).toBe('Username and password are required');
  });

  it('should return an error if invalid username or password', async () => {
    req.body.username = 'invaliduser';
    req.body.password = 'invalidpassword';

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(BadRequestError));
    const err = next.mock.calls[0][0];
    expect(err.message).toBe('Invalid username or password');
  });

  it('should return a success message if token already exists', async () => {
    redis.get.mockResolvedValue('existingToken');

    await login(req, res, next);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Successful logged in, token already exists',
    });
  });

  it('should generate a new token and store it in redis if no token exists', async () => {
    redis.get.mockResolvedValue(null);
    generateToken.mockReturnValue('newGeneratedToken');

    await login(req, res, next);

    expect(generateToken).toHaveBeenCalledWith('testuser');
    expect(redis.setex).toHaveBeenCalledWith(
      'token:testuser',
      900,
      'newGeneratedToken'
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith({
      message: 'Successful logged in',
      token: 'newGeneratedToken',
      expiresIn: '15min',
    });
  });

  it('should call next with an error if something goes wrong', async () => {
    const error = new Error('Unexpected error');
    redis.get.mockRejectedValue(error);

    await login(req, res, next);

    expect(next).toHaveBeenCalledWith(error);
  });
});
