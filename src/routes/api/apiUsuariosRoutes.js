const router = require("express").Router();
const { registrarAdministrador, loginUsuario, renovarToken } = require("../../controllers/UsuariosController");
const { loginLimiter, validarEmail, validarToken } = require("../../utils/middlewares");

// Registrar un administrador
router.post("/administrador/registro", registrarAdministrador);

// Login de usuarios
router.post("/login", loginLimiter, validarEmail, loginUsuario);

// Renovar token
router.post("/login/renovar", validarToken, renovarToken);

module.exports = router;
