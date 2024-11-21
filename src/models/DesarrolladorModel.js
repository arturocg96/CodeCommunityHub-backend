const pool = require("../config/db");

// Insertar desarrollador
async function insertDesarrollador({ nombre, apellidos, email, password, foto, cv, estudios, sobre_mi, experiencia, localizacion, salario_anual, disponibilidad, tecnologias }) {
  const [usuarioResult] = await pool.query(
    `INSERT INTO usuarios (nombre, apellidos, email, password, rol, foto, activo) VALUES (?, ?, ?, ?, 'desarrollador', ?, 1)`,
    [nombre, apellidos, email, password, foto]
  );

  const usuarioId = usuarioResult.insertId;

  await pool.query(
    `INSERT INTO desarrolladores (usuario_id, estudios, sobre_mi, experiencia, localizacion, salario_anual, disponibilidad, cv) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [usuarioId, estudios, sobre_mi, experiencia, localizacion, salario_anual, disponibilidad, cv]
  );

  if (tecnologias && tecnologias.length > 0) {
    const values = tecnologias.map((tec) => [usuarioId, tec]);
    await pool.query(
      `INSERT INTO tecnologias_desarrollador (desarrollador_id, tecnologia_id) VALUES ?`,
      [values]
    );
  }

  return usuarioId;
}

// Seleccionar desarrollador por ID
async function selectDesarrolladorById(desarrolladorId) {
  const [usuario] = await pool.query(
    `SELECT * FROM usuarios WHERE id = ? AND rol = 'desarrollador'`,
    [desarrolladorId]
  );
  if (!usuario.length) return null;

  const [desarrollador] = await pool.query(
    `SELECT * FROM desarrolladores WHERE usuario_id = ?`,
    [desarrolladorId]
  );

  const [tecnologias] = await pool.query(
    `SELECT tecnologia_id FROM tecnologias_desarrollador WHERE desarrollador_id = ?`,
    [desarrolladorId]
  );

  return {
    usuario: usuario[0],
    desarrollador: desarrollador[0],
    tecnologias: tecnologias.map((tec) => tec.tecnologia_id),
  };
}

// Actualizar desarrollador
async function updateDesarrollador(desarrolladorId, { nombre, apellidos, email, password, foto, cv, estudios, sobre_mi, experiencia, localizacion, salario_anual, disponibilidad, tecnologias }) {
  await pool.query(
    `UPDATE usuarios 
     SET nombre = ?, apellidos = ?, email = ?, password = COALESCE(?, password), foto = ? 
     WHERE id = ? AND rol = 'desarrollador'`,
    [nombre, apellidos, email, password, foto, desarrolladorId]
  );

  await pool.query(
    `UPDATE desarrolladores 
     SET estudios = ?, sobre_mi = ?, experiencia = ?, localizacion = ?, salario_anual = ?, disponibilidad = ?, cv = ? 
     WHERE usuario_id = ?`,
    [estudios, sobre_mi, experiencia, localizacion, salario_anual, disponibilidad, cv, desarrolladorId]
  );

  await pool.query(`DELETE FROM tecnologias_desarrollador WHERE desarrollador_id = ?`, [desarrolladorId]);

  if (tecnologias && tecnologias.length > 0) {
    const values = tecnologias.map((tec) => [desarrolladorId, tec]);
    await pool.query(
      `INSERT INTO tecnologias_desarrollador (desarrollador_id, tecnologia_id) VALUES ?`,
      [values]
    );
  }

  return true;
}

module.exports = {
  insertDesarrollador,
  updateDesarrollador,
  selectDesarrolladorById,
};
