'use strict';

const authService = require('../services/authService');

const login = async (req, res, next) => {
  try {
    const result = await authService.login(req.body.email, req.body.password);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const logout = async (req, res, next) => {
  try {
    await authService.logout(req.token);
    res.json({ message: 'Logout realizado com sucesso.' });
  } catch (err) {
    next(err);
  }
};

const register = async (req, res, next) => {
  try {
    const user = await authService.register(req.body, req.user);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

module.exports = { login, logout, register };
