'use strict';

module.exports = (sequelize, DataTypes) => {
  const Client = sequelize.define('Client', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    name: { type: DataTypes.STRING(100), allowNull: false },
    cpf: { type: DataTypes.STRING(14), allowNull: false, unique: true },
    phone: { type: DataTypes.STRING(20), allowNull: false },
    email: { type: DataTypes.STRING(150), allowNull: true },
    zipCode: { type: DataTypes.STRING(9), allowNull: true, field: 'zip_code' },
    street: { type: DataTypes.STRING(200), allowNull: true },
    number: { type: DataTypes.STRING(10), allowNull: true },
    complement: { type: DataTypes.STRING(100), allowNull: true },
    neighborhood: { type: DataTypes.STRING(100), allowNull: true },
    city: { type: DataTypes.STRING(100), allowNull: true },
    state: { type: DataTypes.STRING(2), allowNull: true },
  }, {
    tableName: 'clients',
    underscored: true,
  });

  return Client;
};
