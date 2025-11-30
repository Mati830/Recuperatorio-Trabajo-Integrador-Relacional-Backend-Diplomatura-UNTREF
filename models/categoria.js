const { DataTypes } = require('sequelize');
const sequelize = require('../conexion/sequelize');

const Categoria = sequelize.define('Categoria', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, unique: true, allowNull: false }
}, {
  tableName: 'Categoria',
  timestamps: false
});

module.exports = Categoria;