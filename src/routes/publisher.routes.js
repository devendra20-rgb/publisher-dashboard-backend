const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/publisher.controller");
/**
 * GET /api/publishers
 *
 * Filters:
 *   usedBy=Sagar
 *   market=India
 *   status=Active
 *   publisherName=Times
 *   sheetId=abc123
 *
 * Date Filters:
 *   startDate=2026-05-01
 *   endDate=2026-05-20
 *
 * Quick Ranges:
 *   range=last7days
 *   range=last30days
 *   range=thisMonth
 *
 * Pagination:
 *   page=1
 *   limit=20
 */
router.get("/", ctrl.getAllPublishers);

module.exports = router;
