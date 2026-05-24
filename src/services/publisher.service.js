const PublisherData = require("../models/PublisherData.model");

/**
 * Build MongoDB filters from query params
 */
const buildFilter = (query) => {
  const filter = {
    isActive: true,
  };

  // ─────────────────────────────────────────────
  // Text filters
  // ─────────────────────────────────────────────
if (query.usedBy) {
  filter.agencyPOC = query.usedBy;
}

  if (query.market) {
    filter.market = new RegExp(query.market, "i");
  }

  if (query.status) {
    filter.status = new RegExp(query.status, "i");
  }

  if (query.sheetId) {
    filter.sheetId = query.sheetId;
  }

  if (query.publisherName) {
    filter.publisherName = new RegExp(query.publisherName, "i");
  }

  // ─────────────────────────────────────────────
  // Custom Date Range
  // ─────────────────────────────────────────────
  // ─────────────────────────────────────────────
  // Custom Date Range
  // ─────────────────────────────────────────────
  if (query.startDate || query.endDate) {
    filter.contactDate = {};

    // Start Date
    if (query.startDate) {
      filter.contactDate.$gte = new Date(query.startDate);
    }

    // End Date
    if (query.endDate) {
      const end = new Date(query.endDate);

      end.setHours(23, 59, 59, 999);

      filter.contactDate.$lte = end;
    }
  }

  // ─────────────────────────────────────────────
  // Quick Date Ranges
  // ─────────────────────────────────────────────

  if (query.range && query.range !== "custom") {
    const now = new Date();

    let startDate = new Date();

    // Last 7 Days
    if (query.range === "last7days") {
      startDate.setDate(now.getDate() - 7);
    }

    // Last 30 Days
    if (query.range === "last30days") {
      startDate.setDate(now.getDate() - 30);
    }

    // This Month
    if (query.range === "thisMonth") {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    filter.contactDate = {
      $gte: startDate,
      $lte: now,
    };
  }

  return filter;
};

/**
 * Paginated publishers
 */
const getPublishers = async (filter, skip, limit) => {
  const [data, total] = await Promise.all([
    PublisherData.find(filter)
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit)
      .lean(),

    PublisherData.countDocuments(filter),
  ]);

  return {
    data,
    total,
  };
};

module.exports = {
  buildFilter,
  getPublishers,
};
