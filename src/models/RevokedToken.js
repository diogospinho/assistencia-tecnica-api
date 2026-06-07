'use strict';

module.exports = (sequelize, DataTypes) => {
  const RevokedToken = sequelize.define('RevokedToken', {
    id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
    token: { type: DataTypes.TEXT, allowNull: false, unique: true },
    revokedAt: { type: DataTypes.DATE, allowNull: false, field: 'revoked_at' },
  }, {
    tableName: 'revoked_tokens',
    underscored: true,
    timestamps: false,
  });

  return RevokedToken;
};
