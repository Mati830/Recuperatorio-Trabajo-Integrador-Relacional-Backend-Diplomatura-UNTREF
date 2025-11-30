const express = require('express');
const app = express();
require('dotenv').config();

const contenidoRoutes = require('./routes/contenidoRoutes');
const { sequelize } = require('./models/index'); // importa la instancia y modelos
const { swaggerUi, specs } = require('./conexion/swagger'); // 👈 import Swagger

// Middlewares
app.use(express.json());
app.use('/contenido', contenidoRoutes);

// Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

// Server
const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    console.log('✅ Conectado a MySQL con Sequelize');
    return sequelize.sync(); // sincroniza modelos con la BD
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📖 Swagger UI disponible en http://localhost:${PORT}/api-docs`);
    });
  })
  .catch(err => {
    console.error('❌ Error al conectar con la base de datos:', err);
  });