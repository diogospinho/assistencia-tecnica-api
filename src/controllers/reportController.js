'use strict';

const reportService = require('../services/reportService');

const ordersByStatus = async (req, res, next) => {
  try { res.json(await reportService.ordersByStatus()); } catch (err) { next(err); }
};

const overdueOrders = async (req, res, next) => {
  try { res.json(await reportService.overdueOrders()); } catch (err) { next(err); }
};

const topTechnicians = async (req, res, next) => {
  try { res.json(await reportService.topTechnicians()); } catch (err) { next(err); }
};

const mostUsedParts = async (req, res, next) => {
  try { res.json(await reportService.mostUsedParts()); } catch (err) { next(err); }
};

const averageAttendanceTime = async (req, res, next) => {
  try { res.json(await reportService.averageAttendanceTime()); } catch (err) { next(err); }
};

module.exports = { ordersByStatus, overdueOrders, topTechnicians, mostUsedParts, averageAttendanceTime };
