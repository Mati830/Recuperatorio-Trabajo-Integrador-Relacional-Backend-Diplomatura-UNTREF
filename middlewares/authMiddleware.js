const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'mi-secreto-seguro';

exports.verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    logger.warn('Token ausente o mal formado', { path: req.path, method: req.method, ip: req.ip });
    return res.status(401).json({ error: 'Token no proporcionado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const datos = jwt.verify(token, JWT_SECRET);
    req.user = datos;
    next();
  } catch (err) {
    logger.warn('Token inválido', { error: err.message, path: req.path, method: req.method, ip: req.ip });
    return res.status(401).json({ error: 'Token inválido' });
  }
};

exports.autorizarRoles = (...rolesPermitidos) => {
  return (req, res, next) => {
    if (!req.user || !req.user.rol_nombre) {
      logger.warn('Acceso denegado - usuario no autorizado', { path: req.path, method: req.method, ip: req.ip });
      return res.status(403).json({ error: 'No autorizado' });
    }

    if (!rolesPermitidos.includes(req.user.rol_nombre)) {
      logger.warn('Acceso denegado - rol insuficiente', { path: req.path, method: req.method, ip: req.ip, rol: req.user.rol_nombre });
      return res.status(403).json({ error: 'No tienes permisos para esta acción' });
    }

    next();
  };
};

exports.generarToken = (usuario) => {
  return jwt.sign(
    {
      id: usuario.id,
      email: usuario.email,
      rol_id: usuario.rol_id,
      rol_nombre: usuario.Rol ? usuario.Rol.nombre : usuario.rol_nombre
    },
    JWT_SECRET,
    { expiresIn: '8h' }
  );
};
