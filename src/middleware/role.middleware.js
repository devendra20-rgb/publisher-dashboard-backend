const { errorResponse } = require('../utils/apiResponse');

const roleMiddleware = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return errorResponse(res, 403, 'You do not have permission to perform this action', []);
  }
  return next();
};

module.exports = roleMiddleware;
