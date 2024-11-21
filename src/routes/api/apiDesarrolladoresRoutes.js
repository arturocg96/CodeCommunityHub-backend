const router = require("express").Router();
const { registroDesarrollador, actualizarDesarrollador } = require("../../controllers/desarrolladoresController");
const { uploadFiles } = require("../../utils/middlewares");

// Registrar desarrollador
router.post("/registro", uploadFiles, registroDesarrollador);

// Actualizar desarrollador
router.put("/:id", uploadFiles, actualizarDesarrollador);

module.exports = router;
