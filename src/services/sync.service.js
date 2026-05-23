const SheetConfig = require("../models/SheetConfig.model");
const PublisherData = require("../models/PublisherData.model");
const { fetchSheetRows } = require("./googleSheets.service");

const parseDate = (value) => {
  if (!value) return null;

  const parts = value.split("-");

  if (parts.length !== 3) return null;

  const [day, month, year] = parts;

  return new Date(`${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`);
};



/**
 * Sync all active Google Sheets into MongoDB.
 *
 * For each active sheet:
 *   1. Fetch rows from the Google Sheet
 *   2. Upsert each row into PublisherData using (publisherName + sheetId)
 *      as the unique key — so re-running never creates duplicates.
 *
 * @returns {Object} summary  - { synced, errors, total }
 */
const syncAllSheets = async () => {
  const activeSheets = await SheetConfig.find({ active: true });

  if (activeSheets.length === 0) {
    console.log("ℹ️  No active sheets to sync.");
    return { synced: 0, errors: 0, total: 0 };
  }

  let totalSynced = 0;
  let totalErrors = 0;

  for (const sheet of activeSheets) {
    try {
      const result = await syncSingleSheet(sheet);
      totalSynced += result.synced;
      console.log(
        `✅  [${sheet.usedBy}] "${sheet.sheetName}" — ${result.synced} rows upserted`,
      );
    } catch (error) {
      totalErrors += 1;
      console.error(
        `❌  Failed to sync sheet "${sheet.sheetName}" (${sheet.sheetId}): ${error.message}`,
      );
    }
  }

  return {
    synced: totalSynced,
    errors: totalErrors,
    total: activeSheets.length,
  };
};

/**
 * Sync a single SheetConfig document.
 * Returns { synced: number }
 */
const syncSingleSheet = async (sheet) => {
  const rows = await fetchSheetRows(sheet.sheetId, sheet.range);

  if (rows.length === 0) {
    return { synced: 0 };
  }

  // Existing MongoDB records for this sheet
  const existingDocs = await PublisherData.find({
    sheetId: sheet.sheetId,
  });

  // Current publisher names from sheet
  const incomingPublisherNames = rows.map((row) => row.publisherName);

  // Find removed publishers
  const removedDocs = existingDocs.filter(
    (doc) => !incomingPublisherNames.includes(doc.publisherName),
  );

  // Mark removed publishers inactive
  if (removedDocs.length > 0) {
    const removedIds = removedDocs.map((doc) => doc._id);

    await PublisherData.updateMany(
      {
        _id: { $in: removedIds },
      },
      {
        $set: {
          isActive: false,
        },
      },
    );

    console.log(`⚠️  Marked ${removedDocs.length} publishers inactive`);
  }

  // Build bulk upsert operations
  const operations = rows.map((row) => ({
    updateOne: {
      filter: {
        publisherName: row.publisherName,
        sheetId: sheet.sheetId,
      },
      update: {
        $set: {
          ...row,

          contactDate: parseDate(row.contactDate),

          usedBy: sheet.usedBy,

          sheetId: sheet.sheetId,

          isActive: true,
        },
      },
      upsert: true,
    },
  }));

  await PublisherData.bulkWrite(operations, { ordered: false });

  return { synced: rows.length };
};

module.exports = { syncAllSheets, syncSingleSheet };
