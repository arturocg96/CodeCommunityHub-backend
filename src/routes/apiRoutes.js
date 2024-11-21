const router = require("express").Router();

router.use("/empresas", require("./api/apiEmpresasRoutes"));

router.use("/desarrolladores", require("./api/apiDesarrolladoresRoutes"));

router.use("/usuarios", require("./api/apiUsuariosRoutes"));

module.exports = router;
