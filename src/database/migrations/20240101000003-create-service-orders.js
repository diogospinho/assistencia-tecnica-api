'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('service_orders', {
      id: { type: Sequelize.UUID, defaultValue: Sequelize.UUIDV4, primaryKey: true },
      order_number: { type: Sequelize.STRING(20), allowNull: false, unique: true },
      client_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: 'clients', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
      },
      equipment: { type: Sequelize.STRING(200), allowNull: false },
      problem_description: { type: Sequelize.TEXT, allowNull: false },
      status: {
        type: Sequelize.ENUM('open', 'in_progress', 'concluded', 'canceled'),
        allowNull: false,
        defaultValue: 'open',
      },
      priority: {
        type: Sequelize.ENUM('low', 'medium', 'high', 'urgent'),
        allowNull: false,
        defaultValue: 'medium',
      },
      technician_id: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      opened_at: { type: Sequelize.DATE, allowNull: false, defaultValue: Sequelize.NOW },
      concluded_at: { type: Sequelize.DATE, allowNull: true },
      cancel_reason: { type: Sequelize.TEXT, allowNull: true },
      attendance_time_minutes: { type: Sequelize.INTEGER, allowNull: true },
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
    await queryInterface.dropTable('service_orders');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_service_orders_status";');
    await queryInterface.sequelize.query('DROP TYPE IF EXISTS "enum_service_orders_priority";');
  },
};
