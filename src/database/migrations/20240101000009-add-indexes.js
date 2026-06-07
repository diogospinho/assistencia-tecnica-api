'use strict';

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.addIndex('clients', ['cpf'], { name: 'clients_cpf_idx' });
    await queryInterface.addIndex('clients', ['email'], { name: 'clients_email_idx' });
    await queryInterface.addIndex('service_orders', ['status'], { name: 'service_orders_status_idx' });
    await queryInterface.addIndex('service_orders', ['priority'], { name: 'service_orders_priority_idx' });
    await queryInterface.addIndex('service_orders', ['technician_id'], { name: 'service_orders_technician_id_idx' });
    await queryInterface.addIndex('service_orders', ['opened_at'], { name: 'service_orders_opened_at_idx' });
    await queryInterface.addIndex('part_movements', ['part_id'], { name: 'part_movements_part_id_idx' });
    await queryInterface.addIndex('part_movements', ['created_at'], { name: 'part_movements_created_at_idx' });
  },
  down: async (queryInterface) => {
    await queryInterface.removeIndex('clients', 'clients_cpf_idx');
    await queryInterface.removeIndex('clients', 'clients_email_idx');
    await queryInterface.removeIndex('service_orders', 'service_orders_status_idx');
    await queryInterface.removeIndex('service_orders', 'service_orders_priority_idx');
    await queryInterface.removeIndex('service_orders', 'service_orders_technician_id_idx');
    await queryInterface.removeIndex('service_orders', 'service_orders_opened_at_idx');
    await queryInterface.removeIndex('part_movements', 'part_movements_part_id_idx');
    await queryInterface.removeIndex('part_movements', 'part_movements_created_at_idx');
  },
};
