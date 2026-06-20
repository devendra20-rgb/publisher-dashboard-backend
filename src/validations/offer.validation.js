const Joi = require('joi');

const offerSchema = Joi.object({
  campaignName: Joi.string().trim().min(2).max(200).required(),
  market: Joi.string().trim().max(100).required(),
  kpi: Joi.string().trim().allow('').max(500).default(''),
  costingModel: Joi.string().trim().allow('').max(100).default(''),
  payout: Joi.number().min(0).required(),
  note: Joi.string().trim().allow('').max(2000).default(''),
  publisherId: Joi.string().hex().length(24).required(),
  status: Joi.string().trim().max(50).required(),
  endDate: Joi.date().iso().required(),
  paymentDetails: Joi.forbidden()
});

const nullableDate = Joi.date().iso().allow(null, '');
const paymentDetailsSchema = Joi.object({
  publisherName: Joi.string().trim().allow('').max(150).default(''),
  agencyPOC: Joi.string().trim().allow('').max(150).default(''),
  endDate: nullableDate,
  validationDate: nullableDate,
  invoiceDate: nullableDate,
  paymentDate: nullableDate,
  publisherConfirmation: Joi.string().trim().allow('').max(500).default('')
});

module.exports = { offerSchema, paymentDetailsSchema };
