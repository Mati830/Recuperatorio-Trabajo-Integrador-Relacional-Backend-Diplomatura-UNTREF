// models/Actor.js
const { DataTypes } = require('sequelize');
const sequelize = require('../conexion/sequelize');

const Actor = sequelize.define('Actor', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  nombre: { type: DataTypes.STRING, unique: true, allowNull: false }
}, {
  tableName: 'Actor',
  timestamps: false
});

module.exports = Actor;