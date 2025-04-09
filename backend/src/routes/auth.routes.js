// Rutas para autenticación y gestión de sesiones
const express = require('express');
const router = express.Router();
// En una versión posterior, importaremos los controladores reales
// const { login, register, changePassword } = require('../controllers/auth.controller');

// Ruta para login de usuario
router.post('/login', (req, res) => {
  // Implementación temporal hasta crear el controlador
  // Esta versión acepta cualquier usuario/contraseña para desarrollo inicial
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Usuario y contraseña son requeridos'
    });
  }
  
  // Respuesta temporal simulando una autenticación exitosa
  res.json({
    status: 'success',
    message: 'Inicio de sesión exitoso',
    data: {
      user: {
        id: 1,
        username: username,
        name: 'Usuario de Prueba',
        role: 'admin'
      },
      token: 'token-simulado-123456789'
    }
  });
});

// Ruta para registro de nuevo usuario (solo disponible para administradores)
router.post('/register', (req, res) => {
  // Implementación temporal
  const { username, password, name, role } = req.body;
  
  if (!username || !password || !name || !role) {
    return res.status(400).json({
      status: 'error',
      message: 'Todos los campos son requeridos'
    });
  }
  
  res.status(201).json({
    status: 'success',
    message: 'Usuario registrado exitosamente',
    data: {
      id: 2,
      username,
      name,
      role
    }
  });
});

// Ruta para cambio de contraseña
router.post('/change-password', (req, res) => {
  const { currentPassword, newPassword } = req.body;
  
  if (!currentPassword || !newPassword) {
    return res.status(400).json({
      status: 'error',
      message: 'Contraseña actual y nueva son requeridas'
    });
  }
  
  res.json({
    status: 'success',
    message: 'Contraseña actualizada exitosamente'
  });
});

module.exports = router;
