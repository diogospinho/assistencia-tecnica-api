'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('part_movements', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      part_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'parts', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      service_order_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'service_orders', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      quantity: { type: Sequelize.INTEGER, allowNull: false },
      type: { type: Sequelize.ENUM('in', 'out'), allowNull: false },
      reason: { type: Sequelize.STRING(255), allowNull: true },
      created_by: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      created_at: { type: Sequelize.DATE, allowNull: false },
      updated_at: { type: Sequelize.DATE, allowNull: false },
    });
  },
  down: async (queryInterface) => {
    await queryInterface.dropTable('part_movements');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_part_movements_type";');
  },
};
