const statsService = require("../services/stats.service");
const { sendSuccess, sendError } = require("../utils/apiResponse");

/**
 * GET /api/stats/overview
 * Returns high-level KPI numbers for the dashboard header.
 */
const getOverview = async (req, res) => {
  try {
    const [totalPublishers, totalActiveSheets] = await Promise.all([
      statsService.getTotalPublishers(),
      statsService.getTotalActiveSheets(),
    ]);

    sendSuccess(res, { totalPublishers, totalActiveSheets });
  } catch (error) {
    sendError(res, error.message);
  }
};

/**
 * GET /api/stats/monthly?year=2025
 * Monthly onboarding count (12 months) for a given year.
 */
const getMonthly = async (req, res) => {
  try {
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const data = await statsService.getMonthlyCount(year);
    sendSuccess(res, data);
  } catch (error) {
    sendError(res, error.message);
  }
};

/**
 * GET /api/stats/by-person
 * Publisher count broken down by delivery person.
 */
const getByPerson = async (req, res) => {
  try {
    const data = await statsService.getCountByDeliveryPerson();
    sendSuccess(res, data);
  } catch (error) {
    sendError(res, error.message);
  }
};

/**
 * GET /api/stats/by-sheet
 * Publisher count broken down by sheet.
 */
const getBySheet = async (req, res) => {
  try {
    const data = await statsService.getCountBySheet();
    sendSuccess(res, data);
  } catch (error) {
    sendError(res, error.message);
  }
};

/**
 * GET /api/stats/by-status
 * Publisher count broken down by status.
 */
const getByStatus = async (req, res) => {
  try {
    const data = await statsService.getCountByStatus();
    sendSuccess(res, data);
  } catch (error) {
    sendError(res, error.message);
  }
};

module.exports = { getOverview, getMonthly, getByPerson, getBySheet, getByStatus };
