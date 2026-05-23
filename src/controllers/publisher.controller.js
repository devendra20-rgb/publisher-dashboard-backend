const publisherService = require("../services/publisher.service");
const { paginate } = require("../utils/pagination");
const { sendSuccess, sendError } = require("../utils/apiResponse");

/**
 * GET /api/publishers
 *
 * Query params (all optional):
 *   usedBy, market, status, sheetId, publisherName  — filters
 *   page, limit                                      — pagination
 */
const getAllPublishers = async (req, res) => {
  try {
    const filter = publisherService.buildFilter(req.query);

    // We need total count before building pagination, so run a count first
    const totalCount = await require("../models/PublisherData.model").countDocuments(filter);
    const { skip, limit, meta } = paginate(req.query, totalCount);

    const { data } = await publisherService.getPublishers(filter, skip, limit);

    sendSuccess(res, { publishers: data, pagination: meta });
  } catch (error) {
    sendError(res, error.message);
  }
};

module.exports = { getAllPublishers };
