const pool = require("../config/db");

// Obtener nombres de tecnologías asociadas a un desarrollador
async function getTecnologiasByDesarrolladorId(desarrolladorId) {
  const [rows] = await pool.query(
    `SELECT t.id, t.nombre
     FROM tecnologias_desarrollador td
     JOIN tecnologias t ON td.tecnologia_id = t.id
     WHERE td.desarrollador_id = ?`,
    [desarrolladorId]
  );
  return rows; // Devuelve un array con los nombres de las tecnologías
}

// Obtener todas las tecnologías
async function obtenerTodasLasTecnologias() {
  const [rows] = await pool.query(`SELECT id, nombre FROM tecnologias`);
  return rows;
}

module.exports = {
  getTecnologiasByDesarrolladorId,
  obtenerTodasLasTecnologias
};
