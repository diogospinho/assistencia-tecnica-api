'use strict';

const { ServiceOrder, ServiceOrderHistory, Client, User, Part, ServiceOrderPart } = require('../models');
const { Op } = require('sequelize');

const defaultIncludes = [
  { model: Client, as: 'client', attributes: ['id', 'name', 'cpf', 'phone'] },
  { model: User, as: 'technician', attributes: ['id', 'name', 'email'] },
  { model: User, as: 'creator', attributes: ['id', 'name'] },
  { model: Part, as: 'parts', through: { attributes: ['quantity', 'unitPrice'] } },
];

const findAll = ({ page = 1, limit = 20, status, priority, technicianId } = {}) => {
  const where = {};
  if (status) where.status = status;
  if (priority) where.priority = priority;
  if (technicianId) where.technicianId = technicianId;

  return ServiceOrder.findAndCountAll({
    where,
    include: defaultIncludes,
    limit,
    offset: (page - 1) * limit,
    order: [['openedAt', 'DESC']],
    distinct: true,
  });
};

const findById = (id) =>
  ServiceOrder.findByPk(id, {
    include: [
      ...defaultIncludes,
      { model: ServiceOrderHistory, as: 'history', include: [{ model: User, as: 'changedByUser', attributes: ['id', 'name'] }] },
    ],
  });

const create = (data) => ServiceOrder.create(data);

const update = (id, data) => ServiceOrder.update(data, { where: { id }, returning: true });

const countTechnicianActive = (technicianId, excludeId = null) => {
  const where = { technicianId, status: 'in_progress' };
  if (excludeId) where.id = { [Op.ne]: excludeId };
  return ServiceOrder.count({ where });
};

const generateOrderNumber = async () => {
  const count = await ServiceOrder.count();
  return `OS${String(count + 1).padStart(6, '0')}`;
};

const findOverdue = () =>
  ServiceOrder.findAll({
    where: {
      status: { [Op.in]: ['open', 'in_progress'] },
      openedAt: { [Op.lt]: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) },
    },
    include: defaultIncludes,
    order: [['openedAt', 'ASC']],
  });

module.exports = {
  findAll,
  findById,
  create,
  update,
  countTechnicianActive,
  generateOrderNumber,
  findOverdue,
};
