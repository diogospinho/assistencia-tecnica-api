'use strict';

const partService = require('../services/partService');

const list = async (req, res, next) => {
  try { res.json(await partService.list()); } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try { res.json(await partService.getById(req.params.id)); } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try { res.status(201).json(await partService.create(req.body)); } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try { res.json(await partService.update(req.params.id, req.body)); } catch (err) { next(err); }
};

const destroy = async (req, res, next) => {
  try {
    await partService.destroy(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
};

const restock = async (req, res, next) => {
  try { res.json(await partService.restock(req.params.id, req.body, req.user.id)); } catch (err) { next(err); }
};

const getMovements = async (req, res, next) => {
  try { res.json(await partService.getMovements(req.params.id)); } catch (err) { next(err); }
};

module.exports = { list, getById, create, update, destroy, restock, getMovements };
