const PublisherDetail =
  require("../models/PublisherDetail.model");

const {
  buildFilter,
  syncPublisherDetails,
} = require("../services/publisherDetailSync.service");

const getPublisherDetails =
  async (req, res) => {
    try {

      // FILTER BUILD
      const filter =
        buildFilter(req.query);

      // PAGINATION
      const page =
        Number(req.query.page) || 1;

      const limit =
        Number(req.query.limit) || 10;

      const skip =
        (page - 1) * limit;

      // DATA
      const [data, total] =
        await Promise.all([

          PublisherDetail.find(filter)
            .sort({
              createdAt: -1,
            })
            .skip(skip)
            .limit(limit),

          PublisherDetail.countDocuments(
            filter
          ),
        ]);

      res.json({
        success: true,

        data: {
          publisherDetails: data,

          pagination: {
            total,

            page,

            limit,

            totalPages:
              Math.ceil(
                total / limit
              ),

            hasNextPage:
              page <
              Math.ceil(
                total / limit
              ),

            hasPrevPage:
              page > 1,
          },
        },
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

const manualSync =
  async (req, res) => {
    try {

      const result =
        await syncPublisherDetails();

      res.json({
        success: true,
        data: result,
      });

    } catch (error) {

      res.status(500).json({
        success: false,
        message:
          error.message,
      });

    }
  };

module.exports = {
  getPublisherDetails,
  manualSync,
};