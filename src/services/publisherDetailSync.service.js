const PublisherDetail = require("../models/PublisherDetail.model");

const { fetchPublisherDetailRows } = require("./googleSheets.service");

const buildFilter = (query) => {
  const filter = {
    isActive: true,
  };

  if (query.pubId) {
    filter.pubId = new RegExp(query.pubId, "i");
  }

  if (query.publisherName) {
    filter.publisherName = new RegExp(query.publisherName, "i");
  }

  if (query.market) {
    filter.market = new RegExp(query.market, "i");
  }

  if (query.campaignWishlist) {
    filter.campaignWishlist = new RegExp(query.campaignWishlist, "i");
  }

  if (query.campaignType) {
    filter.campaignType = new RegExp(query.campaignType, "i");
  }

  if (query.mmpTrackingTool) {
    filter.mmpTrackingTool = new RegExp(query.mmpTrackingTool, "i");
  }

  return filter;
};

const syncPublisherDetails = async () => {
  const rows = await fetchPublisherDetailRows(
    process.env.PUBLISHER_DETAILS_SHEET_ID,
    process.env.PUBLISHER_DETAILS_RANGE,
  );
//   console.log(rows);

  if (!rows.length) {
    return {
      synced: 0,
    };
  }

  // DELETE OLD DATA
  await PublisherDetail.deleteMany({});

  // INSERT FRESH DATA
  const operations = rows.map((row) => ({
    insertOne: {
      document: {
        pubId: row.pubId?.trim() || "",

        publisherName: row.publisherName?.trim() || "",

        market: row.market?.trim() || "",

        campaignWishlist: row.campaignWishlist?.trim() || "",

        campaignType: row.campaignType?.trim() || "",

        mmpTrackingTool: row.mmpTrackingTool?.trim() || "",

        isActive: true,
      },
    },
  }));

  await PublisherDetail.bulkWrite(operations, {
    ordered: false,
  });

  return {
    synced: rows.length,
  };
};

module.exports = {
  syncPublisherDetails,
  buildFilter,
};
