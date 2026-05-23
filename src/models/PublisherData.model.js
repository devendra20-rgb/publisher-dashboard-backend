const mongoose = require("mongoose");

const publisherDataSchema = new mongoose.Schema(
  {
    market: {
      type: String,
      trim: true,
      default: "",
    },
    publisherName: {
      type: String,
      required: [true, "Publisher name is required"],
      trim: true,
    },
    publisherPOC: {
      type: String,
      trim: true,
      default: "",
    },
    contactDate: {
      type: Date,
      default: null,
    },
    agencyPOC: {
      type: String,
      trim: true,
      default: "",
    },
    status: {
      type: String,
      trim: true,
      default: "",
    },
    notes: {
      type: String,
      trim: true,
      default: "",
    },
    // ── Source metadata ──────────────────────────────────────────────────────
    usedBy: {
      type: String,
      required: true,
      trim: true,
    },
    sheetId: {
      type: String,
      required: true,
      trim: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true },
);

// Compound unique index: one record per (publisherName + sheetId) pair.
// This drives the upsert logic and prevents duplicates.
publisherDataSchema.index({ publisherName: 1, sheetId: 1 }, { unique: true });

// Extra indexes for common filter / sort queries
publisherDataSchema.index({ usedBy: 1 });
publisherDataSchema.index({ market: 1 });
publisherDataSchema.index({ status: 1 });

module.exports = mongoose.model("PublisherData", publisherDataSchema);
