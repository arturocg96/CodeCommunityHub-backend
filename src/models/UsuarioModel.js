const pool = require("../config/db");

// Insertar un administrador
async function insertAdministrador({ email, password }) {
  const [result] = await pool.query(
    `INSERT INTO usuarios (nombre, apellidos, email, password, rol, foto, activo) 
     VALUES (?, ?, ?, ?, 'administrador', NULL, 1)`,
    ["Administrador", "Admin", email, password] // Valores predeterminados
  );
  return result.insertId; // Retorna el ID del administrador insertado
}

// Buscar usuario por email
async function selectUsuarioByEmail(email) {
  const [rows] = await pool.query(
    `SELECT id, nombre, apellidos, email, password, rol, activo 
     FROM usuarios WHERE email = ?`,
    [email]
  );
  return rows[0] || null;
}

// Verificar si un usuario está activo
async function verificarUsuarioActivo(id) {
  const [rows] = await pool.query(
    `SELECT activo FROM usuarios WHERE id = ?`,
    [id]
  );
  return rows[0]?.activo === 1;
}

module.exports = {
  insertAdministrador,
  selectUsuarioByEmail,
  verificarUsuarioActivo,
};
