const bcrypt = require("bcryptjs");

const { insertEmpresa, selectEmpresaById,updateEmpresa } = require("../models/EmpresaModel");
const { saveProfileImage } = require("../utils/middlewares");
const fs = require("fs");
const path = require("path");

const registroEmpresa = async (req, res, next) => {
  try {
    // Verificar si se recibió el campo "datos"
    if (!req.body.datos) {
      return res.status(400).json({ mensaje: "El campo 'datos' es obligatorio y debe contener un JSON válido." });
    }

    const datos = JSON.parse(req.body.datos);

    // Verificar si se subió una imagen
    let foto = null;
    if (req.file) {
      foto = saveProfileImage(req.file); // Guardar la imagen temporalmente
      datos.foto = foto; // Agregar la ruta al objeto datos
    }
 
    // Encriptar la contraseña
    datos.password = await bcrypt.hash(datos.password, 8);

    // Intentar insertar los datos de la empresa
    const empresaId = await insertEmpresa(datos);

    // Recuperar la empresa recién registrada
    const nuevaEmpresa = await selectEmpresaById(empresaId);

    res.status(201).json(nuevaEmpresa);
  } catch (error) {
    // Eliminar la imagen si ocurrió un error y ya fue guardada
    if (req.file) {
      const fs = require("fs");
      const path = require("path");
      const filePath = path.join(__dirname, "../Public", datos.foto);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // Eliminar la imagen
      }
    }

    // Email duplicado (error de MySQL)
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ mensaje: "El email ya está registrado. Por favor, usa otro email." });
    }

    // Otros errores
    console.error("Error en registroEmpresa:", error);
    res.status(500).json({ mensaje: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde." });
  }
};

const actualizarEmpresa = async (req, res, next) => {
  try {
    if (!req.body.datos) {
      return res.status(400).json({ mensaje: "El campo 'datos' es obligatorio y debe contener un JSON válido." });
    }

    const datos = JSON.parse(req.body.datos);

    // Recuperar la empresa actual
    const empresaActual = await selectEmpresaById(req.params.id);
    console.log("Empresa actual:", empresaActual);

    if (!empresaActual) {
      return res.status(404).json({ mensaje: "La empresa no existe." });
    }

    // Si el email no cambia, conserva el actual
    if (datos.email === empresaActual.email) {
      datos.email = empresaActual.email;
    }

    // Manejar la foto
    if (req.file) {
      const nuevaFoto = saveProfileImage(req.file);
      if (empresaActual.foto) {
        const rutaFotoAnterior = path.join(__dirname, "../Public", empresaActual.foto);
        if (fs.existsSync(rutaFotoAnterior)) {
          fs.unlinkSync(rutaFotoAnterior);
        }
      }
      datos.foto = nuevaFoto;
    } else {
      datos.foto = empresaActual.foto;
    }

    // Actualizar la empresa
    const empresaActualizada = await updateEmpresa(req.params.id, datos);

    if (!empresaActualizada) {
      return res.status(500).json({ mensaje: "No se pudo actualizar la empresa. Inténtalo de nuevo." });
    }

    const empresa = await selectEmpresaById(req.params.id);
    res.status(200).json(empresa);
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({ mensaje: "El email ya está registrado por otra empresa. Por favor, usa un email diferente." });
    }
    console.error("Error en actualizarEmpresa:", error);
    res.status(500).json({ mensaje: "Ocurrió un error inesperado. Por favor, inténtalo de nuevo más tarde." });
  }
};


module.exports = {
  registroEmpresa,
  actualizarEmpresa
};
