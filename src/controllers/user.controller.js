const { getUsers, createNewUser, updateExistingUser, removeUser, getUserById } = require('../services/user.service');
const { resetPassword } = require('../services/auth.service');
const { successResponse, createdResponse, errorResponse } = require('../utils/apiResponse');

async function listUsersController(req, res) {
  try {
    const { data, totalRecords } = await getUsers(req.query);
    const limit = Number(req.query.limit || 10);
    const page = Number(req.query.page || 1);
    const totalPages = Math.ceil(totalRecords / limit);
    return successResponse(res, 'Users fetched successfully', { data, page, limit, totalPages, totalRecords });
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error.message, []);
  }
}

async function createUserController(req, res) {
  try {
    const user = await createNewUser(req.body);
    return createdResponse(res, 'User created successfully', { id: user._id, name: user.name, email: user.email, role: user.role, active: user.active });
  } catch (error) {
    return errorResponse(res, error.statusCode || 400, error.message, []);
  }
}

async function updateUserController(req, res) {
  try {
    const user = await updateExistingUser(req.params.id, req.body);
    return successResponse(res, 'User updated successfully', user);
  } catch (error) {
    return errorResponse(res, error.statusCode || 400, error.message, []);
  }
}

async function removeUserController(req, res) {
  try {
    await removeUser(req.params.id);
    return successResponse(res, 'User deleted successfully');
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error.message, []);
  }
}

async function resetPasswordController(req, res) {
  try {
    const tempPassword = req.body.password;
    const user = await resetPassword(req.params.id, tempPassword);
    return successResponse(res, 'Password reset successfully', { id: user._id });
  } catch (error) {
    return errorResponse(res, error.statusCode || 400, error.message, []);
  }
}

async function getUserController(req, res) {
  try {
    const user = await getUserById(req.params.id);
    if (!user) {
      return errorResponse(res, 404, 'User not found', []);
    }
    return successResponse(res, 'User fetched successfully', user);
  } catch (error) {
    return errorResponse(res, error.statusCode || 500, error.message, []);
  }
}

module.exports = { listUsersController, createUserController, updateUserController, removeUserController, resetPasswordController, getUserController };
