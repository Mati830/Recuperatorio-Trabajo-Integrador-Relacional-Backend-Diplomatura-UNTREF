const express = require('express');
const router = express.Router();
const contenidoController = require('../controllers/contenidoController');

// ===============================
// Endpoints adicionales
// ===============================

/**
 * @swagger
 * /contenido/categorias:
 *   get:
 *     summary: Obtener todas las categorías
 *     responses:
 *       200:
 *         description: Lista de categorías
 */
router.get('/categorias', contenidoController.getCategorias);

/**
 * @swagger
 * /contenido/generos:
 *   get:
 *     summary: Obtener todos los géneros
 *     responses:
 *       200:
 *         description: Lista de géneros
 */
router.get('/generos', contenidoController.getGeneros);

/**
 * @swagger
 * /contenido/actores:
 *   get:
 *     summary: Obtener todos los actores
 *     responses:
 *       200:
 *         description: Lista de actores
 */
router.get('/actores', contenidoController.getActores);

// ===============================
// CRUD Contenido + filtros
// ===============================

/**
 * @swagger
 * /contenido:
 *   get:
 *     summary: Obtener todos los contenidos (con filtros opcionales)
 *     parameters:
 *       - in: query
 *         name: titulo
 *         schema:
 *           type: string
 *       - in: query
 *         name: genero
 *         schema:
 *           type: string
 *       - in: query
 *         name: categoria
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de contenidos
 */
router.get('/', contenidoController.getAll);

/**
 * @swagger
 * /contenido/{id}:
 *   get:
 *     summary: Obtener contenido por ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contenido encontrado
 *       404:
 *         description: Contenido no encontrado
 */
router.get('/:id', contenidoController.getById);

/**
 * @swagger
 * /contenido:
 *   post:
 *     summary: Crear nuevo contenido (película o serie)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               categoria_id:
 *                 type: integer
 *               resumen:
 *                 type: string
 *               temporadas:
 *                 type: integer
 *               trailer:
 *                 type: string
 *               poster:
 *                 type: string
 *               duracion:
 *                 type: string
 *               generos:
 *                 type: array
 *                 items:
 *                   type: integer
 *               actores:
 *                 type: array
 *                 items:
 *                   type: integer
 *             required:
 *               - titulo
 *               - categoria_id
 *     responses:
 *       201:
 *         description: Contenido creado correctamente
 *       200:
 *         description: El contenido ya existe
 *       400:
 *         description: Error de validación
 */
router.post('/', contenidoController.create);

/**
 * @swagger
 * /contenido/{id}:
 *   put:
 *     summary: Actualizar contenido completo
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               categoria_id:
 *                 type: integer
 *               resumen:
 *                 type: string
 *               temporadas:
 *                 type: integer
 *               trailer:
 *                 type: string
 *               poster:
 *                 type: string
 *               duracion:
 *                 type: string
 *               generos:
 *                 type: array
 *                 items:
 *                   type: integer
 *               actores:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Contenido actualizado correctamente
 *       404:
 *         description: Contenido no encontrado
 */
router.put('/:id', contenidoController.update);

/**
 * @swagger
 * /contenido/{id}:
 *   patch:
 *     summary: Actualizar parcialmente contenido
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               titulo:
 *                 type: string
 *               categoria_id:
 *                 type: integer
 *               resumen:
 *                 type: string
 *               temporadas:
 *                 type: integer
 *               trailer:
 *                 type: string
 *               poster:
 *                 type: string
 *               duracion:
 *                 type: string
 *               generos:
 *                 type: array
 *                 items:
 *                   type: integer
 *               actores:
 *                 type: array
 *                 items:
 *                   type: integer
 *     responses:
 *       200:
 *         description: Contenido actualizado parcialmente
 *       404:
 *         description: Contenido no encontrado
 */
router.patch('/:id', contenidoController.patch);

/**
 * @swagger
 * /contenido/{id}:
 *   delete:
 *     summary: Eliminar contenido
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Contenido eliminado correctamente
 *       404:
 *         description: Contenido no encontrado
 */
router.delete('/:id', contenidoController.remove);

module.exports = router;
