// Modelo para gestionar productos (activos y consumibles)
const BaseModel = require('./base.model');
const logger = require('../utils/logger');

class Product extends BaseModel {
    /**
     * Obtiene todos los productos
     * @returns {Promise<Array>} - Lista de productos
     */
    static async getAll() {
        try {
            return await this.executeProcedure('sp_GetAllProducts');
        } catch (error) {
            logger.error(`Error al obtener todos los productos: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtiene un producto por su ID
     * @param {number} productId - ID del producto
     * @returns {Promise<Object>} - Datos del producto
     */
    static async getById(productId) {
        try {
            const products = await this.executeProcedure('sp_GetProductById', { productId });
            return products && products.length > 0 ? products[0] : null;
        } catch (error) {
            logger.error(`Error al obtener producto por ID: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtiene productos por tipo (activo o consumible)
     * @param {string} type - Tipo de producto ('asset' o 'consumable')
     * @returns {Promise<Array>} - Lista de productos
     */
    static async getByType(type) {
        try {
            return await this.executeProcedure('sp_GetProductsByType', { type });
        } catch (error) {
            logger.error(`Error al obtener productos por tipo: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtiene productos por categoría
     * @param {number} categoryId - ID de la categoría
     * @returns {Promise<Array>} - Lista de productos
     */
    static async getByCategory(categoryId) {
        try {
            return await this.executeProcedure('sp_GetProductsByCategory', { categoryId });
        } catch (error) {
            logger.error(`Error al obtener productos por categoría: ${error.message}`);
            throw error;
        }
    }

    /**
     * Crea un nuevo producto
     * @param {Object} productData - Datos del producto
     * @returns {Promise<Object>} - Producto creado
     */
    static async create(productData) {
        try {
            const result = await this.executeProcedure('sp_CreateProduct', {
                name: productData.name,
                description: productData.description,
                model: productData.model,
                brand: productData.brand,
                categoryId: productData.categoryId,
                type: productData.type,
                currentStock: productData.currentStock || 0,
                minimumStock: productData.minimumStock || 0
            });

            if (result && result.length > 0 && result[0].id) {
                return await this.getById(result[0].id);
            }

            throw new Error('No se pudo crear el producto');
        } catch (error) {
            logger.error(`Error al crear producto: ${error.message}`);
            throw error;
        }
    }

    /**
     * Actualiza un producto existente
     * @param {number} productId - ID del producto
     * @param {Object} productData - Datos a actualizar
     * @returns {Promise<Object>} - Producto actualizado
     */
    static async update(productId, productData) {
        try {
            await this.executeProcedure('sp_UpdateProduct', {
                productId,
                name: productData.name,
                description: productData.description,
                model: productData.model,
                brand: productData.brand,
                categoryId: productData.categoryId,
                type: productData.type,
                minimumStock: productData.minimumStock,
                active: productData.active
            });

            return await this.getById(productId);
        } catch (error) {
            logger.error(`Error al actualizar producto: ${error.message}`);
            throw error;
        }
    }

    /**
     * Actualiza el stock de un producto
     * @param {number} productId - ID del producto
     * @param {number} quantity - Cantidad a sumar o restar (puede ser negativo)
     * @returns {Promise<Object>} - Resultado con el stock actualizado
     */
    static async updateStock(productId, quantity) {
        try {
            return await this.executeProcedure('sp_UpdateProductStock', { productId, quantity });
        } catch (error) {
            logger.error(`Error al actualizar stock: ${error.message}`);
            throw error;
        }
    }

    /**
     * Busca productos por término de búsqueda
     * @param {string} searchTerm - Término a buscar
     * @returns {Promise<Array>} - Lista de productos que coinciden
     */
    static async search(searchTerm) {
        try {
            return await this.executeProcedure('sp_SearchProducts', { searchTerm });
        } catch (error) {
            logger.error(`Error al buscar productos: ${error.message}`);
            throw error;
        }
    }
}

module.exports = Product;
