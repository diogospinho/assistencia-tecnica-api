'use strict';

const Joi = require('joi');

const createSchema = Joi.object({
  name: Joi.string().min(2).max(150).required(),
  code: Joi.string().min(1).max(50).required(),
  description: Joi.string().optional().allow('', null),
  stock: Joi.number().integer().min(0).default(0),
  unit: Joi.string().max(20).default('un'),
  price: Joi.number().min(0).required(),
});

const updateSchema = createSchema.fork(['name', 'code', 'price'], (f) => f.optional());

const restockSchema = Joi.object({
  quantity: Joi.number().integer().min(1).required(),
  reason: Joi.string().optional().allow('', null),
});

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
  validateRestock: validate(restockSchema),
};
