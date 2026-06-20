const express = require('express');
const { listUsersController, createUserController, updateUserController, removeUserController, resetPasswordController, getUserController } = require('../controllers/user.controller');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');
const validationMiddleware = require('../middleware/validation.middleware');
const { createUserSchema, updateUserSchema } = require('../validations/user.validation');
const { resetPasswordSchema } = require('../validations/auth.validation');

const router = express.Router();

router.use(authMiddleware, adminMiddleware);
router.get('/', listUsersController);
router.post('/', validationMiddleware(createUserSchema), createUserController);
router.get('/:id', getUserController);
router.put('/:id', validationMiddleware(updateUserSchema), updateUserController);
router.delete('/:id', removeUserController);
router.patch('/reset-password/:id', validationMiddleware(resetPasswordSchema), resetPasswordController);

module.exports = router;
