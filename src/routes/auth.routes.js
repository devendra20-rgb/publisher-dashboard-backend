const express = require('express');
const { loginController, changePasswordController, logoutController, meController } = require('../controllers/auth.controller');
const validationMiddleware = require('../middleware/validation.middleware');
const { loginSchema, changePasswordSchema } = require('../validations/auth.validation');
const authMiddleware = require('../middleware/auth.middleware');

const router = express.Router();

router.post('/login', validationMiddleware(loginSchema), loginController);
router.get('/me', authMiddleware, meController);
router.post('/change-password', authMiddleware, validationMiddleware(changePasswordSchema), changePasswordController);
router.post('/logout', authMiddleware, logoutController);

module.exports = router;
