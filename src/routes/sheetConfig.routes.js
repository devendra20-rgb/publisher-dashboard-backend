const express = require("express");
const router = express.Router();
const ctrl = require("../controllers/sheetConfig.controller");

router.get("/", ctrl.getAllSheets);
router.get("/:id", ctrl.getSheetById);
router.post("/", ctrl.createSheet);
router.put("/:id", ctrl.updateSheet);
router.patch("/:id/toggle", ctrl.toggleActive);
router.delete("/:id", ctrl.deleteSheet);

module.exports = router;
