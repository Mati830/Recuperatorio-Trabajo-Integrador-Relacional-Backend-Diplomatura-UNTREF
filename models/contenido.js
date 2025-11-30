const { DataTypes } = require('sequelize');
const sequelize = require('../conexion/sequelize');

const Contenido = sequelize.define('Contenido', {
  id: { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true }, // ✅ auto-increment
  titulo: { type: DataTypes.STRING, allowNull: false },
  resumen: DataTypes.TEXT,
  temporadas: DataTypes.INTEGER,
  trailer: DataTypes.STRING,
  poster: DataTypes.STRING,
  duracion: DataTypes.STRING,
  gen: DataTypes.STRING,
  categoria_id: { type: DataTypes.INTEGER, allowNull: false } // ✅ FK a Categoria
}, {
  tableName: 'Contenido',
  timestamps: false
});

module.exports = Contenido;