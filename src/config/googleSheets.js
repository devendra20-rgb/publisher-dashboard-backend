const { google } = require("googleapis");
const path = require("path");
const fs = require("fs");

/**
 * Returns an authenticated Google Sheets client using a Service Account.
 *
 * Make sure GOOGLE_SERVICE_ACCOUNT_KEY_PATH in your .env points to the
 * downloaded service-account JSON file.
 */
const getSheetsClient = () => {
  const keyPath = path.resolve(process.env.GOOGLE_SERVICE_ACCOUNT_KEY_PATH);

  if (!fs.existsSync(keyPath)) {
    throw new Error(
      `Google service account key not found at: ${keyPath}. ` +
        "Set GOOGLE_SERVICE_ACCOUNT_KEY_PATH in your .env file."
    );
  }

  const auth = new google.auth.GoogleAuth({
    keyFile: keyPath,
    scopes: ["https://www.googleapis.com/auth/spreadsheets.readonly"],
  });

  return google.sheets({ version: "v4", auth });
};

module.exports = { getSheetsClient };
