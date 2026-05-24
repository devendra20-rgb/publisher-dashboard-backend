const SheetConfig = require("../models/SheetConfig.model");


const PublisherData = require(
  "../models/PublisherData.model"
);

/** Return all sheet configs (optionally only active ones) */
const getAllSheets = async (onlyActive = false) => {
  const filter = onlyActive ? { active: true } : {};
  return SheetConfig.find(filter).sort({ createdAt: -1 });
};

/** Return a single sheet config by its Mongo _id */
const getSheetById = async (id) => {
  return SheetConfig.findById(id);
};

/** Create a new sheet config */
const createSheet = async (data) => {
  return SheetConfig.create(data);
};

/** Update a sheet config */
const updateSheet = async (id, data) => {
  return SheetConfig.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  });
};

/** Soft-toggle active flag */
const toggleActive = async (id) => {
  const sheet = await SheetConfig.findById(id);
  if (!sheet) return null;
  sheet.active = !sheet.active;
  return sheet.save();
};

/** Hard delete */
// const deleteSheet = async (id) => {
//   return SheetConfig.findByIdAndDelete(id);
// };

const deleteSheet = async (id) => {
  // Find sheet first
  const sheet =
    await SheetConfig.findById(id);

  if (!sheet) return null;

  // Mark all related publishers inactive
  await PublisherData.updateMany(
    {
      sheetId: sheet.sheetId,
    },
    {
      $set: {
        isActive: false,
      },
    }
  );

  // Delete sheet config
  await SheetConfig.findByIdAndDelete(
    id
  );

  return sheet;
};

module.exports = {
  getAllSheets,
  getSheetById,
  createSheet,
  updateSheet,
  toggleActive,
  deleteSheet,
};
