'use strict';

const axios = require('axios');

const lookup = async (zipCode) => {
  const cep = zipCode.replace(/\D/g, '');
  if (cep.length !== 8) {
    const err = new Error('CEP inválido. Informe 8 dígitos numéricos.');
    err.statusCode = 400;
    throw err;
  }

  const { data } = await axios.get(`https://viacep.com.br/ws/${cep}/json/`);

  if (data.erro) {
    const err = new Error('CEP não encontrado.');
    err.statusCode = 400;
    throw err;
  }

  return {
    street: data.logradouro || null,
    neighborhood: data.bairro || null,
    city: data.localidade || null,
    state: data.uf || null,
  };
};

module.exports = { lookup };
