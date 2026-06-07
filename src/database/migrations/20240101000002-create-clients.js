'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('clients', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      name: { type: Sequelize.STRING(100), allowNull: false },
      cpf: { type: Sequelize.STRING(14), allowNull: false, unique: true },
      phone: { type: Sequelize.STRING(20), allowNull: false },
      email: { type: Sequelize.STRING(150), allowNull: true },
      zip_code: { type: Sequelize.STRING(9), allowNull: true },
      street: { type: Sequelize.STRING(200), allowNull: true },
      number: { type: Sequelize.STRING(10), allowNull: true },
      complement: { type: Sequelize.STRING(100), allowNull: true },
      neighborhood: { type: Sequelize.STRING(100), allowNull: true },
      city: { type: Sequelize.STRING(100), allowNull: true },
      state: { type: Sequelize.STRING(2), allowNull: true },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('clients');
  },
};
