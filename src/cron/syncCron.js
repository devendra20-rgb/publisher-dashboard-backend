const cron = require("node-cron");

const {
  syncAllSheets,
} = require("../services/sync.service");

const {
  syncPublisherDetails,
} = require(
  "../services/publisherDetailSync.service"
);

const startCronJobs = () => {
  const schedule =
    process.env.CRON_SCHEDULE ||
    "*/5 * * * *";

  if (
    !cron.validate(schedule)
  ) {
    console.error(
      `❌ Invalid cron schedule: "${schedule}"`
    );

    return;
  }

  cron.schedule(
    schedule,
    async () => {
      console.log(
        `\n🕐 [${new Date().toISOString()}] Running scheduled sync…`
      );

      try {
        // Main Publisher Sync
        const result =
          await syncAllSheets();

        console.log(
          `✅ Publisher Sync done — sheets: ${result.total}, rows synced: ${result.synced}, errors: ${result.errors}`
        );

        // Publisher Details Sync
        const detailResult =
          await syncPublisherDetails();

        console.log(
          `✅ Publisher Details synced — rows: ${detailResult.synced}`
        );
      } catch (error) {
        console.error(
          `❌ Cron sync failed: ${error.message}`
        );
      }
    }
  );

  console.log(
    `✅ Cron job scheduled: "${schedule}"`
  );
};

module.exports = {
  startCronJobs,
};