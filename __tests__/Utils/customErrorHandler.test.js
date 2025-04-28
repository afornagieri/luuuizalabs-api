const {
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
    InternalServerError,
  } = require('../../src/utils/customErrorHandler.js');
  
  describe('Custom Error Classes', () => {
    it('BadRequestError should have correct properties', () => {
      const err = new BadRequestError('Oops');
      expect(err).toBeInstanceOf(Error);
      expect(err).toBeInstanceOf(BadRequestError);
      expect(err.name).toBe('BadRequestError');
      expect(err.message).toBe('Oops');
      expect(err.statusCode).toBe(400);
    });
  
    it('BadRequestError default message', () => {
      const err = new BadRequestError();
      expect(err.message).toBe('Bad Request');
    });
  
    it('UnauthorizedError should have correct properties', () => {
      const err = new UnauthorizedError('No access');
      expect(err).toBeInstanceOf(Error);
      expect(err).toBeInstanceOf(UnauthorizedError);
      expect(err.name).toBe('UnauthorizedError');
      expect(err.message).toBe('No access');
      expect(err.statusCode).toBe(401);
    });
  
    it('UnauthorizedError default message', () => {
      const err = new UnauthorizedError();
      expect(err.message).toBe('Unauthorized');
    });
  
    it('NotFoundError should have correct properties', () => {
      const err = new NotFoundError('Gone');
      expect(err).toBeInstanceOf(Error);
      expect(err).toBeInstanceOf(NotFoundError);
      expect(err.name).toBe('NotFoundError');
      expect(err.message).toBe('Gone');
      expect(err.statusCode).toBe(404);
    });
  
    it('NotFoundError default message', () => {
      const err = new NotFoundError();
      expect(err.message).toBe('Not Found');
    });
  
    it('InternalServerError should have correct properties', () => {
      const err = new InternalServerError('Crash');
      expect(err).toBeInstanceOf(Error);
      expect(err).toBeInstanceOf(InternalServerError);
      expect(err.name).toBe('InternalServerError');
      expect(err.message).toBe('Crash');
      expect(err.statusCode).toBe(500);
    });
  
    it('InternalServerError default message', () => {
      const err = new InternalServerError();
      expect(err.message).toBe('Internal Server Error');
    });
  });
  