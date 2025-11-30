const mysql = require('mysql2/promise');
const fs = require('fs');
require('dotenv').config();

// Leer el JSON
const data = JSON.parse(fs.readFileSync('./json/trailerflix.json', 'utf8'));

async function migrate() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: process.env.DB_PORT
  });

  for (const item of data) {
    // ===============================
    // Insertar categoría y obtener su ID
    // ===============================
    await conn.execute('INSERT IGNORE INTO Categoria (nombre) VALUES (?)', [item.categoria]);
    const [catRows] = await conn.execute('SELECT id FROM Categoria WHERE nombre=?', [item.categoria]);
    const categoriaId = catRows[0].id;

    // ===============================
    // Insertar contenido con categoria_id (sin id manual)
    // ===============================
    await conn.execute(
      `INSERT INTO Contenido 
      (titulo, categoria_id, poster, resumen, trailer, temporadas, duracion, gen) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
      ON DUPLICATE KEY UPDATE titulo=VALUES(titulo)`,
      [
        item.titulo,
        categoriaId,
        item.poster,
        item.resumen,
        item.trailer,
        Number.isInteger(item.temporadas) ? item.temporadas : null,
        item.duracion && item.duracion !== 'N/A' ? item.duracion : null,
        item.gen || null
      ]
    );

    // ===============================
    // Insertar géneros y relación
    // ===============================
    for (const g of item.genero) {
      await conn.execute('INSERT IGNORE INTO Genero (nombre) VALUES (?)', [g]);
      const [rows] = await conn.execute('SELECT id FROM Genero WHERE nombre=?', [g]);
      await conn.execute('INSERT IGNORE INTO ContenidoGenero (contenido_id, genero_id) VALUES (LAST_INSERT_ID(), ?)', [rows[0].id]);
    }

    // ===============================
    // Insertar actores y relación
    // ===============================
    for (const a of item.reparto) {
      await conn.execute('INSERT IGNORE INTO Actor (nombre) VALUES (?)', [a]);
      const [rows] = await conn.execute('SELECT id FROM Actor WHERE nombre=?', [a]);
      await conn.execute('INSERT IGNORE INTO ContenidoActor (contenido_id, actor_id) VALUES (LAST_INSERT_ID(), ?)', [rows[0].id]);
    }

    // ===============================
    // Insertar términos de búsqueda y relación
    // ===============================
    for (const b of item.busqueda) {
      await conn.execute('INSERT IGNORE INTO Busqueda (termino) VALUES (?)', [b]);
      const [rows] = await conn.execute('SELECT id FROM Busqueda WHERE termino=?', [b]);
      await conn.execute('INSERT IGNORE INTO ContenidoBusqueda (contenido_id, busqueda_id) VALUES (LAST_INSERT_ID(), ?)', [rows[0].id]);
    }
  }

  console.log("✅ Migración completa con categoria_id y AUTO_INCREMENT");
  await conn.end();
}

migrate().catch(err => console.error(err));