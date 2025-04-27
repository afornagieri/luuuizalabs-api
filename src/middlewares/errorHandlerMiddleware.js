const {
    BadRequestError,
    UnauthorizedError,
    NotFoundError,
    InternalServerError
} = require('../utils/customErrorHandler.js');

function errorHandlerMiddleware(err, _, res, _) {
    console.error(err);

    if (err instanceof BadRequestError ||
        err instanceof UnauthorizedError ||
        err instanceof NotFoundError ||
        err instanceof InternalServerError) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    res.status(500).json({ error: 'Internal Server Error' });
}

module.exports = errorHandlerMiddleware;
