const Joi = require('joi');

const customExportSchema = Joi.object({
  startDate: Joi.date().iso().required(),
  endDate: Joi.date().iso().required()
}).custom((value, helpers) => {
  if (new Date(value.startDate) > new Date(value.endDate)) {
    return helpers.error('any.invalid');
  }
  return value;
}, 'Date range validation');

module.exports = { customExportSchema };
