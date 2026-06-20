const Joi = require('joi');
const { ADMIN, INDIVIDUAL } = require('../constants/roles');

const createUserSchema = Joi.object({
  name: Joi.string().trim().min(2).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(8).pattern(/(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])/).required(),
  role: Joi.string().valid(INDIVIDUAL).required(),
  active: Joi.boolean().required()
});

const updateUserSchema = Joi.object({
  name: Joi.string().trim().min(2),
  email: Joi.string().email(),
  role: Joi.string().valid(INDIVIDUAL),
  active: Joi.boolean()
}).or('name', 'email', 'role', 'active');

module.exports = { createUserSchema, updateUserSchema };
