const mongoose = require("mongoose");

const sheetConfigSchema = new mongoose.Schema(
  {
    sheetName: {
      type: String,
      required: [true, "Sheet name is required"],
      trim: true,
    },
    sheetId: {
      type: String,
      required: [true, "Sheet ID is required"],
      unique: true,
      trim: true,
    },
    usedBy: {
      type: String,
      required: [true, "usedBy (delivery person name) is required"],
      trim: true,
    },
    // Which tab/range to read — defaults to the first sheet
    range: {
      type: String,
      default: "Sheet1!A:G",
      trim: true,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("SheetConfig", sheetConfigSchema);
