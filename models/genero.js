const { DataTypes } = require('sequelize');
const sequelize = require('../conexion/sequelize');

const Genero = sequelize.define('Genero', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, unique: true, allowNull: false }
}, {
  tableName: 'Genero',
  timestamps: false
});

module.exports = Genero;