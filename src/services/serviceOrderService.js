'use strict';

const { sequelize, ServiceOrderHistory, Part, ServiceOrderPart, PartMovement } = require('../models');
const serviceOrderRepository = require('../repositories/serviceOrderRepository');
const clientRepository = require('../repositories/clientRepository');
const userRepository = require('../repositories/userRepository');

const appErr = (msg, code) => { const e = new Error(msg); e.statusCode = code; return e; };

const list = (query) => serviceOrderRepository.findAll(query);

const getById = async (id) => {
  const order = await serviceOrderRepository.findById(id);
  if (!order) throw appErr('Ordem de serviço não encontrada.', 404);
  return order;
};

const create = async (data, userId) => {
  const client = await clientRepository.findById(data.clientId);
  if (!client) throw appErr('Cliente não encontrado.', 404);

  const orderNumber = await serviceOrderRepository.generateOrderNumber();

  const order = await serviceOrderRepository.create({
    ...data,
    orderNumber,
    createdBy: userId,
    openedAt: new Date(),
  });

  await ServiceOrderHistory.create({
    serviceOrderId: order.id,
    previousStatus: null,
    newStatus: order.status,
    changedBy: userId,
    notes: 'Ordem de serviço criada.',
  });

  return serviceOrderRepository.findById(order.id);
};

const update = async (id, data, userId) => {
  const order = await getById(id);

  if (order.status === 'concluded') throw appErr('Ordens concluídas não podem ser editadas.', 403);
  if (order.status === 'canceled') throw appErr('Ordens canceladas não podem ser editadas.', 403);

  if (data.status && data.status !== order.status) {
    await ServiceOrderHistory.create({
      serviceOrderId: order.id,
      previousStatus: order.status,
      newStatus: data.status,
      changedBy: userId,
      notes: data.notes || null,
    });
  }

  await serviceOrderRepository.update(id, data);
  return serviceOrderRepository.findById(id);
};

const assignTechnician = async (id, technicianId, userId) => {
  const order = await getById(id);
  if (order.status === 'concluded' || order.status === 'canceled') {
    throw appErr('Não é possível atribuir técnico a uma ordem finalizada.', 403);
  }

  const technician = await userRepository.findById(technicianId);
  if (!technician || technician.role !== 'technician') throw appErr('Técnico não encontrado.', 404);

  const activeCount = await serviceOrderRepository.countTechnicianActive(technicianId, id);
  if (activeCount >= 5) throw appErr('Técnico já possui 5 ordens em andamento. Limite atingido.', 422);

  const previousStatus = order.status;
  const newStatus = order.status === 'open' ? 'in_progress' : order.status;

  await serviceOrderRepository.update(id, { technicianId, status: newStatus });

  await ServiceOrderHistory.create({
    serviceOrderId: id,
    previousStatus,
    newStatus,
    changedBy: userId,
    notes: `Técnico ${technician.name} atribuído à ordem.`,
  });

  return serviceOrderRepository.findById(id);
};

const conclude = async (id, userId) => {
  const order = await getById(id);

  if (order.status === 'concluded') throw appErr('Ordem já está concluída.', 422);
  if (order.status === 'canceled') throw appErr('Ordem cancelada não pode ser concluída.', 422);
  if (!order.technicianId) throw appErr('Não é possível concluir uma ordem sem técnico responsável.', 422);

  const concludedAt = new Date();
  const attendanceTimeMinutes = Math.round((concludedAt - new Date(order.openedAt)) / 60000);

  await serviceOrderRepository.update(id, { status: 'concluded', concludedAt, attendanceTimeMinutes });

  await ServiceOrderHistory.create({
    serviceOrderId: id,
    previousStatus: order.status,
    newStatus: 'concluded',
    changedBy: userId,
    notes: `Ordem concluída. Tempo de atendimento: ${attendanceTimeMinutes} minutos.`,
  });

  return serviceOrderRepository.findById(id);
};

const cancel = async (id, cancelReason, userId) => {
  const order = await getById(id);

  if (order.status === 'concluded') throw appErr('Ordens concluídas não podem ser canceladas.', 403);
  if (order.status === 'canceled') throw appErr('Ordem já está cancelada.', 422);
  if (!cancelReason || !cancelReason.trim()) throw appErr('Motivo de cancelamento é obrigatório.', 422);

  await serviceOrderRepository.update(id, { status: 'canceled', cancelReason });

  await ServiceOrderHistory.create({
    serviceOrderId: id,
    previousStatus: order.status,
    newStatus: 'canceled',
    changedBy: userId,
    notes: `Cancelamento: ${cancelReason}`,
  });

  return serviceOrderRepository.findById(id);
};

const getHistory = async (id) => {
  await getById(id);
  return ServiceOrderHistory.findAll({
    where: { serviceOrderId: id },
    order: [['createdAt', 'ASC']],
    include: [{ model: require('../models').User, as: 'changedByUser', attributes: ['id', 'name'] }],
  });
};

const addPart = async (serviceOrderId, { partId, quantity }, userId) => {
  const order = await getById(serviceOrderId);
  if (order.status === 'concluded') throw appErr('Não é possível adicionar peças a uma ordem concluída.', 403);
  if (order.status === 'canceled') throw appErr('Não é possível adicionar peças a uma ordem cancelada.', 403);

  const part = await Part.findByPk(partId);
  if (!part) throw appErr('Peça não encontrada.', 404);
  if (part.stock <= 0) throw appErr(`Peça "${part.name}" sem estoque disponível.`, 422);
  if (part.stock < quantity) throw appErr(`Estoque insuficiente. Disponível: ${part.stock} ${part.unit}.`, 422);

  return sequelize.transaction(async (t) => {
    await ServiceOrderPart.create(
      { serviceOrderId, partId, quantity, unitPrice: part.price },
      { transaction: t }
    );

    await Part.update(
      { stock: part.stock - quantity },
      { where: { id: partId }, transaction: t }
    );

    await PartMovement.create(
      { partId, serviceOrderId, quantity, type: 'out', reason: `Utilizada na OS ${order.orderNumber}`, createdBy: userId },
      { transaction: t }
    );
  });
};

module.exports = { list, getById, create, update, assignTechnician, conclude, cancel, getHistory, addPart };
