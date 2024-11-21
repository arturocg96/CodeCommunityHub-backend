const pool = require("../config/db");


async function insertEmpresa({ nombre, apellidos, email, password, foto, razon_social, telefono, ubicacion, sitio_web }) {
  // Insertar en la tabla `usuarios`
  const [usuarioResult] = await pool.query(
    `INSERT INTO usuarios (nombre, apellidos, email, password, rol, foto, activo) VALUES (?, ?, ?, ?, 'empresa', ?, 1)`,
    [nombre, apellidos, email, password, foto]
  );

  const usuarioId = usuarioResult.insertId;

  // Insertar en la tabla `empresas`
  await pool.query(
    `INSERT INTO empresas (usuario_id, razon_social, telefono, ubicacion, sitio_web) VALUES (?, ?, ?, ?, ?)`,
    [usuarioId, razon_social, telefono, ubicacion, sitio_web]
  );

  return usuarioId;
}


async function selectEmpresaById(empresaId) {
  // Consultar datos del usuario con rol "empresa"
  const [usuario] = await pool.query(
    `SELECT * FROM usuarios WHERE id = ? AND rol = 'empresa'`,
    [empresaId]
  );

  // Si no encuentra un usuario con el ID, retornar null
  if (!usuario.length) return null;

  // Consultar datos específicos de la empresa
  const [empresa] = await pool.query(
    `SELECT * FROM empresas WHERE usuario_id = ?`,
    [empresaId]
  );

  // Combinar ambos resultados en un solo objeto
  return { ...usuario[0], ...empresa[0] };
}


async function updateEmpresa(empresaId, { nombre, apellidos, email, password, foto, razon_social, telefono, ubicacion, sitio_web }) {
  // Actualizar los datos en la tabla `usuarios`
  await pool.query(
    `UPDATE usuarios 
     SET nombre = ?, apellidos = ?, email = ?, password = COALESCE(?, password), foto = ? 
     WHERE id = ? AND rol = 'empresa'`,
    [nombre, apellidos, email, password, foto, empresaId]
  );

  // Actualizar los datos en la tabla `empresas`
  const [result] = await pool.query(
    `UPDATE empresas 
     SET razon_social = ?, telefono = ?, ubicacion = ?, sitio_web = ? 
     WHERE usuario_id = ?`,
    [razon_social, telefono, ubicacion, sitio_web, empresaId]
  );

  return result.affectedRows > 0; // Retorna true si la actualización fue exitosa
}


module.exports = {
  insertEmpresa,
  selectEmpresaById,
  updateEmpresa,
};

