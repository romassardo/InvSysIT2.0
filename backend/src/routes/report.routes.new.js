// Rutas para generación de reportes
const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/report.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// Todas las rutas requieren autenticación
router.use(authenticate);

// Obtener listado de reportes disponibles
router.get('/', ReportController.getAvailableReports);

// Reportes accesibles para todos los usuarios autenticados

// Inventario actual
router.get('/current-inventory', ReportController.currentInventory);

// Activos asignados al usuario actual
router.get('/my-assets', ReportController.myAssignedAssets);

// Historial de movimientos de un activo específico
router.get('/asset-history/:assetId', ReportController.assetHistory);

// Las siguientes rutas requieren permisos de administrador
router.use(isAdmin);

// Reporte de activos asignados (todos los usuarios)
router.get('/assigned-assets', ReportController.assignedAssets);

// Reporte de movimientos de inventario
router.get('/inventory-movements', ReportController.inventoryMovements);

// Reporte de consumibles bajo stock mínimo
router.get('/low-stock', ReportController.lowStock);

// Reporte de reparaciones y mantenimiento
router.get('/repairs-maintenance', ReportController.repairsAndMaintenance);

// Reporte personalizado con filtros avanzados
router.post('/custom', ReportController.customReport);

module.exports = router;
