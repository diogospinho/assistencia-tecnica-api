'use strict';

const serviceOrderService = require('../services/serviceOrderService');

const list = async (req, res, next) => {
  try {
    const { page, limit, status, priority, technicianId } = req.query;
    const result = await serviceOrderService.list({
      page: Number(page) || 1,
      limit: Number(limit) || 20,
      status, priority, technicianId,
    });
    res.json({ total: result.count, data: result.rows });
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    res.json(await serviceOrderService.getById(req.params.id));
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const order = await serviceOrderService.create(req.body, req.user.id);
    res.status(201).json(order);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    res.json(await serviceOrderService.update(req.params.id, req.body, req.user.id));
  } catch (err) { next(err); }
};

const assignTechnician = async (req, res, next) => {
  try {
    res.json(await serviceOrderService.assignTechnician(req.params.id, req.body.technicianId, req.user.id));
  } catch (err) { next(err); }
};

const conclude = async (req, res, next) => {
  try {
    res.json(await serviceOrderService.conclude(req.params.id, req.user.id));
  } catch (err) { next(err); }
};

const cancel = async (req, res, next) => {
  try {
    res.json(await serviceOrderService.cancel(req.params.id, req.body.cancelReason, req.user.id));
  } catch (err) { next(err); }
};

const getHistory = async (req, res, next) => {
  try {
    res.json(await serviceOrderService.getHistory(req.params.id));
  } catch (err) { next(err); }
};

const addPart = async (req, res, next) => {
  try {
    await serviceOrderService.addPart(req.params.id, req.body, req.user.id);
    res.status(201).json({ message: 'Peça vinculada com sucesso.' });
  } catch (err) { next(err); }
};

module.exports = { list, getById, create, update, assignTechnician, conclude, cancel, getHistory, addPart };
