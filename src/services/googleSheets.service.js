// const { getSheetsClient } = require("../config/googleSheets");

// /**
//  * Expected column order in every sheet (0-indexed):
//  *   0 Market | 1 Publisher Name | 2 Publisher POC |
//  *   3 Contact Date | 4 Agency POC | 5 Status | 6 Notes
//  */
// const COLUMN_MAP = [
//   "market",
//   "publisherName",
//   "publisherPOC",
//   "contactDate",
//   "agencyPOC",
//   "status",
//   "notes",
// ];

// /**
//  * Fetch all data rows from a single Google Sheet.
//  *
//  * @param {string} sheetId  - The spreadsheet ID from the URL
//  * @param {string} range    - A1 notation range, e.g. "Sheet1!A:G"
//  * @returns {Array<Object>} - Array of normalized row objects
//  */
// const fetchSheetRows = async (sheetId, range = "Sheet1!A:G") => {
//   const sheets = getSheetsClient();

//   const response = await sheets.spreadsheets.values.get({
//     spreadsheetId: sheetId,
//     range,
//   });

//   const rows = response.data.values || [];

//   if (rows.length === 0) return [];

//   // Skip the first row if it looks like a header
//   const firstRow = rows[0].map((cell) => String(cell).trim().toLowerCase());
//   const isHeader =
//     firstRow.includes("market") ||
//     firstRow.includes("publisher name") ||
//     firstRow.includes("publishername");

//   const dataRows = isHeader ? rows.slice(1) : rows;

//   return dataRows
//     .map((row) => normalizeRow(row))
//     .filter((r) => r.publisherName); // drop empty rows
// };

// /**
//  * Convert a raw sheet row (array of strings) into a plain object
//  * using COLUMN_MAP.  Missing cells become empty strings.
//  */
// const normalizeRow = (row) => {
//   const obj = {};
//   COLUMN_MAP.forEach((key, index) => {
//     obj[key] = (row[index] || "").toString().trim();
//   });
//   return obj;
// };

// module.exports = { fetchSheetRows };

const { getSheetsClient } = require("../config/googleSheets");

/**
 * MAIN PUBLISHER SHEET
 * Columns:
 * 0 Market
 * 1 Publisher Name
 * 2 Publisher POC
 * 3 Contact Date
 * 4 Agency POC
 * 5 Status
 * 6 Notes
 */

const COLUMN_MAP = [
  "market",
  "publisherName",
  "publisherPOC",
  "contactDate",
  "agencyPOC",
  "status",
  "notes",
];

/**
 * PUBLISHER DETAILS SHEET
 * Columns:
 * 0 Pub ID
 * 1 Publisher Name
 * 2 Market
 * 3 Campaign Wishlist
 * 4 Campaign Type
 * 5 MMP Tracking Tool
 */

const DETAIL_COLUMN_MAP = [
  "pubId",
  "publisherName",
  "market",
  "campaignWishlist",
  "campaignType",
  "mmpTrackingTool",
];

/**
 * COMMON FETCH
 */

const getRowsFromSheet =
  async (sheetId, range) => {

    const sheets =
      getSheetsClient();

    const response =
      await sheets
        .spreadsheets.values.get({
          spreadsheetId:
            sheetId,
          range,
        });

    return (
      response.data.values || []
    );
  };

/**
 * MAIN PUBLISHERS
 */

const fetchSheetRows =
  async (
    sheetId,
    range = "Sheet1!A:G"
  ) => {

    const rows =
      await getRowsFromSheet(
        sheetId,
        range
      );

    if (!rows.length)
      return [];

    const dataRows =
      rows.slice(1);

    return dataRows
      .map((row) =>
        normalizeRow(
          row,
          COLUMN_MAP
        )
      )
      .filter(
        (r) =>
          r.publisherName
      );
  };

/**
 * PUBLISHER DETAILS
 */

const fetchPublisherDetailRows =
  async (
    sheetId,
    range = "Sheet1!A:F"
  ) => {

    const rows =
      await getRowsFromSheet(
        sheetId,
        range
      );

    if (!rows.length)
      return [];

    const dataRows =
      rows.slice(1);

    return dataRows
      .map((row) =>
        normalizeRow(
          row,
          DETAIL_COLUMN_MAP
        )
      )
      .filter(
        (r) =>
          r.publisherName
      );
  };

/**
 * NORMALIZER
 */

const normalizeRow = (
  row,
  map
) => {

  const obj = {};

  map.forEach(
    (key, index) => {

      obj[key] = (
        row[index] || ""
      )
        .toString()
        .trim();
    }
  );

  return obj;
};

module.exports = {
  fetchSheetRows,
  fetchPublisherDetailRows,
};