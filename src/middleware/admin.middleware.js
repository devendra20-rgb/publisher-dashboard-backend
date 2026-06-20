const { errorResponse } = require('../utils/apiResponse');

function adminMiddleware(req, res, next) {
  if (req.user?.role !== 'admin') {
    return errorResponse(res, 403, 'Admin access required', []);
  }
  return next();
}

module.exports = adminMiddleware;
