const PublisherData = require("../models/PublisherData.model");
const SheetConfig = require("../models/SheetConfig.model");

/** Total publisher count */
const getTotalPublishers = () => PublisherData.countDocuments();

/** Total active sheets */
const getTotalActiveSheets = () => SheetConfig.countDocuments({ active: true });

/**
 * Monthly onboarding count for a given year.
 * Groups by year-month of createdAt.
 *
 * @param {number} year  defaults to current year
 */
const getMonthlyCount = async (year) => {
  const targetYear = year || new Date().getFullYear();

  const start = new Date(`${targetYear}-01-01T00:00:00.000Z`);
  const end = new Date(`${targetYear + 1}-01-01T00:00:00.000Z`);

  const result = await PublisherData.aggregate([
    { $match: { createdAt: { $gte: start, $lt: end } } },
    {
      $group: {
        _id: { month: { $month: "$createdAt" } },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.month": 1 } },
  ]);

  // Fill in zero counts for months with no data
  const monthlyMap = {};
  result.forEach(({ _id, count }) => {
    monthlyMap[_id.month] = count;
  });

  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];

  return months.map((name, i) => ({
    month: name,
    count: monthlyMap[i + 1] || 0,
  }));
};

/** Publisher count grouped by delivery person */
const getCountByDeliveryPerson = async () => {
  return PublisherData.aggregate([
    { $group: { _id: "$usedBy", count: { $sum: 1 } } },
    { $project: { _id: 0, usedBy: "$_id", count: 1 } },
    { $sort: { count: -1 } },
  ]);
};

/** Publisher count grouped by sheet */
const getCountBySheet = async () => {
  return PublisherData.aggregate([
    {
      $group: {
        _id: "$sheetId",
        usedBy: { $first: "$usedBy" },
        count: { $sum: 1 },
      },
    },
    { $project: { _id: 0, sheetId: "$_id", usedBy: 1, count: 1 } },
    { $sort: { count: -1 } },
  ]);
};

/** Publisher count grouped by status */
const getCountByStatus = async () => {
  return PublisherData.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
    { $project: { _id: 0, status: "$_id", count: 1 } },
    { $sort: { count: -1 } },
  ]);
};

module.exports = {
  getTotalPublishers,
  getTotalActiveSheets,
  getMonthlyCount,
  getCountByDeliveryPerson,
  getCountBySheet,
  getCountByStatus,
};
