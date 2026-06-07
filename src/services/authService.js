'use strict';

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const { invalidateToken } = require('../middlewares/auth');

const login = async (email, password) => {
  const user = await userRepository.findByEmail(email);
  if (!user || !user.active) {
    const err = new Error('Credenciais inválidas.');
    err.statusCode = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) {
    const err = new Error('Credenciais inválidas.');
    err.statusCode = 401;
    throw err;
  }

  const token = jwt.sign(
    { id: user.id, name: user.name, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
  );

  return { token, user: { id: user.id, name: user.name, email: user.email, role: user.role } };
};

const logout = async (token) => {
  await invalidateToken(token);
};

const register = async (data, requestingUser) => {
  if (requestingUser.role !== 'admin') {
    const err = new Error('Apenas administradores podem criar usuários.');
    err.statusCode = 403;
    throw err;
  }

  const existing = await userRepository.findByEmail(data.email);
  if (existing) {
    const err = new Error('E-mail já está em uso.');
    err.statusCode = 409;
    throw err;
  }

  const hashed = await bcrypt.hash(data.password, 10);
  const user = await userRepository.create({ ...data, password: hashed });

  return { id: user.id, name: user.name, email: user.email, role: user.role };
};

module.exports = { login, logout, register };
