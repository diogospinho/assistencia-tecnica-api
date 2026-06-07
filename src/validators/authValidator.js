'use strict';

const Joi = require('joi');

const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'E-mail inválido.',
    'any.required': 'E-mail é obrigatório.',
  }),
  password: Joi.string().min(6).required().messages({
    'any.required': 'Senha é obrigatória.',
  }),
});

const registerSchema = Joi.object({
  name: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid('admin', 'technician', 'attendant').required(),
});

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    return res.status(400).json({ message: 'Dados inválidos.', errors: error.details.map(d => d.message) });
  }
  next();
};

module.exports = {
  validateLogin: validate(loginSchema),
  validateRegister: validate(registerSchema),
};
