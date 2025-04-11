// Rutas para gestión de movimientos de inventario
const express = require('express');
const router = express.Router();
const InventoryController = require('../controllers/inventory.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas para consultas
// Obtener todos los movimientos de inventario
router.get('/movements', InventoryController.getAllMovements);

// Obtener movimientos por tipo
router.get('/movements/type/:type', InventoryController.getMovementsByType);

// Obtener movimientos por producto
router.get('/movements/product/:productId', InventoryController.getMovementsByProduct);

// Obtener movimientos por activo
router.get('/movements/asset/:assetDetailId', InventoryController.getMovementsByAsset);

// Obtener movimientos por usuario asignado
router.get('/movements/assigned-to/:userId', InventoryController.getMovementsByAssignedUser);

// Obtener activos asignados a un usuario
router.get('/assets/assigned-to/:userId', InventoryController.getAssignedAssetsByUser);

// Obtener activos asignados al usuario actual
router.get('/my-assets', InventoryController.getMyAssignedAssets);

// Rutas para operaciones (todas requieren autenticación, algunas también requieren rol de admin)

// Registrar entrada de inventario (requiere rol de admin)
router.post('/entry', isAdmin, InventoryController.registerEntry);

// Registrar salida de inventario (para todos los ítems excepto notebooks y celulares)
// (requiere rol de admin)
router.post('/out', isAdmin, InventoryController.registerOut);

// Registrar asignación de activo (para notebooks y celulares)
// (requiere rol de admin)
router.post('/assign', isAdmin, InventoryController.registerAssetAssignment);

module.exports = router;
