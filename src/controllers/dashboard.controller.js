const { getDashboard } = require('../services/dashboard.service');
const { successResponse, errorResponse } = require('../utils/apiResponse');

async function dashboardController(req, res) {
  try {
    return successResponse(res, 'Dashboard fetched successfully', await getDashboard(req.user));
  } catch (error) {
    return errorResponse(res, 500, error.message, []);
  }
}

module.exports = { dashboardController };
