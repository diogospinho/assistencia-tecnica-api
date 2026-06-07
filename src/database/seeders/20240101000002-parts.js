'use strict';

const { v4: uuidv4 } = require('uuid');

module.exports = {
  up: async (queryInterface) => {
    const now = new Date();

    await queryInterface.bulkInsert('parts', [
      {
        id: uuidv4(),
        name: 'Tela LCD 6.5"',
        code: 'TELA-LCD-65',
        description: 'Tela LCD 6.5 polegadas compatível com smartphones',
        stock: 10,
        unit: 'un',
        price: 180.00,
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        name: 'Bateria 4000mAh',
        code: 'BAT-4000',
        description: 'Bateria de polímero de lítio 4000mAh',
        stock: 20,
        unit: 'un',
        price: 65.00,
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        name: 'Conector USB-C',
        code: 'CON-USBC',
        description: 'Conector de carregamento USB-C',
        stock: 30,
        unit: 'un',
        price: 25.00,
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        name: 'Pasta Térmica',
        code: 'PASTA-TERM',
        description: 'Pasta térmica de alta condutividade',
        stock: 15,
        unit: 'un',
        price: 12.00,
        created_at: now,
        updated_at: now,
      },
      {
        id: uuidv4(),
        name: 'Placa de Som',
        code: 'PLACA-SOM',
        description: 'Placa de som interna para notebooks',
        stock: 5,
        unit: 'un',
        price: 95.00,
        created_at: now,
        updated_at: now,
      },
    ]);
  },

  down: async (queryInterface) => {
    await queryInterface.bulkDelete('parts', null, {});
  },
};
