'use strict';

const Joi = require('joi');

const createSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  cpf: Joi.string().pattern(/^\d{3}\.\d{3}\.\d{3}-\d{2}$|^\d{11}$/).required().messages({
    'string.pattern.base': 'CPF inválido. Use o formato 000.000.000-00 ou 11 dígitos.',
  }),
  phone: Joi.string().min(8).max(20).required(),
  email: Joi.string().email().optional().allow('', null),
  zipCode: Joi.string().optional().allow('', null),
  number: Joi.string().max(10).optional().allow('', null),
  complement: Joi.string().max(100).optional().allow('', null),
});

const updateSchema = createSchema.fork(['name', 'cpf', 'phone'], (f) => f.optional());

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: 'Dados inválidos.', errors: error.details.map(d => d.message) });
  }
  next();
};

module.exports = {
  validateCreate: validate(createSchema),
  validateUpdate: validate(updateSchema),
};
