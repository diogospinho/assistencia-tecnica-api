'use strict';

const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    const hash = (pwd) => bcrypt.hashSync(pwd, 10);
    const now = new Date();

    await queryInterface.bulkInsert('users', [
      {
        id: uuidv4(),
        name: 'Administrador',
        email: 'admin@assistencia.com',
        password: hash('Admin@123'),
        role: 'admin',
        active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        name: 'Diogo Pinho',
        email: 'diogo@assistencia.com',
        password: hash('Tecnico@123'),
        role: 'technician',
        active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        name: 'Yan Marra',
        email: 'yan@assistencia.com',
        password: hash('Tecnico@123'),
        role: 'technician',
        active: true,
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        name: 'Gabriel Vargas',
        email: 'gabriel@assistencia.com',
        password: hash('Atendente@123'),
        role: 'attendant',
        active: true,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('users', null, {});
  },
};
