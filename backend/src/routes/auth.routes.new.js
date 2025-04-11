// Rutas para autenticación y gestión de sesiones
const express = require('express');
const router = express.Router();
const AuthController = require('../controllers/auth.controller');
const { authenticate } = require('../middleware/auth.middleware');

// Ruta para login de usuario
router.post('/login', AuthController.login);

// Ruta para verificar token JWT actual
router.get('/verify', authenticate, AuthController.verifyToken);

// Ruta para cambio de contraseña (requiere autenticación)
router.post('/change-password', authenticate, AuthController.changePassword);

module.exports = router;
