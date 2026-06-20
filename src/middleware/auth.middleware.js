const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('../config/env');
const { errorResponse } = require('../utils/apiResponse');
const User = require('../models/User.model');

async function authMiddleware(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return errorResponse(res, 401, 'Authorization header missing or invalid', []);
  }
  const token = authHeader.split(' ')[1];
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.userId).select('name email role active');
    if (!user || !user.active) {
      return errorResponse(res, 401, 'Account is inactive or no longer exists', []);
    }
    req.user = {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      active: user.active
    };
    return next();
  } catch (error) {
    return errorResponse(res, 401, 'Invalid or expired token', []);
  }
}

module.exports = authMiddleware;
