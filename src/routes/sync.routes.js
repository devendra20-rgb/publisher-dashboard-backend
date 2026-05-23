const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/sync.controller");

// POST /api/sync  — trigger a manual full sync
router.post("/", ctrl.manualSync);

module.exports = router;
