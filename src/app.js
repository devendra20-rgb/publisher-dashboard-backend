require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");

const connectDB = require("./config/db");
const { startCronJobs } = require("./cron/syncCron");

const sheetConfigRoutes = require("./routes/sheetConfig.routes");
const publisherRoutes = require("./routes/publisher.routes");
const statsRoutes = require("./routes/stats.routes");
const syncRoutes = require("./routes/sync.routes");
const publisherDetailRoutes = require("./routes/publisherDetail.routes");


const { errorHandler, notFound } = require("./utils/errorHandler");

// ── Bootstrap ────────────────────────────────────────────────────────────────
const app = express();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());

// ── Routes ────────────────────────────────────────────────────────────────────
app.use("/api/sheets", sheetConfigRoutes);
app.use("/api/publishers", publisherRoutes);
app.use("/api/stats", statsRoutes);
app.use("/api/sync", syncRoutes);
app.use("/api/publisher-details", publisherDetailRoutes);

app.get("/", (req, res) => {
  res.json({ message: "Publisher Dashboard API is running." });
});

// ── Error handling ────────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

// ── Start ─────────────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`✅  Server running on port ${PORT}`);
    startCronJobs();
  });
});
