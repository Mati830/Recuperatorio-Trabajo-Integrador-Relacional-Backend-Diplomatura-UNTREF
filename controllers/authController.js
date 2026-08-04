const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const { Usuario, Rol, RefreshToken } = require('../models');
require('dotenv').config();

const JWT_SECRET = process.env.JWT_SECRET || 'mi-secreto-seguro';
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || process.env.JWT_SECRET || 'mi-secreto-seguro';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '2h';
const REFRESH_TOKEN_EXPIRES_IN = process.env.REFRESH_TOKEN_EXPIRES_IN || '7d';

const normalizeEmail = (email) => (typeof email === 'string' ? email.trim().toLowerCase() : '');
const isEmailValid = (email) => typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isPasswordValid = (password) => typeof password === 'string' && password.length >= 8;
const parsePositiveInt = (value) => {
  const numberValue = Number(value);
  return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : null;
};

const parseDurationMs = (duration) => {
  if (typeof duration !== 'string') return null;
  const match = duration.match(/^(\d+)([smhd])$/);
  if (!match) return null;
  const value = Number(match[1]);
  const unit = match[2];

  switch (unit) {
    case 's': return value * 1000;
    case 'm': return value * 60 * 1000;
    case 'h': return value * 60 * 60 * 1000;
    case 'd': return value * 24 * 60 * 60 * 1000;
    default: return null;
  }
};

const refreshTokenTtlMs = parseDurationMs(REFRESH_TOKEN_EXPIRES_IN) || 7 * 24 * 60 * 60 * 1000;

const createAccessToken = (usuario, rolNombre) => jwt.sign(
  {
    id: usuario.id,
    email: usuario.email,
    rol_id: usuario.rol_id,
    rol_nombre: rolNombre
  },
  JWT_SECRET,
  { expiresIn: JWT_EXPIRES_IN }
);

const createRefreshToken = (usuario, rolNombre) => jwt.sign(
  {
    id: usuario.id,
    email: usuario.email,
    rol_id: usuario.rol_id,
    rol_nombre: rolNombre
  },
  JWT_REFRESH_SECRET,
  { expiresIn: REFRESH_TOKEN_EXPIRES_IN }
);

const saveRefreshToken = async (usuario, token) => {
  const expiresAt = new Date(Date.now() + refreshTokenTtlMs);
  return RefreshToken.create({ token, user_id: usuario.id, expires_at: expiresAt });
};

const getRoleName = (usuario) => {
  if (usuario.Rol && usuario.Rol.nombre) return usuario.Rol.nombre;
  return usuario.rol_nombre || null;
};

exports.register = async (req, res) => {
  try {
    const { email, password, rol_id } = req.body;
    const rolId = parsePositiveInt(rol_id);

    if (!email || !password || rol_id === undefined) {
      return res.status(400).json({ error: 'Email, password y rol_id son requeridos' });
    }

    if (!isEmailValid(email)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    if (!isPasswordValid(password)) {
      return res.status(400).json({ error: 'Password inválido. Debe tener al menos 8 caracteres' });
    }

    if (!rolId) {
      return res.status(400).json({ error: 'rol_id debe ser un número entero positivo' });
    }

    const rol = await Rol.findByPk(rolId);
    if (!rol) {
      return res.status(400).json({ error: 'Rol inválido' });
    }

    const usuarioExistente = await Usuario.findOne({ where: { email } });
    if (usuarioExistente) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({ email, password: passwordHash, rol_id: rolId });
    logger.info('Usuario registrado', { id: usuario.id, email: usuario.email, rol_id: rolId });

    return res.status(201).json({ message: 'Usuario registrado con éxito', id: usuario.id });
  } catch (error) {
    logger.error('Error en register', { error: error.message, email: req.body.email });
    return res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = normalizeEmail(email);

    if (!normalizedEmail || typeof password !== 'string' || password.length === 0) {
      return res.status(400).json({ error: 'Email y password son requeridos' });
    }

    if (!isEmailValid(normalizedEmail)) {
      return res.status(400).json({ error: 'Email inválido' });
    }

    const usuario = await Usuario.findOne({ where: { email: normalizedEmail }, include: Rol });
    if (!usuario) {
      logger.warn('Login fallido - usuario no encontrado', { email: normalizedEmail });
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordValido = await bcrypt.compare(password, usuario.password);
    if (!passwordValido) {
      logger.warn('Login fallido - contraseña inválida', { email: normalizedEmail });
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const rolNombre = getRoleName(usuario);
    const accessToken = createAccessToken(usuario, rolNombre);
    const refreshToken = createRefreshToken(usuario, rolNombre);
    await saveRefreshToken(usuario, refreshToken);

    logger.info('Login exitoso', { id: usuario.id, email: usuario.email, rol_id: usuario.rol_id });
    return res.json({ message: 'Login exitoso', token: accessToken, refreshToken });
  } catch (error) {
    logger.error('Error en login', { error: error.message, email: req.body.email });
    return res.status(500).json({ error: error.message });
  }
};

exports.refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token es requerido' });
    }

    const registro = await RefreshToken.findOne({ where: { token: refreshToken, revoked: false } });
    if (!registro) {
      return res.status(401).json({ error: 'Refresh token inválido' });
    }

    let datos;
    try {
      datos = jwt.verify(refreshToken, JWT_REFRESH_SECRET);
    } catch (err) {
      logger.warn('Refresh token inválido o expirado', { error: err.message });
      return res.status(401).json({ error: 'Refresh token inválido' });
    }

    const usuario = await Usuario.findByPk(datos.id, { include: Rol });
    if (!usuario) {
      return res.status(401).json({ error: 'Refresh token inválido' });
    }

    const rolNombre = getRoleName(usuario);
    const nuevoToken = createAccessToken(usuario, rolNombre);

    return res.json({ token: nuevoToken });
  } catch (error) {
    logger.error('Error en refreshToken', { error: error.message });
    return res.status(500).json({ error: error.message });
  }
};

exports.logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token es requerido' });
    }

    await RefreshToken.update({ revoked: true }, { where: { token: refreshToken } });
    return res.json({ message: 'Logout exitoso' });
  } catch (error) {
    logger.error('Error en logout', { error: error.message });
    return res.status(500).json({ error: error.message });
  }
};
