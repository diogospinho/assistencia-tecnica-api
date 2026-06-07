'use strict';

const jwt = require('jsonwebtoken');
const { RevokedToken } = require('../models');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token de autenticação não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const revoked = await RevokedToken.findOne({ where: { token } });
    if (revoked) {
      return res.status(401).json({ message: 'Token inválido ou expirado.' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    req.token = token;
    next();
  } catch {
    return res.status(401).json({ message: 'Token inválido ou expirado.' });
  }
};

const invalidateToken = (token) =>
  RevokedToken.findOrCreate({
    where: { token },
    defaults: { token, revokedAt: new Date() },
  });

module.exports = { authenticate, invalidateToken };
