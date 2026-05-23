const sheetConfigService = require("../services/sheetConfig.service");
const { sendSuccess, sendError } = require("../utils/apiResponse");

/** GET /api/sheets */
const getAllSheets = async (req, res) => {
  try {
    const sheets = await sheetConfigService.getAllSheets();
    sendSuccess(res, sheets, "Sheets fetched successfully");
  } catch (error) {
    sendError(res, error.message);
  }
};

/** GET /api/sheets/:id */
const getSheetById = async (req, res) => {
  try {
    const sheet = await sheetConfigService.getSheetById(req.params.id);
    if (!sheet) return sendError(res, "Sheet not found", 404);
    sendSuccess(res, sheet);
  } catch (error) {
    sendError(res, error.message);
  }
};

/** POST /api/sheets */
const createSheet = async (req, res) => {
  try {
    const sheet = await sheetConfigService.createSheet(req.body);
    sendSuccess(res, sheet, "Sheet config created", 201);
  } catch (error) {
    sendError(res, error.message);
  }
};

/** PUT /api/sheets/:id */
const updateSheet = async (req, res) => {
  try {
    const sheet = await sheetConfigService.updateSheet(req.params.id, req.body);
    if (!sheet) return sendError(res, "Sheet not found", 404);
    sendSuccess(res, sheet, "Sheet config updated");
  } catch (error) {
    sendError(res, error.message);
  }
};

/** PATCH /api/sheets/:id/toggle */
const toggleActive = async (req, res) => {
  try {
    const sheet = await sheetConfigService.toggleActive(req.params.id);
    if (!sheet) return sendError(res, "Sheet not found", 404);
    sendSuccess(res, sheet, `Sheet marked ${sheet.active ? "active" : "inactive"}`);
  } catch (error) {
    sendError(res, error.message);
  }
};

/** DELETE /api/sheets/:id */
const deleteSheet = async (req, res) => {
  try {
    const sheet = await sheetConfigService.deleteSheet(req.params.id);
    if (!sheet) return sendError(res, "Sheet not found", 404);
    sendSuccess(res, null, "Sheet config deleted");
  } catch (error) {
    sendError(res, error.message);
  }
};

module.exports = {
  getAllSheets,
  getSheetById,
  createSheet,
  updateSheet,
  toggleActive,
  deleteSheet,
};
