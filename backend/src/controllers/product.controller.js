// Controlador para la gestión de productos (activos y consumibles)
const Product = require('../models/product.model');
const logger = require('../utils/logger');

/**
 * Controlador para manejar operaciones CRUD de productos
 */
class ProductController {
    /**
     * Obtener todos los productos
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getAll(req, res) {
        try {
            const products = await Product.getAll();
            
            return res.json({
                status: 'success',
                data: products
            });
        } catch (error) {
            logger.error(`Error al obtener productos: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener productos',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Obtener un producto por ID
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const product = await Product.getById(id);
            
            if (!product) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Producto no encontrado'
                });
            }
            
            return res.json({
                status: 'success',
                data: product
            });
        } catch (error) {
            logger.error(`Error al obtener producto: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener producto',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Obtener productos por tipo (activo o consumible)
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getByType(req, res) {
        try {
            const { type } = req.params;
            
            // Validar que el tipo sea válido
            if (type !== 'asset' && type !== 'consumable') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Tipo de producto inválido. Debe ser "asset" o "consumable"'
                });
            }
            
            const products = await Product.getByType(type);
            
            return res.json({
                status: 'success',
                data: products
            });
        } catch (error) {
            logger.error(`Error al obtener productos por tipo: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener productos por tipo',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Obtener productos por categoría
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getByCategory(req, res) {
        try {
            const { categoryId } = req.params;
            const products = await Product.getByCategory(categoryId);
            
            return res.json({
                status: 'success',
                data: products
            });
        } catch (error) {
            logger.error(`Error al obtener productos por categoría: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener productos por categoría',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Crear un nuevo producto
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async create(req, res) {
        try {
            const { 
                name, description, model, brand, categoryId, 
                type, currentStock, minimumStock 
            } = req.body;
            
            // Validar datos obligatorios
            if (!name || !type || !categoryId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Por favor proporcione nombre, tipo y categoría para el producto'
                });
            }
            
            // Validar que el tipo sea válido
            if (type !== 'asset' && type !== 'consumable') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Tipo de producto inválido. Debe ser "asset" o "consumable"'
                });
            }
            
            // Crear producto
            const newProduct = await Product.create({
                name,
                description,
                model,
                brand,
                categoryId,
                type,
                currentStock: currentStock || 0,
                minimumStock: minimumStock || 0
            });
            
            return res.status(201).json({
                status: 'success',
                message: 'Producto creado exitosamente',
                data: newProduct
            });
        } catch (error) {
            logger.error(`Error al crear producto: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al crear producto',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Actualizar un producto existente
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { 
                name, description, model, brand, categoryId, 
                type, minimumStock, active 
            } = req.body;
            
            // Validar que el producto exista
            const existingProduct = await Product.getById(id);
            if (!existingProduct) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Producto no encontrado'
                });
            }
            
            // Validar que el tipo sea válido
            if (type && type !== 'asset' && type !== 'consumable') {
                return res.status(400).json({
                    status: 'error',
                    message: 'Tipo de producto inválido. Debe ser "asset" o "consumable"'
                });
            }
            
            // Actualizar producto
            const updatedProduct = await Product.update(id, {
                name,
                description,
                model,
                brand,
                categoryId,
                type: type || existingProduct.type,
                minimumStock: minimumStock !== undefined ? minimumStock : existingProduct.minimumStock,
                active: active !== undefined ? active : existingProduct.active
            });
            
            return res.json({
                status: 'success',
                message: 'Producto actualizado exitosamente',
                data: updatedProduct
            });
        } catch (error) {
            logger.error(`Error al actualizar producto: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al actualizar producto',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Actualizar el stock de un producto
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async updateStock(req, res) {
        try {
            const { id } = req.params;
            const { quantity } = req.body;
            
            // Validar datos obligatorios
            if (quantity === undefined) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Por favor proporcione la cantidad a modificar'
                });
            }
            
            // Validar que el producto exista
            const existingProduct = await Product.getById(id);
            if (!existingProduct) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Producto no encontrado'
                });
            }
            
            // Validar que no quede stock negativo
            if (existingProduct.currentStock + quantity < 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'No hay suficiente stock disponible'
                });
            }
            
            // Actualizar stock
            const result = await Product.updateStock(id, quantity);
            
            return res.json({
                status: 'success',
                message: 'Stock actualizado exitosamente',
                data: {
                    productId: parseInt(id),
                    currentStock: result && result.length > 0 ? result[0].currentStock : 0
                }
            });
        } catch (error) {
            logger.error(`Error al actualizar stock: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al actualizar stock',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Buscar productos por término
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async search(req, res) {
        try {
            const { term } = req.query;
            
            if (!term) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Por favor proporcione un término de búsqueda'
                });
            }
            
            const products = await Product.search(term);
            
            return res.json({
                status: 'success',
                data: products
            });
        } catch (error) {
            logger.error(`Error al buscar productos: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al buscar productos',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }
}

module.exports = ProductController;
