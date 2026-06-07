'use strict';

module.exports = (sequelize, DataTypes) => {
  const Part = sequelize.define('Part', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(150), allowNull: false },
    code: { type: DataTypes.STRING(50), allowNull: false, unique: true },
    description: { type: DataTypes.TEXT, allowNull: true },
    stock: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
    unit: { type: DataTypes.STRING(20), allowNull: false, defaultValue: 'un' },
    price: { type: DataTypes.DECIMAL(10, 2), allowNull: false, defaultValue: 0 },
  }, {
    tableName: 'parts',
    underscored: true,
  });

  return Part;
};
