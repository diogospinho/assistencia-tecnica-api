'use strict';

const { Part, PartMovement } = require('../models');

const findAll = () => Part.findAll({ order: [['name', 'ASC']] });

const findById = (id) => Part.findByPk(id);

const findByCode = (code) => Part.findOne({ where: { code } });

const create = (data) => Part.create(data);

const update = (id, data) => Part.update(data, { where: { id }, returning: true });

const destroy = (id) => Part.destroy({ where: { id } });

const findMovements = (partId) =>
  PartMovement.findAll({
    where: { partId },
    order: [['createdAt', 'DESC']],
  });

module.exports = { findAll, findById, findByCode, create, update, destroy, findMovements };
