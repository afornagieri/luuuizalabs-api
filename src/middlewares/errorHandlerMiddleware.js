const {
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
    InternalServerError
} = require('../utils/customErrorHandler.js');

function errorHandlerMiddleware(err, _req, res, _next) {
console.error(err);

if (
  err instanceof BadRequestError ||
  err instanceof UnauthorizedError ||
  err instanceof NotFoundError ||
  err instanceof InternalServerError
) {
  return res.status(err.statusCode).json({ error: err.message });
}
  return res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = errorHandlerMiddleware;
  