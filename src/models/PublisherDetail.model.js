const mongoose = require("mongoose");

const publisherDetailSchema =
  new mongoose.Schema(
    {
      pubId: {
        type: String,
        required: true,
        trim: true,
      },

      publisherName: {
        type: String,
        required: true,
        trim: true,
      },

      market: {
        type: String,
        default: "",
      },

      campaignWishlist: {
        type: String,
        default: "",
      },

      campaignType: {
        type: String,
        default: "",
      },

      mmpTrackingTool: {
        type: String,
        default: "",
      },

      isActive: {
        type: Boolean,
        default: true,
      },
    },
    {
      timestamps: true,
    }
  );

publisherDetailSchema.index({
  pubId: 1,
  publisherName: 1,
});

module.exports = mongoose.model(
  "PublisherDetail",
  publisherDetailSchema
);