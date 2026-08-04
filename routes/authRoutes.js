const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verificarToken, autorizarRoles } = require('../middlewares/authMiddleware');
const rateLimit = require('express-rate-limit');

// Limiter específico para login (mitiga fuerza bruta por IP)
const loginLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutos
	max: 5, // 5 intentos por IP
	standardHeaders: true,
	legacyHeaders: false,
	message: { error: 'Demasiados intentos de login. Intenta de nuevo más tarde.' }
});

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Registrar un nuevo usuario (solo administrador)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               rol_id:
 *                 type: integer
 *             required:
 *               - email
 *               - password
 *               - rol_id
 *     responses:
 *       201:
 *         description: Usuario registrado correctamente
 *       400:
 *         description: Error de validación
 *       401:
 *         description: No autorizado
 *       403:
 *         description: Rol insuficiente
 */
router.post('/register', verificarToken, autorizarRoles('administrador'), authController.register);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión y obtener token JWT y refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *             required:
 *               - email
 *               - password
 *     responses:
 *       200:
 *         description: Login exitoso
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', loginLimiter, authController.login);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Obtener un nuevo token de acceso usando refresh token
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: Nuevo token generado
 *       400:
 *         description: Refresh token requerido
 *       401:
 *         description: Refresh token inválido
 */
router.post('/refresh-token', authController.refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Revocar el refresh token y cerrar sesión
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               refreshToken:
 *                 type: string
 *             required:
 *               - refreshToken
 *     responses:
 *       200:
 *         description: Logout exitoso
 *       400:
 *         description: Refresh token requerido
 */
router.post('/logout', authController.logout);

module.exports = router;
