
// Contenido ↔ Actores (N-M)
const sequelize = require('../conexion/sequelize');
const Contenido = require('./Contenido');
const Actor = require('./Actor');
const Genero = require('./Genero');
const Categoria = require('./Categoria');
const Rol = require('./rol');
const Usuario = require('./usuario');
const RefreshToken = require('./refreshToken');

// ===============================
// RELACIONES
// ===============================

// Contenido ↔ Actores (N-M)
Contenido.belongsToMany(Actor, { 
  through: 'ContenidoActor', 
  foreignKey: 'contenido_id',
  otherKey: 'actor_id',
  timestamps: false,
  onDelete: 'CASCADE'   
});
Actor.belongsToMany(Contenido, { 
  through: 'ContenidoActor', 
  foreignKey: 'actor_id',
  otherKey: 'contenido_id',
  timestamps: false,
  onDelete: 'CASCADE'
});

// Contenido ↔ Géneros (N-M)
Contenido.belongsToMany(Genero, { 
  through: 'ContenidoGenero', 
  foreignKey: 'contenido_id',
  otherKey: 'genero_id',
  timestamps: false,
  onDelete: 'CASCADE'
});
Genero.belongsToMany(Contenido, { 
  through: 'ContenidoGenero', 
  foreignKey: 'genero_id',
  otherKey: 'contenido_id',
  timestamps: false,
  onDelete: 'CASCADE'
});

// Contenido ↔ Categoría (1-N)
Contenido.belongsTo(Categoria, { foreignKey: 'categoria_id', onDelete: 'CASCADE' });
Categoria.hasMany(Contenido, { foreignKey: 'categoria_id', onDelete: 'CASCADE' });

// Usuario ↔ Rol (1-N)
Usuario.belongsTo(Rol, { foreignKey: 'rol_id', onDelete: 'CASCADE' });
Rol.hasMany(Usuario, { foreignKey: 'rol_id', onDelete: 'CASCADE' });

// Usuario ↔ RefreshToken (1-N)
RefreshToken.belongsTo(Usuario, { foreignKey: 'user_id', onDelete: 'CASCADE' });
Usuario.hasMany(RefreshToken, { foreignKey: 'user_id', onDelete: 'CASCADE' });

module.exports = {
  sequelize,
  Contenido,
  Actor,
  Genero,
  Categoria,
  Rol,
  Usuario,
  RefreshToken
};