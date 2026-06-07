'use strict';

const clientRepository = require('../repositories/clientRepository');
const viaCepService = require('./viaCepService');

const list = (query) => clientRepository.findAll(query);

const search = (q) => clientRepository.search(q);

const getById = async (id) => {
  const client = await clientRepository.findById(id);
  if (!client) {
    const err = new Error('Cliente não encontrado.');
    err.statusCode = 404;
    throw err;
  }
  return client;
};

const create = async (data) => {
  const existing = await clientRepository.findByCpf(data.cpf);
  if (existing) {
    const err = new Error('CPF já cadastrado.');
    err.statusCode = 409;
    throw err;
  }

  if (data.zipCode) {
    const address = await viaCepService.lookup(data.zipCode);
    Object.assign(data, address);
  }

  return clientRepository.create(data);
};

const update = async (id, data) => {
  await getById(id);

  if (data.zipCode) {
    const address = await viaCepService.lookup(data.zipCode);
    Object.assign(data, address);
  }

  const [, [updated]] = await clientRepository.update(id, data);
  return updated;
};

const destroy = async (id) => {
  await getById(id);
  await clientRepository.destroy(id);
};

module.exports = { list, search, getById, create, update, destroy };
