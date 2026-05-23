const cron = require("node-cron");
const { syncAllSheets } = require("../services/sync.service");

/**
 * Starts the background cron job that syncs all active Google Sheets.
 *
 * Schedule is read from CRON_SCHEDULE env var.
 * Default: every 15 minutes  →  "* /15 * * * *"  (without the space)
 */
const startCronJobs = () => {
  const schedule = process.env.CRON_SCHEDULE || "*/5 * * * *";

  if (!cron.validate(schedule)) {
    console.error(`❌  Invalid cron schedule: "${schedule}". Cron job not started.`);
    return;
  }

  cron.schedule(schedule, async () => {
    console.log(`\n🕐  [${new Date().toISOString()}] Running scheduled sheet sync…`);
    try {
      const result = await syncAllSheets();
      console.log(
        `✅  Sync done — sheets: ${result.total}, rows synced: ${result.synced}, errors: ${result.errors}`
      );
    } catch (error) {
      console.error(`❌  Cron sync failed: ${error.message}`);
    }
  });

  console.log(`✅  Cron job scheduled: "${schedule}"`);
};

module.exports = { startCronJobs };
