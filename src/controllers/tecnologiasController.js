const { obtenerTodasLasTecnologias } = require("../models/TecnologiaModel");

const obtenerTecnologias = async (req, res, next) => {
  try {
    const tecnologias = await obtenerTodasLasTecnologias();

    if (tecnologias.length === 0) {
      return res.status(404).json({ mensaje: "No se encontraron tecnologías." });
    }

    res.status(200).json({
      mensaje: "Tecnologías obtenidas con éxito.",
      tecnologias,
    });
  } catch (error) {
    console.error("Error en obtenerTecnologias:", error);
    res.status(500).json({ mensaje: "Ocurrió un error al obtener las tecnologías. Inténtalo de nuevo más tarde." });
  }
};

module.exports = {
  obtenerTecnologias,
};
