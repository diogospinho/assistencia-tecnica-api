'use strict';

const { Client } = require('../models');
const { Op } = require('sequelize');

const findAll = ({ page = 1, limit = 20 } = {}) => {
  const offset = (page - 1) * limit;
  return Client.findAndCountAll({ limit, offset, order: [['name', 'ASC']] });
};

const search = (q) => {
  const like = { [Op.iLike]: `%${q}%` };
  return Client.findAll({
    where: {
      [Op.or]: [
        { name: like },
        { cpf: { [Op.iLike]: `%${q}%` } },
        { email: like },
        { phone: like },
      ],
    },
    order: [['name', 'ASC']],
  });
};

const findById = (id) => Client.findByPk(id);

const findByCpf = (cpf) => Client.findOne({ where: { cpf } });

const create = (data) => Client.create(data);

const update = (id, data) => Client.update(data, { where: { id }, returning: true });

const destroy = (id) => Client.destroy({ where: { id } });

module.exports = { findAll, search, findById, findByCpf, create, update, destroy };
