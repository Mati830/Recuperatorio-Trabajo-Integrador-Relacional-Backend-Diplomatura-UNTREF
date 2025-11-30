const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Trailerflix API',
      version: '1.0.0',
      description: 'Documentación de la API de Trailerflix (Películas y Series)',
    },
  },
  apis: ['./routes/*.js'], // 👈 apunta a tus routers con JSDoc
};

const specs = swaggerJsdoc(options);

module.exports = { swaggerUi, specs };