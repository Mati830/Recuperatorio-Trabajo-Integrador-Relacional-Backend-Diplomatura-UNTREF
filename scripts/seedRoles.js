const { sequelize, Rol } = require('../models');

async function seedRoles() {
  try {
    await sequelize.sync();

    const roles = ['administrador', 'empleado'];

    for (const nombre of roles) {
      const [rol, created] = await Rol.findOrCreate({
        where: { nombre },
        defaults: { nombre }
      });

      console.log(`Rol ${nombre} ${created ? 'creado' : 'ya existe'}`);
    }

    console.log('✅ Seed de roles completado');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error al crear roles:', error);
    process.exit(1);
  }
}

seedRoles();
