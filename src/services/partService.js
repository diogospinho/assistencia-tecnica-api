'use strict';

const { sequelize, Part, PartMovement } = require('../models');
const partRepository = require('../repositories/partRepository');

const appErr = (msg, code) => { const e = new Error(msg); e.statusCode = code; return e; };

const list = () => partRepository.findAll();

const getById = async (id) => {
  const part = await partRepository.findById(id);
  if (!part) throw appErr('Peça não encontrada.', 404);
  return part;
};

const create = async (data) => {
  const existing = await partRepository.findByCode(data.code);
  if (existing) throw appErr('Já existe uma peça com este código.', 409);
  return partRepository.create(data);
};

const update = async (id, data) => {
  await getById(id);
  const [, [updated]] = await partRepository.update(id, data);
  return updated;
};

const destroy = async (id) => {
  await getById(id);
  await partRepository.destroy(id);
};

const restock = async (id, { quantity, reason }, userId) => {
  if (!quantity || quantity < 1) throw appErr('Quantidade deve ser maior que zero.', 400);

  const part = await getById(id);

  await sequelize.transaction(async (t) => {
    await Part.update(
      { stock: part.stock + quantity },
      { where: { id }, transaction: t }
    );
    await PartMovement.create(
      { partId: id, quantity, type: 'in', reason: reason || 'Reposição de estoque', createdBy: userId },
      { transaction: t }
    );
  });

  return partRepository.findById(id);
};

const getMovements = (id) => partRepository.findMovements(id);

module.exports = { list, getById, create, update, destroy, restock, getMovements };
