'use strict';

module.exports = (sequelize, DataTypes) => {
  const PartMovement = sequelize.define('PartMovement', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    partId: { type: DataTypes.UUID, allowNull: false, field: 'part_id' },
    serviceOrderId: { type: DataTypes.UUID, allowNull: true, field: 'service_order_id' },
    quantity: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.ENUM('in', 'out'), allowNull: false },
    reason: { type: DataTypes.STRING(255), allowNull: true },
    createdBy: { type: DataTypes.UUID, allowNull: false, field: 'created_by' },
  }, {
    tableName: 'part_movements',
    underscored: true,
  });

  return PartMovement;
};
