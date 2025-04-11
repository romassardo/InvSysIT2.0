// Rutas para gestión de productos (activos y consumibles)
const express = require('express');
const router = express.Router();
const ProductController = require('../controllers/product.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas públicas (accesibles para todos los usuarios autenticados)
// Obtener todos los productos
router.get('/', ProductController.getAll);

// Obtener un producto por ID
router.get('/:id', ProductController.getById);

// Obtener productos por tipo (activo o consumible)
router.get('/type/:type', ProductController.getByType);

// Obtener productos por categoría
router.get('/category/:categoryId', ProductController.getByCategory);

// Buscar productos por término
router.get('/search', ProductController.search);

// Las siguientes rutas requieren permisos de administrador
router.use(isAdmin);

// Crear un nuevo producto
router.post('/', ProductController.create);

// Actualizar un producto existente
router.put('/:id', ProductController.update);

// Actualizar el stock de un producto
router.patch('/:id/stock', ProductController.updateStock);

module.exports = router;
