const { login, changePassword } = require('../services/auth.service');
const { successResponse, errorResponse } = require('../utils/apiResponse');

async function loginController(req, res, next) {
  try {
    const { email, password } = req.body;
    const result = await login(email, password);
    return successResponse(res, 'Login successful', result);
  } catch (error) {
    return errorResponse(res, 401, error.message, []);
  }
}

async function changePasswordController(req, res, next) {
  try {
    const { currentPassword, newPassword } = req.body;
    await changePassword(req.user.id, currentPassword, newPassword);
    return successResponse(res, 'Password changed successfully');
  } catch (error) {
    const status = error.statusCode || 400;
    return errorResponse(res, status, error.message, []);
  }
}

function logoutController(req, res) {
  return successResponse(res, 'Logged out successfully');
}

function meController(req, res) {
  return successResponse(res, 'Profile fetched successfully', req.user);
}

module.exports = { loginController, changePasswordController, logoutController, meController };
