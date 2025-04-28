const errorHandlerMiddleware = require('../../src/middlewares/errorHandlerMiddleware.js');
const {
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  InternalServerError
} = require('../../src/utils/customErrorHandler.js');

describe('Error Handler Middleware', () => {
  let err;
  let res;
  let consoleErrorSpy;

  beforeEach(() => {
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis()
    };
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should handle BadRequestError and return its status and message', () => {
    err = new BadRequestError('Invalid input');
    errorHandlerMiddleware(err, null, res, null);

    expect(consoleErrorSpy).toHaveBeenCalledWith(err);
    expect(res.status).toHaveBeenCalledWith(err.statusCode);
    expect(res.json).toHaveBeenCalledWith({ error: 'Invalid input' });
  });

  it('should handle UnauthorizedError and return its status and message', () => {
    err = new UnauthorizedError('No token');
    errorHandlerMiddleware(err, null, res, null);

    expect(consoleErrorSpy).toHaveBeenCalledWith(err);
    expect(res.status).toHaveBeenCalledWith(err.statusCode);
    expect(res.json).toHaveBeenCalledWith({ error: 'No token' });
  });

  it('should handle NotFoundError and return its status and message', () => {
    err = new NotFoundError('Resource not found');
    errorHandlerMiddleware(err, null, res, null);

    expect(consoleErrorSpy).toHaveBeenCalledWith(err);
    expect(res.status).toHaveBeenCalledWith(err.statusCode);
    expect(res.json).toHaveBeenCalledWith({ error: 'Resource not found' });
  });

  it('should handle InternalServerError and return its status and message', () => {
    err = new InternalServerError('Something went wrong');
    errorHandlerMiddleware(err, null, res, null);

    expect(consoleErrorSpy).toHaveBeenCalledWith(err);
    expect(res.status).toHaveBeenCalledWith(err.statusCode);
    expect(res.json).toHaveBeenCalledWith({ error: 'Something went wrong' });
  });

  it('should return 500 and generic message for unknown errors', () => {
    err = new Error('Internal Server Error');
    errorHandlerMiddleware(err, null, res, null);

    expect(consoleErrorSpy).toHaveBeenCalledWith(err);
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Internal Server Error' });
  });
});
