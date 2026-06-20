const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const validationMiddleware = require('../middleware/validation.middleware');
const { publisherSchema } = require('../validations/publisher.validation');
const controller = require('../controllers/publisher.controller');

const router = express.Router();
router.use(authMiddleware);
router.get('/', controller.list);
router.post('/', validationMiddleware(publisherSchema), controller.create);
router.get('/:id/offers', controller.offers);
router.get('/:id', controller.details);
router.put('/:id', validationMiddleware(publisherSchema), controller.update);
router.delete('/:id', controller.remove);

module.exports = router;
