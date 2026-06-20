const { generatePublisherExport, generateOfferExport } = require('../services/export.service');
const { errorResponse } = require('../utils/apiResponse');

const generators = { publishers: generatePublisherExport, offers: generateOfferExport };

async function sendExport(req, res, range) {
  try {
    const type = req.params.type;
    const generator = generators[type];
    if (!generator) return errorResponse(res, 400, 'Invalid export type', []);
    const query = range === 'custom'
      ? { startDate: req.query.startDate, endDate: req.query.endDate }
      : { range };
    const { buffer } = await generator(query);
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${type}-${range}.xlsx"`);
    return res.send(buffer);
  } catch (error) {
    return errorResponse(res, 500, error.message, []);
  }
}

const monthlyExportController = (req, res) => sendExport(req, res, 'monthly');
const customExportController = (req, res) => sendExport(req, res, 'custom');

module.exports = { monthlyExportController, customExportController };

