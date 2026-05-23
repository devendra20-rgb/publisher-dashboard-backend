const { syncAllSheets } = require("../services/sync.service");
const { sendSuccess, sendError } = require("../utils/apiResponse");

/**
 * POST /api/sync
 * Manually trigger a full sync of all active sheets.
 */
const manualSync = async (req, res) => {
  try {
    console.log("🔄  Manual sync triggered via API");
    const result = await syncAllSheets();
    sendSuccess(res, result, "Sync completed");
  } catch (error) {
    sendError(res, error.message);
  }
};

module.exports = { manualSync };
