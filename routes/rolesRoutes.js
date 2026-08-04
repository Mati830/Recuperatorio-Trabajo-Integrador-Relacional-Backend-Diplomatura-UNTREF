const express = require('express');
const router = express.Router();
const rolController = require('../controllers/rolController');

/**
 * @swagger
 * /roles:
 *   get:
 *     summary: Obtener todos los roles disponibles
 *     responses:
 *       200:
 *         description: Lista de roles
 */
router.get('/', rolController.getRoles);

module.exports = router;
