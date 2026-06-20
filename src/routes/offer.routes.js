const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const adminMiddleware = require('../middleware/admin.middleware');
const validationMiddleware = require('../middleware/validation.middleware');
const { offerSchema, paymentDetailsSchema } = require('../validations/offer.validation');
const controller = require('../controllers/offer.controller');

const router = express.Router();
router.use(authMiddleware);
router.get('/', controller.list);
router.post('/', validationMiddleware(offerSchema), controller.create);
router.patch('/:id/payment-details', adminMiddleware, validationMiddleware(paymentDetailsSchema), controller.payment);
router.get('/:id', controller.details);
router.put('/:id', validationMiddleware(offerSchema), controller.update);
router.delete('/:id', adminMiddleware, controller.remove);

module.exports = router;
