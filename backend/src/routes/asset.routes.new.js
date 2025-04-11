// Rutas para gestión de activos específicos
const express = require('express');
const router = express.Router();
const AssetController = require('../controllers/asset.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas públicas (accesibles para todos los usuarios autenticados)
// Obtener un activo por ID
router.get('/:id', AssetController.getById);

// Obtener activos por producto
router.get('/product/:productId', AssetController.getByProductId);

// Obtener activos disponibles por producto
router.get('/available/product/:productId', AssetController.getAvailableByProductId);

// Obtener activos disponibles para asignación (notebooks y celulares)
router.get('/assignable', AssetController.getAssignableAssets);

// Buscar activos por término
router.get('/search', AssetController.search);

// Las siguientes rutas requieren permisos de administrador
router.use(isAdmin);

// Crear un nuevo activo
router.post('/', AssetController.create);

// Actualizar un activo existente
router.put('/:id', AssetController.update);

// Actualizar el estado de un activo
router.patch('/:id/status', AssetController.updateStatus);

module.exports = router;
