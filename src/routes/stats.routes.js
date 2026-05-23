const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/stats.controller");

router.get("/overview", ctrl.getOverview);
router.get("/monthly", ctrl.getMonthly);       // ?year=2025
router.get("/by-person", ctrl.getByPerson);
router.get("/by-sheet", ctrl.getBySheet);
router.get("/by-status", ctrl.getByStatus);

module.exports = router;
