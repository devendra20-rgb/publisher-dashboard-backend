const { errorResponse } = require('../utils/apiResponse');

function validationMiddleware(schema, source = 'body') {
  return (req, res, next) => {
    const target = source === 'query' ? req.query : req.body;
    const { error, value } = schema.validate(target, { abortEarly: false, allowUnknown: false });
    if (error) {
      const errors = error.details.map((detail) => detail.message);
      return errorResponse(res, 400, 'Validation failed', errors);
    }
    if (source === 'query') {
      req.query = value;
    } else {
      req.body = value;
    }
    return next();
  };
}

module.exports = validationMiddleware;
