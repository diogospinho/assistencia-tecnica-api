'use strict';

module.exports = (sequelize, DataTypes) => {
  const ServiceOrder = sequelize.define('ServiceOrder', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    orderNumber: { type: DataTypes.STRING(20), allowNull: false, unique: true, field: 'order_number' },
    clientId: { type: DataTypes.UUID, allowNull: false, field: 'client_id' },
    equipment: { type: DataTypes.STRING(200), allowNull: false },
    problemDescription: { type: DataTypes.TEXT, allowNull: false, field: 'problem_description' },
    status: {
      type: DataTypes.ENUM('open', 'in_progress', 'concluded', 'canceled'),
      allowNull: false,
      defaultValue: 'open',
    },
    priority: {
      type: DataTypes.ENUM('low', 'medium', 'high', 'urgent'),
      allowNull: false,
      defaultValue: 'medium',
    },
    technicianId: { type: DataTypes.UUID, allowNull: true, field: 'technician_id' },
    openedAt: { type: DataTypes.DATE, allowNull: false, defaultValue: DataTypes.NOW, field: 'opened_at' },
    concludedAt: { type: DataTypes.DATE, allowNull: true, field: 'concluded_at' },
    cancelReason: { type: DataTypes.TEXT, allowNull: true, field: 'cancel_reason' },
    attendanceTimeMinutes: { type: DataTypes.INTEGER, allowNull: true, field: 'attendance_time_minutes' },
    createdBy: { type: DataTypes.UUID, allowNull: false, field: 'created_by' },
  }, {
    tableName: 'service_orders',
    underscored: true,
  });

  return ServiceOrder;
};
