const { DataTypes } = require('sequelize');
const sequelize = require('../conexion/sequelize');

const RefreshToken = sequelize.define('RefreshToken', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  token: { type: DataTypes.STRING, allowNull: false, unique: true },
  user_id: { type: DataTypes.INTEGER, allowNull: false },
  expires_at: { type: DataTypes.DATE, allowNull: false },
  revoked: { type: DataTypes.BOOLEAN, defaultValue: false }
}, {
  tableName: 'RefreshToken',
  timestamps: false
});

module.exports = RefreshToken;
