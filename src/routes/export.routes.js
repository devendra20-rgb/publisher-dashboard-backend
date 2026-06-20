const express = require('express');
const { monthlyExportController, customExportController } = require('../controllers/export.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');
const validationMiddleware = require('../middleware/validation.middleware');
const { customExportSchema } = require('../validations/export.validation');

const router = express.Router();
router.use(authMiddleware, adminMiddleware);
router.get('/:type/monthly', monthlyExportController);
router.get('/:type/custom', validationMiddleware(customExportSchema, 'query'), customExportController);

module.exports = router;

