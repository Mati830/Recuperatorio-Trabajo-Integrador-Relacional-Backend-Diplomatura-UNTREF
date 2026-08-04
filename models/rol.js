const { DataTypes } = require('sequelize');
const sequelize = require('../conexion/sequelize');

const Rol = sequelize.define('Rol', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, unique: true, allowNull: false }
}, {
  tableName: 'Rol',
  timestamps: false
});

module.exports = Rol;
