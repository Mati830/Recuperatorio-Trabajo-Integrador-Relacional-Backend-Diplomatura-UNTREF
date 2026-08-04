const bcrypt = require('bcrypt');
require('dotenv').config();
const { sequelize, Usuario, Rol } = require('../models');

async function createAdmin() {
  try {
    await sequelize.sync();

    const rol = await Rol.findOne({ where: { nombre: 'administrador' } });
    if (!rol) {
      console.error('❌ El rol "administrador" no existe. Ejecuta scripts/seedRoles.js primero.');
      process.exit(1);
    }

    const email = 'adm@example.com';
    const password = 'Password123!';

    const existing = await Usuario.findOne({ where: { email } });
    if (existing) {
      console.log('ℹ️  Usuario admin ya existe:', existing.id);
      process.exit(0);
    }

    const hash = await bcrypt.hash(password, 10);
    const usuario = await Usuario.create({ email, password: hash, rol_id: rol.id });
    console.log('✅ Admin creado. ID:', usuario.id);
    process.exit(0);
  } catch (err) {
    console.error('❌ Error creando admin:', err);
    process.exit(1);
  }
}

createAdmin();
