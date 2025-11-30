// conexion/sequelize.js
const { Sequelize } = require('sequelize');
require('dotenv').config();

// Inicializamos Sequelize con las variables de entorno
const sequelize = new Sequelize(
  process.env.DB_NAME,       // Nombre de la base de datos
  process.env.DB_USER,       // Usuario
  process.env.DB_PASSWORD,   // Contraseña
  {
    host: process.env.DB_HOST,
    dialect: 'mysql',
    port: process.env.DB_PORT || 3306,
    logging: false           
  }
);

// Probar conexión
sequelize.authenticate()
  .then(() => console.log('✅ Conectado a MySQL con Sequelize'))
  .catch(err => console.error('❌ Error de conexión con Sequelize:', err));

module.exports = sequelize;