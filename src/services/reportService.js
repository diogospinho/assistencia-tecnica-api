'use strict';

const { sequelize, ServiceOrder, User, Part, ServiceOrderPart } = require('../models');
const { Op, fn, col, literal } = require('sequelize');

const ordersByStatus = async () => {
  const rows = await ServiceOrder.findAll({
    attributes: ['status', [fn('COUNT', col('id')), 'total']],
    group: ['status'],
    raw: true,
  });
  return rows;
};

const overdueOrders = async () => {
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  return ServiceOrder.findAll({
    where: {
      status: { [Op.in]: ['open', 'in_progress'] },
      openedAt: { [Op.lt]: sevenDaysAgo },
    },
    include: [
      { model: User, as: 'technician', attributes: ['id', 'name'] },
      { model: require('../models').Client, as: 'client', attributes: ['id', 'name', 'phone'] },
    ],
    order: [['openedAt', 'ASC']],
  });
};

const topTechnicians = async () => {
  const rows = await ServiceOrder.findAll({
    attributes: [
      'technicianId',
      [fn('COUNT', col('ServiceOrder.id')), 'totalOrders'],
    ],
    where: { technicianId: { [Op.ne]: null } },
    include: [{ model: User, as: 'technician', attributes: ['name', 'email'] }],
    group: ['technicianId', 'technician.id'],
    order: [[literal('"totalOrders"'), 'DESC']],
    limit: 10,
    raw: false,
  });
  return rows.map(r => ({
    technician: r.technician,
    totalOrders: Number(r.dataValues.totalOrders),
  }));
};

const mostUsedParts = async () => {
  const rows = await ServiceOrderPart.findAll({
    attributes: [
      'partId',
      [fn('SUM', col('quantity')), 'totalUsed'],
    ],
    include: [{ model: Part, as: 'part', attributes: ['name', 'code', 'unit'] }],
    group: ['partId', 'part.id'],
    order: [[literal('"totalUsed"'), 'DESC']],
    limit: 10,
    raw: false,
  });
  return rows.map(r => ({
    part: r.part,
    totalUsed: Number(r.dataValues.totalUsed),
  }));
};

const averageAttendanceTime = async () => {
  const result = await ServiceOrder.findOne({
    attributes: [[fn('AVG', col('attendance_time_minutes')), 'averageMinutes']],
    where: { status: 'concluded', attendanceTimeMinutes: { [Op.ne]: null } },
    raw: true,
  });
  const avg = result?.averageMinutes ? Math.round(Number(result.averageMinutes)) : 0;
  return {
    averageMinutes: avg,
    averageHours: (avg / 60).toFixed(2),
  };
};

module.exports = { ordersByStatus, overdueOrders, topTechnicians, mostUsedParts, averageAttendanceTime };
