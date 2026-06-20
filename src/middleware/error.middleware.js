const { errorResponse } = require('../utils/apiResponse');

function handleError(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  const errors = err.errors || [];
  return errorResponse(res, statusCode, err.message || 'Internal Server Error', errors);
}

module.exports = { handleError };
