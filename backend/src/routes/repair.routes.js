// Rutas para gestión de reparaciones
const express = require('express');
const router = express.Router();
const RepairController = require('../controllers/repair.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// Todas las rutas requieren autenticación
router.use(authenticate);

// Obtener historial de reparaciones de un activo específico
// Accesible para todos los usuarios autenticados
router.get('/asset/:assetDetailId/history', RepairController.getHistoryByAsset);

// Las siguientes rutas requieren permisos de administrador
router.use(isAdmin);

// Obtener todas las reparaciones
router.get('/', RepairController.getAll);

// Obtener reparaciones por estado
router.get('/status/:status', RepairController.getByStatus);

// Registrar envío a reparación
router.post('/send', RepairController.sendToRepair);

// Registrar retorno de reparación
router.post('/return', RepairController.registerReturn);

module.exports = router;
