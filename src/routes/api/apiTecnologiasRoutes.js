const router = require("express").Router();
const { obtenerTecnologias } = require("../../controllers/tecnologiasController");

// Obtener todas las tecnologías
router.get("/", obtenerTecnologias);

module.exports = router;
