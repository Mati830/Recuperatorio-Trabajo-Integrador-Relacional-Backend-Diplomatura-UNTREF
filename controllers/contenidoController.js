const { sequelize, Contenido, Actor, Genero, Categoria } = require('../models');

// ===============================
// CONTENIDO
// ===============================

// Obtener todos los contenidos (con filtros opcionales)
exports.getAll = async (req, res) => {
  try {
    const { titulo, genero, categoria } = req.query;

    const where = {};
    if (titulo) where.titulo = titulo;

    // 👇 Traducción de texto a ID
    if (categoria) {
      const cat = await Categoria.findOne({ where: { nombre: categoria } });
      if (cat) where.categoria_id = cat.id;
    }

    const contenidos = await Contenido.findAll({
      where,
      include: [
        { model: Actor, through: { attributes: [] } },
        { model: Genero, through: { attributes: [] } },
        { model: Categoria }
      ]
    });

    // Filtro adicional por género (porque es N-M)
    if (genero) {
      const normalize = str =>
        str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

      const filtrados = contenidos.filter(c =>
        c.Generos.some(g => normalize(g.nombre) === normalize(genero))
      );
      return res.json(filtrados);
    }

    res.json(contenidos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Obtener un contenido por ID
exports.getById = async (req, res) => {
  try {
    const contenido = await Contenido.findByPk(req.params.id, {
      include: [
        { model: Actor, through: { attributes: [] } },
        { model: Genero, through: { attributes: [] } },
        { model: Categoria }
      ]
    });

    if (!contenido) return res.status(404).json({ error: 'Contenido no encontrado' });
    res.json(contenido);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Crear nuevo contenido (Película o Serie)
exports.create = async (req, res) => {
  try {
    const { titulo, categoria_id, resumen, temporadas, trailer, generos, actores } = req.body;

    if (!titulo || !categoria_id) {
      return res.status(400).json({ error: 'Título y categoría son requeridos' });
    }

    // 👇 Verificar si ya existe por título + categoría
    const existente = await Contenido.findOne({ where: { titulo, categoria_id } });
    if (existente) {
      return res.status(200).json({ message: 'El contenido ya existe', id: existente.id });
    }

    // Crear nuevo contenido
    const nuevo = await Contenido.create({ titulo, categoria_id, resumen, temporadas, trailer });

    // Asociar géneros y actores si vienen en el body
    if (generos) await nuevo.setGeneros(generos);
    if (actores) await nuevo.setActors(actores);

    res.status(201).json({ message: 'Contenido creado correctamente', id: nuevo.id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar contenido completo (PUT)
exports.update = async (req, res) => {
  try {
    const contenido = await Contenido.findByPk(req.params.id);
    if (!contenido) return res.status(404).json({ error: 'Contenido no encontrado' });

    await contenido.update(req.body);

    if (req.body.generos) await contenido.setGeneros(req.body.generos);
    if (req.body.actores) await contenido.setActors(req.body.actores);

    res.json({ message: 'Contenido actualizado correctamente', contenido });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Actualizar parcialmente (PATCH)
exports.patch = async (req, res) => {
  try {
    const contenido = await Contenido.findByPk(req.params.id);
    if (!contenido) return res.status(404).json({ error: 'Contenido no encontrado' });

    await contenido.update(req.body);
    res.json({ message: 'Contenido actualizado parcialmente', contenido });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Eliminar contenido
exports.remove = async (req, res) => {
  try {
    const contenido = await Contenido.findByPk(req.params.id);
    if (!contenido) return res.status(404).json({ error: 'Contenido no encontrado' });

    await contenido.destroy();
    res.json({ message: 'Contenido eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// CATEGORÍAS
// ===============================
exports.getCategorias = async (req, res) => {
  try {
    const categorias = await Categoria.findAll();
    res.json(categorias);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// GÉNEROS
// ===============================
exports.getGeneros = async (req, res) => {
  try {
    const generos = await Genero.findAll();
    res.json(generos);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// ===============================
// ACTORES
// ===============================
exports.getActores = async (req, res) => {
  try {
    const actores = await Actor.findAll();
    res.json(actores);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};