'use strict';

const clientService = require('../services/clientService');

const list = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const result = await clientService.list({ page: Number(page) || 1, limit: Number(limit) || 20 });
    res.json({ total: result.count, data: result.rows });
  } catch (err) { next(err); }
};

const search = async (req, res, next) => {
  try {
    const data = await clientService.search(req.query.q || '');
    res.json(data);
  } catch (err) { next(err); }
};

const getById = async (req, res, next) => {
  try {
    const client = await clientService.getById(req.params.id);
    res.json(client);
  } catch (err) { next(err); }
};

const create = async (req, res, next) => {
  try {
    const client = await clientService.create(req.body);
    res.status(201).json(client);
  } catch (err) { next(err); }
};

const update = async (req, res, next) => {
  try {
    const client = await clientService.update(req.params.id, req.body);
    res.json(client);
  } catch (err) { next(err); }
};

const destroy = async (req, res, next) => {
  try {
    await clientService.destroy(req.params.id);
    res.status(204).send();
  } catch (err) { next(err); }
};

module.exports = { list, search, getById, create, update, destroy };
