const multer = require("multer");
const path = require("path");

const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const validator = require("validator");

// Middleware para imágenes
const uploadToImgProfile = multer({
  dest: path.join(__dirname, "../Public/img/profiles/"),
});

// Middleware para PDFs
const uploadToPdfCv = multer({
  dest: path.join(__dirname, "../Public/cvs/"),
});

// Middleware combinado para múltiples archivos
const uploadFiles = multer({
  storage: multer.diskStorage({
    destination: (req, file, cb) => {
      if (file.fieldname === "imagen") {
        cb(null, path.join(__dirname, "../Public/img/profiles/"));
      } else if (file.fieldname === "archivo") {
        cb(null, path.join(__dirname, "../Public/cvs/"));
      }
    },
    filename: (req, file, cb) => {
      const extension = path.extname(file.originalname);
      const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${extension}`;
      cb(null, uniqueName);
    },
  }),
}).fields([
  { name: "imagen", maxCount: 1 },
  { name: "archivo", maxCount: 1 },
]);

// Middleware para limitar intentos de login
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 5, // Máximo de intentos
  message: "Has excedido el número máximo de intentos de inicio de sesión. Intenta de nuevo más tarde.",
});

// Middleware para validar el token JWT
const validarToken = (req, res, next) => {
  const token = req.headers["authorization"];
  if (!token) {
    return res.status(403).json({ mensaje: "No se proporcionó un token. Acceso denegado." });
  }

  try {
    const decoded = jwt.verify(token, process.env.CLAVE);
    req.usuario = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ mensaje: "Token inválido o expirado." });
  }
};

// Middleware para validar el formato del email
const validarEmail = (req, res, next) => {
  const { email } = req.body;
  if (!validator.isEmail(email)) {
    return res.status(400).json({ mensaje: "Por favor, ingresa un email válido." });
  }
  next();
};

module.exports = {
  uploadToImgProfile,
  uploadToPdfCv,
  uploadFiles,
  loginLimiter,
  validarToken,
  validarEmail,

};
