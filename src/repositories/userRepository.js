'use strict';

const { User } = require('../models');

const findByEmail = (email) => User.findOne({ where: { email } });

const findById = (id) => User.findByPk(id);

const create = (data) => User.create(data);

const findAll = () => User.findAll({ attributes: { exclude: ['password'] } });

module.exports = { findByEmail, findById, create, findAll };
