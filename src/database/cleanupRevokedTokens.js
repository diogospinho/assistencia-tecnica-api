'use strict';

require('dotenv').config();
const jwt = require('jsonwebtoken');
const { sequelize, RevokedToken } = require('../models');

const cleanup = async () => {
  const tokens = await RevokedToken.findAll();
  let removed = 0;

  for (const record of tokens) {
    try {
      jwt.verify(record.token, process.env.JWT_SECRET);
    } catch {
      await record.destroy();
      removed += 1;
    }
  }

  return removed;
};

cleanup()
  .then((removed) => {
    console.log(`Limpeza concluída. ${removed} token(s) expirado(s) removido(s).`);
    return sequelize.close();
  })
  .catch(async (err) => {
    console.error('Erro ao limpar tokens revogados:', err);
    await sequelize.close();
    process.exit(1);
  });
