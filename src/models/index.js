'use strict';

const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/database');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig.database, dbConfig.username, dbConfig.password, dbConfig);

const User = require('./User')(sequelize, DataTypes);
const Client = require('./Client')(sequelize, DataTypes);
const ServiceOrder = require('./ServiceOrder')(sequelize, DataTypes);
const ServiceOrderHistory = require('./ServiceOrderHistory')(sequelize, DataTypes);
const Part = require('./Part')(sequelize, DataTypes);
const PartMovement = require('./PartMovement')(sequelize, DataTypes);
const ServiceOrderPart = require('./ServiceOrderPart')(sequelize, DataTypes);
const RevokedToken = require('./RevokedToken')(sequelize, DataTypes);

User.hasMany(ServiceOrder, { foreignKey: 'technicianId', as: 'assignedOrders' });
User.hasMany(ServiceOrder, { foreignKey: 'createdBy', as: 'createdOrders' });
User.hasMany(ServiceOrderHistory, { foreignKey: 'changedBy', as: 'statusChanges' });
User.hasMany(PartMovement, { foreignKey: 'createdBy', as: 'partMovements' });

Client.hasMany(ServiceOrder, { foreignKey: 'clientId', as: 'serviceOrders' });

ServiceOrder.belongsTo(Client, { foreignKey: 'clientId', as: 'client' });
ServiceOrder.belongsTo(User, { foreignKey: 'technicianId', as: 'technician' });
ServiceOrder.belongsTo(User, { foreignKey: 'createdBy', as: 'creator' });
ServiceOrder.hasMany(ServiceOrderHistory, { foreignKey: 'serviceOrderId', as: 'history' });
ServiceOrder.hasMany(PartMovement, { foreignKey: 'serviceOrderId', as: 'partMovements' });
ServiceOrder.belongsToMany(Part, { through: ServiceOrderPart, foreignKey: 'serviceOrderId', as: 'parts' });

Part.belongsToMany(ServiceOrder, { through: ServiceOrderPart, foreignKey: 'partId', as: 'serviceOrders' });
Part.hasMany(PartMovement, { foreignKey: 'partId', as: 'movements' });
Part.hasMany(ServiceOrderPart, { foreignKey: 'partId', as: 'serviceOrderParts' });

ServiceOrderHistory.belongsTo(ServiceOrder, { foreignKey: 'serviceOrderId', as: 'serviceOrder' });
ServiceOrderHistory.belongsTo(User, { foreignKey: 'changedBy', as: 'changedByUser' });

PartMovement.belongsTo(Part, { foreignKey: 'partId', as: 'part' });
PartMovement.belongsTo(ServiceOrder, { foreignKey: 'serviceOrderId', as: 'serviceOrder' });
PartMovement.belongsTo(User, { foreignKey: 'createdBy', as: 'createdByUser' });

ServiceOrderPart.belongsTo(ServiceOrder, { foreignKey: 'serviceOrderId' });
ServiceOrderPart.belongsTo(Part, { foreignKey: 'partId', as: 'part' });

module.exports = {
  sequelize,
  Sequelize,
  User,
  Client,
  ServiceOrder,
  ServiceOrderHistory,
  Part,
  PartMovement,
  ServiceOrderPart,
  RevokedToken,
};
