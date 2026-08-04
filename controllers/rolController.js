const { Rol } = require('../models');

// Listar todos los roles
exports.getRoles = async (req, res) => {
  try {
    const roles = await Rol.findAll();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
