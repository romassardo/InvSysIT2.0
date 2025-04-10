// Controlador para la gestión de categorías
const Category = require('../models/category.model');
const logger = require('../utils/logger');

/**
 * Controlador para manejar operaciones CRUD de categorías
 */
class CategoryController {
    /**
     * Obtener todas las categorías
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getAll(req, res) {
        try {
            const categories = await Category.getAll();
            
            return res.json({
                status: 'success',
                data: categories
            });
        } catch (error) {
            logger.error(`Error al obtener categorías: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener categorías',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Obtener una categoría por ID
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const category = await Category.getById(id);
            
            if (!category) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Categoría no encontrada'
                });
            }
            
            return res.json({
                status: 'success',
                data: category
            });
        } catch (error) {
            logger.error(`Error al obtener categoría: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener categoría',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Obtener categorías principales (sin padre)
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getMainCategories(req, res) {
        try {
            const mainCategories = await Category.getMainCategories();
            
            return res.json({
                status: 'success',
                data: mainCategories
            });
        } catch (error) {
            logger.error(`Error al obtener categorías principales: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener categorías principales',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Obtener subcategorías de una categoría padre
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getSubcategories(req, res) {
        try {
            const { parentId } = req.params;
            const subcategories = await Category.getSubcategories(parentId);
            
            return res.json({
                status: 'success',
                data: subcategories
            });
        } catch (error) {
            logger.error(`Error al obtener subcategorías: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener subcategorías',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Crear una nueva categoría
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async create(req, res) {
        try {
            const { name, description, parentId } = req.body;
            
            // Validar datos obligatorios
            if (!name) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Por favor proporcione un nombre para la categoría'
                });
            }
            
            // Crear categoría
            const newCategory = await Category.create({
                name,
                description,
                parentId
            });
            
            return res.status(201).json({
                status: 'success',
                message: 'Categoría creada exitosamente',
                data: newCategory
            });
        } catch (error) {
            logger.error(`Error al crear categoría: ${error.message}`);
            
            // Manejo específico para errores conocidos
            if (error.message.includes('ya existe una categoría con el mismo nombre')) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Ya existe una categoría con el mismo nombre en este nivel'
                });
            }
            
            return res.status(500).json({
                status: 'error',
                message: 'Error al crear categoría',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Actualizar una categoría existente
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { name, description, parentId, active } = req.body;
            
            // Validar que la categoría exista
            const existingCategory = await Category.getById(id);
            if (!existingCategory) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Categoría no encontrada'
                });
            }
            
            // Actualizar categoría
            const updatedCategory = await Category.update(id, {
                name,
                description,
                parentId,
                active: active !== undefined ? active : existingCategory.active
            });
            
            return res.json({
                status: 'success',
                message: 'Categoría actualizada exitosamente',
                data: updatedCategory
            });
        } catch (error) {
            logger.error(`Error al actualizar categoría: ${error.message}`);
            
            // Manejo específico para errores conocidos
            if (error.message.includes('ya existe una categoría con el mismo nombre')) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Ya existe una categoría con el mismo nombre en este nivel'
                });
            } else if (error.message.includes('no puede ser su propio padre') || 
                       error.message.includes('no se puede crear un ciclo')) {
                return res.status(400).json({
                    status: 'error',
                    message: 'No se puede crear una estructura cíclica de categorías'
                });
            }
            
            return res.status(500).json({
                status: 'error',
                message: 'Error al actualizar categoría',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Desactivar una categoría (borrado lógico)
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async deactivate(req, res) {
        try {
            const { id } = req.params;
            
            // Validar que la categoría exista
            const existingCategory = await Category.getById(id);
            if (!existingCategory) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Categoría no encontrada'
                });
            }
            
            // Desactivar categoría
            const deactivated = await Category.deactivate(id);
            
            if (deactivated) {
                return res.json({
                    status: 'success',
                    message: 'Categoría desactivada exitosamente junto con sus subcategorías'
                });
            } else {
                return res.status(400).json({
                    status: 'error',
                    message: 'No se pudo desactivar la categoría'
                });
            }
        } catch (error) {
            logger.error(`Error al desactivar categoría: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al desactivar categoría',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Obtener estructura jerárquica completa de categorías
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getHierarchy(req, res) {
        try {
            const hierarchy = await Category.getHierarchy();
            
            return res.json({
                status: 'success',
                data: hierarchy
            });
        } catch (error) {
            logger.error(`Error al obtener jerarquía de categorías: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener jerarquía de categorías',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }
}

module.exports = CategoryController;
