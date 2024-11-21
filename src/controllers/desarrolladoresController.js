const bcrypt = require("bcryptjs");
const { insertDesarrollador, updateDesarrollador, selectDesarrolladorById } = require("../models/DesarrolladorModel");
const { getTecnologiasByDesarrolladorId } = require("../models/TecnologiaModel");
const { saveProfileImage } = require("../utils/middlewares");
const fs = require("fs");
const path = require("path");

const registroDesarrollador = async (req, res, next) => {
    try {
      if (!req.body.datos) {
        return res.status(400).json({ mensaje: "El campo 'datos' es obligatorio y debe contener un JSON válido." });
      }
  
      const datos = JSON.parse(req.body.datos);
  
      // Validaciones básicas de campos
      if (!datos.nombre || !datos.email || !datos.password) {
        return res.status(400).json({ mensaje: "El nombre, email y contraseña son obligatorios." });
      }
  
      // Validar tecnologías
      if (!Array.isArray(datos.tecnologias) || datos.tecnologias.length === 0) {
        return res.status(400).json({ mensaje: "Debes proporcionar al menos una tecnología." });
      }
  
      // Manejar la imagen (si se envía)
      if (req.files && req.files.imagen) {
        datos.foto = `/img/profiles/${req.files.imagen[0].filename}`;
      }
  
      // Manejar el CV (si se envía)
      if (req.files && req.files.archivo) {
        datos.cv = `/cvs/${req.files.archivo[0].filename}`;
      }
  
      // Encriptar contraseña
      datos.password = await bcrypt.hash(datos.password, 8);
  
      // Intentar insertar el desarrollador
      const desarrolladorId = await insertDesarrollador(datos);
  
      // Recuperar los datos completos del desarrollador
      const nuevoDesarrollador = await selectDesarrolladorById(desarrolladorId);
  
      // Obtener los nombres de las tecnologías asociadas
      const tecnologias = await getTecnologiasByDesarrolladorId(desarrolladorId);
  
      // Respuesta exitosa
      res.status(201).json({
        mensaje: "El desarrollador se ha registrado correctamente.",
        usuario: nuevoDesarrollador.usuario,
        desarrollador: nuevoDesarrollador.desarrollador,
        tecnologias,
      });
    } catch (error) {
      // Eliminar archivos si hay un error
      if (req.files && req.files.imagen) {
        const rutaImagen = path.join(__dirname, "../Public", `/img/profiles/${req.files.imagen[0].filename}`);
        if (fs.existsSync(rutaImagen)) {
          fs.unlinkSync(rutaImagen);
        }
      }
  
      if (req.files && req.files.archivo) {
        const rutaCv = path.join(__dirname, "../Public", `/cvs/${req.files.archivo[0].filename}`);
        if (fs.existsSync(rutaCv)) {
          fs.unlinkSync(rutaCv);
        }
      }
  
      // Mensajes amigables de error
      if (error.code === "ER_DUP_ENTRY") {
        return res.status(409).json({ mensaje: "El email ya está registrado. Por favor, usa otro email." });
      }
  
      console.error("Error en registroDesarrollador:", error);
      res.status(500).json({ mensaje: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde." });
    }
  };
  
// Actualizar desarrollador
const actualizarDesarrollador = async (req, res, next) => {
    try {
      if (!req.body.datos) {
        return res.status(400).json({ mensaje: "El campo 'datos' es obligatorio y debe contener un JSON válido." });
      }
  
      const datos = JSON.parse(req.body.datos);
  
      // Validaciones básicas
      if (!datos.nombre || !datos.email) {
        return res.status(400).json({ mensaje: "El nombre y el email son obligatorios." });
      }
  
      if (!Array.isArray(datos.tecnologias) || datos.tecnologias.length === 0) {
        return res.status(400).json({ mensaje: "Debes proporcionar al menos una tecnología." });
      }
  
      // Recuperar datos actuales del desarrollador
      const desarrolladorActual = await selectDesarrolladorById(req.params.id);
      if (!desarrolladorActual) {
        return res.status(404).json({ mensaje: "El desarrollador no existe." });
      }
  
      // Manejar la imagen (si se envía)
      if (req.files && req.files.imagen) {
        if (desarrolladorActual.usuario.foto) {
          const rutaFotoAnterior = path.join(__dirname, "../Public", desarrolladorActual.usuario.foto);
          if (fs.existsSync(rutaFotoAnterior)) {
            fs.unlinkSync(rutaFotoAnterior);
          }
        }
        datos.foto = `/img/profiles/${req.files.imagen[0].filename}`;
      } else {
        datos.foto = desarrolladorActual.usuario.foto;
      }
  
      // Manejar el CV (si se envía)
      if (req.files && req.files.archivo) {
        if (desarrolladorActual.desarrollador.cv) {
          const rutaCvAnterior = path.join(__dirname, "../Public", desarrolladorActual.desarrollador.cv);
          if (fs.existsSync(rutaCvAnterior)) {
            fs.unlinkSync(rutaCvAnterior);
          }
        }
        datos.cv = `/cvs/${req.files.archivo[0].filename}`;
      } else {
        datos.cv = desarrolladorActual.desarrollador.cv;
      }
  
      // Actualizar desarrollador
      const desarrolladorActualizado = await updateDesarrollador(req.params.id, datos);
  
      if (!desarrolladorActualizado) {
        return res.status(500).json({ mensaje: "No se pudo actualizar el desarrollador. Inténtalo de nuevo." });
      }
  
      // Recuperar los datos completos del desarrollador
      const desarrollador = await selectDesarrolladorById(req.params.id);
  
      // Obtener los nombres de las tecnologías asociadas
      const tecnologias = await getTecnologiasByDesarrolladorId(req.params.id);
  
      res.status(200).json({
        mensaje: "El desarrollador se ha actualizado correctamente.",
        usuario: desarrollador.usuario,
        desarrollador: desarrollador.desarrollador,
        tecnologias,
      });
    } catch (error) {
      console.error("Error en actualizarDesarrollador:", error);
      res.status(500).json({ mensaje: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde." });
    }
  };
  

module.exports = {
  registroDesarrollador,
  actualizarDesarrollador,
};
