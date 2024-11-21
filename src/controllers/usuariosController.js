const { insertAdministrador, selectUsuarioByEmail, verificarUsuarioActivo } = require("../models/UsuarioModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const registrarAdministrador = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validar que se envíen ambos campos
    if (!email || !password) {
      return res.status(400).json({ mensaje: "El email y la contraseña son obligatorios." });
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(password, 8);

    // Insertar el administrador
    const administradorId = await insertAdministrador({ email, password: hashedPassword });

    res.status(201).json({
      mensaje: "Administrador registrado con éxito.",
      administrador: { id: administradorId, email },
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ mensaje: "El email ya está registrado. Por favor, usa otro email." });
    }

    console.error("Error en registrarAdministrador:", error);
    res.status(500).json({ mensaje: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde." });
  }
};

// Login de usuarios
const loginUsuario = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validar que se envíen ambos campos
    if (!email || !password) {
      return res.status(400).json({ mensaje: "El email y la contraseña son obligatorios." });
    }

    // Buscar el usuario por email
    const usuario = await selectUsuarioByEmail(email);

    // Verificar si el usuario existe y está activo
    if (!usuario) {
      return res.status(401).json({ mensaje: "Credenciales inválidas. Verifica tu email o contraseña." });
    }

    if (!usuario.activo) {
      return res.status(403).json({ mensaje: "Tu cuenta está inactiva. Contacta al administrador." });
    }

    // Comparar la contraseña encriptada
    const esPasswordValido = await bcrypt.compare(password, usuario.password);
    if (!esPasswordValido) {
      return res.status(401).json({ mensaje: "Credenciales inválidas. Verifica tu email o contraseña." });
    }

    // Generar un token JWT
    const token = jwt.sign(
      { usuarioId: usuario.id, rol: usuario.rol },
      process.env.CLAVE,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      mensaje: "Inicio de sesión exitoso.",
      token,
      usuario: {
        id: usuario.id,
        nombre: usuario.nombre,
        apellidos: usuario.apellidos,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    console.error("Error en loginUsuario:", error);
    res.status(500).json({ mensaje: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde." });
  }
};

// Renovar token
const renovarToken = async (req, res, next) => {
  try {
    const { usuarioId } = req.usuario;

    // Verificar si el usuario sigue activo
    const estaActivo = await verificarUsuarioActivo(usuarioId);
    if (!estaActivo) {
      return res.status(403).json({ mensaje: "Tu cuenta está inactiva. Contacta al administrador." });
    }

    // Generar un nuevo token
    const nuevoToken = jwt.sign(
      { usuarioId, rol: req.usuario.rol },
      process.env.CLAVE,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      mensaje: "Token renovado exitosamente.",
      token: nuevoToken,
    });
  } catch (error) {
    console.error("Error en renovarToken:", error);
    res.status(500).json({ mensaje: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde." });
  }
};


module.exports = {
  registrarAdministrador,
  loginUsuario,
  renovarToken,
};
