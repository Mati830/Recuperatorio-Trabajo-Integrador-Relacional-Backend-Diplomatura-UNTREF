const bcrypt = require('bcrypt');
const { Usuario, Rol } = require('../models');

const isEmailValid = (email) => typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isPasswordValid = (password) => typeof password === 'string' && password.length >= 8;
const parsePositiveInt = (value) => {
  const numberValue = Number(value);
  return Number.isInteger(numberValue) && numberValue > 0 ? numberValue : null;
};

// Listar todos los usuarios con su rol
exports.getUsuarios = async (req, res) => {
  try {
    const usuarios = await Usuario.findAll({ include: Rol });
    res.json(usuarios);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener usuario por ID
exports.getUsuarioPorId = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id, { include: Rol });
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });
    res.json(usuario);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear usuario (hash de password)
exports.crearUsuario = async (req, res) => {
  try {
    if (!req.user || req.user.rol_nombre !== 'administrador') {
      return res.status(403).json({ error: 'No tienes permisos para crear usuarios' });
    }

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
    res.status(201).json({ message: 'Usuario creado', id: usuario.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar usuario
exports.actualizarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    const { email, password, rol_id } = req.body;
    const updateData = {};

    if (email !== undefined) {
      if (!isEmailValid(email)) {
        return res.status(400).json({ error: 'Email inválido' });
      }
      updateData.email = email;
    }

    if (password !== undefined) {
      if (!isPasswordValid(password)) {
        return res.status(400).json({ error: 'Password inválido. Debe tener al menos 8 caracteres' });
      }
      updateData.password = await bcrypt.hash(password, 10);
    }

    if (rol_id !== undefined) {
      const rolId = parsePositiveInt(rol_id);
      if (!rolId) {
        return res.status(400).json({ error: 'rol_id debe ser un número entero positivo' });
      }

      const rol = await Rol.findByPk(rolId);
      if (!rol) return res.status(400).json({ error: 'Rol inválido' });
      updateData.rol_id = rolId;
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'No se recibieron datos válidos para actualizar' });
    }

    await usuario.update(updateData);
    res.json({ message: 'Usuario actualizado', usuario });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar usuario
exports.eliminarUsuario = async (req, res) => {
  try {
    const usuario = await Usuario.findByPk(req.params.id);
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' });

    await usuario.destroy();
    res.json({ message: 'Usuario eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
