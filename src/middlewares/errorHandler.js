'use strict';

const errorHandler = (err, req, res, next) => {
  if (err.name === 'ValidationError' || err.isJoi) {
    return res.status(400).json({ message: 'Dados inválidos.', errors: err.details?.map(d => d.message) || err.message });
  }

  if (err.name === 'SequelizeUniqueConstraintError') {
    const field = err.errors[0]?.path;
    return res.status(409).json({ message: `Já existe um registro com este ${field}.` });
  }

  if (err.name === 'SequelizeValidationError') {
    return res.status(400).json({ message: 'Erro de validação.', errors: err.errors.map(e => e.message) });
  }

  if (err.statusCode) {
    return res.status(err.statusCode).json({ message: err.message });
  }

  console.error(err);
  return res.status(500).json({ message: 'Erro interno do servidor.' });
};

module.exports = errorHandler;
