// Rutas para gestión de categorías
const express = require('express');
const router = express.Router();
const CategoryController = require('../controllers/category.controller');
const { authenticate, isAdmin } = require('../middleware/auth.middleware');

// Todas las rutas requieren autenticación
router.use(authenticate);

// Rutas públicas (accesibles para todos los usuarios autenticados)
// Obtener todas las categorías
router.get('/', CategoryController.getAll);

// Obtener una categoría por ID
router.get('/:id', CategoryController.getById);

// Obtener categorías principales (sin padre)
router.get('/main/list', CategoryController.getMainCategories);

// Obtener subcategorías de una categoría padre
router.get('/sub/:parentId', CategoryController.getSubcategories);

// Obtener estructura jerárquica completa de categorías
router.get('/hierarchy/all', CategoryController.getHierarchy);

// Las siguientes rutas requieren permisos de administrador
router.use(isAdmin);

// Crear una nueva categoría
router.post('/', CategoryController.create);

// Actualizar una categoría existente
router.put('/:id', CategoryController.update);

// Desactivar una categoría (eliminación lógica)
router.delete('/:id', CategoryController.deactivate);

module.exports = router;
