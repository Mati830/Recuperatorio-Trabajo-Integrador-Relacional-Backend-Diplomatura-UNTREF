const express = require('express');
const app = express();
require('dotenv').config();
const logger = require('./utils/logger');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const contenidoRoutes = require('./routes/contenidoRoutes');
const usuarioRoutes = require('./routes/usuarioRoutes');
const authRoutes = require('./routes/authRoutes');
const rolesRoutes = require('./routes/rolesRoutes');
const { sequelize } = require('./models/index');
const { swaggerUi, specs } = require('./conexion/swagger');

app.use(express.json());
app.use(helmet());
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);
app.use('/auth', authRoutes);
app.use('/contenido', contenidoRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/roles', rolesRoutes);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));

const PORT = process.env.PORT || 3000;

sequelize.authenticate()
  .then(() => {
    logger.info('✅ Conectado a MySQL con Sequelize');
    return sequelize.sync();
  })
  .then(() => {
    app.listen(PORT, () => {
      logger.info(`🚀 Server running on port ${PORT}`);
      logger.info(`📖 Swagger UI disponible en http://localhost:${PORT}/api-docs`);
    });
  })
  .catch(err => {
    logger.error('❌ Error al conectar con la base de datos:', err);
  });