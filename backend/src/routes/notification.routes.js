// Rutas para gestión de notificaciones
const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notification.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// Todas las rutas requieren autenticación
router.use(authenticate);

// Obtener notificaciones del usuario actual
router.get('/my', NotificationController.getAll);

// Obtener notificaciones no leídas del usuario actual
router.get('/unread', NotificationController.getUnread);

// Marcar una notificación como leída
router.patch('/:id/read', NotificationController.markAsRead);

// Marcar todas las notificaciones como leídas
router.patch('/read-all', NotificationController.markAllAsRead);

// Las siguientes rutas requieren permisos de administrador
router.use(isAdmin);

// Crear una nueva notificación (para uno o múltiples usuarios)
router.post('/', NotificationController.create);

// Obtener todas las notificaciones (solo admin)
router.get('/all', NotificationController.getAll);

// Obtener notificaciones por usuario
router.get('/user/:userId', NotificationController.getByUser);

module.exports = router;
