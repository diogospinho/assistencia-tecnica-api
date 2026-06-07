'use strict';

module.exports = (sequelize, DataTypes) => {
  const ServiceOrderPart = sequelize.define('ServiceOrderPart', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    serviceOrderId: { type: DataTypes.UUID, allowNull: false, field: 'service_order_id' },
    partId: { type: DataTypes.UUID, allowNull: false, field: 'part_id' },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false, field: 'unit_price' },
  }, {
    tableName: 'service_order_parts',
    underscored: true,
  });

  return ServiceOrderPart;
};
