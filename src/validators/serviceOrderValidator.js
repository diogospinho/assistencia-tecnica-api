'use strict';

const Joi = require('joi');

const createSchema = Joi.object({
  clientId: Joi.string().uuid().required(),
  equipment: Joi.string().min(2).max(200).required(),
  problemDescription: Joi.string().min(5).required(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').default('medium'),
  technicianId: Joi.string().uuid().optional().allow(null),
});

const updateSchema = Joi.object({
  equipment: Joi.string().min(2).max(200).optional(),
  problemDescription: Joi.string().min(5).optional(),
  priority: Joi.string().valid('low', 'medium', 'high', 'urgent').optional(),
  notes: Joi.string().optional().allow('', null),
});

const cancelSchema = Joi.object({
  cancelReason: Joi.string().min(5).required().messages({
    'any.required': 'Motivo de cancelamento é obrigatório.',
    'string.min': 'Motivo deve ter pelo menos 5 caracteres.',
  }),
});

const addPartSchema = Joi.object({
  partId: Joi.string().uuid().required(),
  quantity: Joi.number().integer().min(1).required(),
});

const assignSchema = Joi.object({
  technicianId: Joi.string().uuid().required(),
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
  validateCancel: validate(cancelSchema),
  validateAddPart: validate(addPartSchema),
  validateAssign: validate(assignSchema),
};
