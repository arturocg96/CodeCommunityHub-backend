# API Documentation

## Usuarios

### Registrar Administrador
Registra un nuevo administrador en el sistema.

- **Method:** POST
- **Headers:** Content-Type: application/json
- **Body:** Requiere `email` y `password`.
- **Respuestas:**
  - **201 Created:** Administrador registrado con éxito.
  - **409 Conflict:** El email ya está registrado.
  - **400 Bad Request:** Faltan campos obligatorios.

### Login de Usuario
Permite a un usuario autenticarse.

- **Method:** POST
- **Headers:** Content-Type: application/json
- **Body:** Requiere `email` y `password`.
- **Respuestas:**
  - **200 OK:** Devuelve el token de sesión y los datos del usuario.
  - **401 Unauthorized:** Credenciales inválidas.
  - **400 Bad Request:** Faltan campos obligatorios.

### Renovar Token
Renueva el token JWT para extender la sesión.

- **Method:** POST
- **Headers:** Authorization: Bearer `<token>`.
- **Respuestas:**
  - **200 OK:** Token renovado exitosamente.
  - **401 Unauthorized:** Token inválido o expirado.
  - **403 Forbidden:** El usuario está inactivo.

---

## Empresas

### Registrar Empresa
Registra una nueva empresa en el sistema.

- **Method:** POST
- **Headers:** Content-Type: multipart/form-data
- **Body:** 
  - Campo `datos` con JSON que incluye información como nombre, email, contraseña, y más.
  - Campo `imagen` para subir una imagen opcional.
- **Respuestas:**
  - **201 Created:** Empresa registrada con éxito.
  - **409 Conflict:** El email ya está registrado.
  - **400 Bad Request:** Faltan campos obligatorios.

### Actualizar Empresa
Actualiza los datos de una empresa existente.

- **Method:** PUT
- **Headers:** Authorization: Bearer `<token>`, Content-Type: multipart/form-data
- **Body:** 
  - Campo `datos` con JSON que incluye los datos a actualizar.
  - Campo `imagen` opcional para actualizar la foto.
- **Respuestas:**
  - **200 OK:** Empresa actualizada correctamente.
  - **404 Not Found:** La empresa no existe.
  - **400 Bad Request:** Faltan campos obligatorios.

---

## Desarrolladores

### Registrar Desarrollador
Registra un nuevo desarrollador en el sistema.

- **Method:** POST
- **Headers:** Content-Type: multipart/form-data
- **Body:** 
  - Campo `datos` con JSON que incluye información como nombre, email, contraseña, tecnologías, y más.
  - Campo `imagen` para subir una foto opcional.
  - Campo `archivo` para subir el CV en PDF.
- **Respuestas:**
  - **201 Created:** Desarrollador registrado con éxito.
  - **409 Conflict:** El email ya está registrado.
  - **400 Bad Request:** Faltan campos obligatorios o tecnologías.

### Actualizar Desarrollador
Actualiza los datos de un desarrollador existente.

- **Method:** PUT
- **Headers:** Authorization: Bearer `<token>`, Content-Type: multipart/form-data
- **Body:** 
  - Campo `datos` con JSON que incluye los datos a actualizar.
  - Campo `imagen` opcional para actualizar la foto.
  - Campo `archivo` opcional para actualizar el CV.
- **Respuestas:**
  - **200 OK:** Desarrollador actualizado correctamente.
  - **404 Not Found:** El desarrollador no existe.
  - **400 Bad Request:** Faltan campos obligatorios.

---

## Notas Generales

- **Autenticación:** Para endpoints protegidos, se requiere un token JWT en el encabezado `Authorization: Bearer <token>`.
- **Formato de Imagen:** Las imágenes deben ser en formato `jpg` o `png`.
- **Formato de CV:** Los archivos deben ser en formato `PDF`.
- **Campos Obligatorios:** Verifica siempre que los campos necesarios sean enviados en cada solicitud.
