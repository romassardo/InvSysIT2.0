// Rutas para gestión de usuarios
const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// Todas las rutas requieren autenticación
router.use(authenticate);

// Obtener perfil del usuario actual
router.get('/profile', UserController.getProfile);

// Actualizar perfil del usuario actual
router.put('/profile', UserController.updateProfile);

// Las siguientes rutas requieren permisos de administrador
router.use(isAdmin);

// Obtener todos los usuarios
router.get('/', UserController.getAll);

// Obtener un usuario por ID
router.get('/:id', UserController.getById);

// Crear un nuevo usuario
router.post('/', UserController.create);

// Actualizar un usuario existente
router.put('/:id', UserController.update);

// Desactivar un usuario (eliminación lógica)
router.delete('/:id', UserController.deactivate);

module.exports = router;
