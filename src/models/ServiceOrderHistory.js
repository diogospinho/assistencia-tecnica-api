'use strict';

module.exports = (sequelize, DataTypes) => {
  const ServiceOrderHistory = sequelize.define('ServiceOrderHistory', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    serviceOrderId: { type: DataTypes.UUID, allowNull: false, field: 'service_order_id' },
    previousStatus: { type: DataTypes.STRING(20), allowNull: true, field: 'previous_status' },
    newStatus: { type: DataTypes.STRING(20), allowNull: false, field: 'new_status' },
    changedBy: { type: DataTypes.UUID, allowNull: false, field: 'changed_by' },
    notes: { type: DataTypes.TEXT, allowNull: true },
  }, {
    tableName: 'service_order_histories',
    underscored: true,
  });

  return ServiceOrderHistory;
};
