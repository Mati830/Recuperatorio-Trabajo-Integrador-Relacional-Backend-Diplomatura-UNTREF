
// Contenido ↔ Actores (N-M)
const sequelize = require('../conexion/sequelize');
const Contenido = require('./Contenido');
const Actor = require('./Actor');
const Genero = require('./Genero');
const Categoria = require('./Categoria');

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

module.exports = {
  sequelize,
  Contenido,
  Actor,
  Genero,
  Categoria
};