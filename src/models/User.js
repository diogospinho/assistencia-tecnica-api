'use strict';

module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.ENUM('admin', 'technician', 'attendant'), allowNull: false, defaultValue: 'attendant' },
    active: { type: DataTypes.BOOLEAN, defaultValue: true },
  }, {
    tableName: 'users',
    underscored: true,
  });

  return User;
};
