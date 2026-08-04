const { DataTypes } = require('sequelize');
const sequelize = require('../conexion/sequelize');

const Usuario = sequelize.define('Usuario', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  rol_id: { type: DataTypes.INTEGER, allowNull: false }
}, {
  tableName: 'Usuario',
  timestamps: false
});

module.exports = Usuario;
