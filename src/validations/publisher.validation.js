const Joi = require('joi');

const publisherSchema = Joi.object({
  name: Joi.string().trim().min(2).max(150).required(),
  market: Joi.string().trim().max(100).required(),
  poc: Joi.string().trim().max(150).required(),
  status: Joi.string().trim().max(50).required(),
  wishlist: Joi.string().trim().allow('').max(1000).default(''),
  agencyPoc: Joi.string().trim().allow('').max(150).default('')
});

module.exports = { publisherSchema };
