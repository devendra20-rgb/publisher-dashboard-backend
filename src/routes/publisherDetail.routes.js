const express = require("express");

const router =
  express.Router();

const ctrl =
  require("../controllers/publisherDetail.controller");

router.get(
  "/",
  ctrl.getPublisherDetails
);

router.post(
  "/sync",
  ctrl.manualSync
);

module.exports = router;