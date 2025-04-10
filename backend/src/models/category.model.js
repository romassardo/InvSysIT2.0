// Modelo para gestionar categorías y subcategorías
const BaseModel = require('./base.model');
const logger = require('../utils/logger');

class Category extends BaseModel {
    /**
     * Obtiene todas las categorías
     * @returns {Promise<Array>} - Lista de categorías
     */
    static async getAll() {
        try {
            return await this.executeProcedure('sp_GetAllCategories');
        } catch (error) {
            logger.error(`Error al obtener todas las categorías: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtiene una categoría por su ID
     * @param {number} categoryId - ID de la categoría
     * @returns {Promise<Object>} - Datos de la categoría
     */
    static async getById(categoryId) {
        try {
            const categories = await this.executeProcedure('sp_GetCategoryById', { categoryId });
            return categories && categories.length > 0 ? categories[0] : null;
        } catch (error) {
            logger.error(`Error al obtener categoría por ID: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtiene categorías principales (sin padre)
     * @returns {Promise<Array>} - Lista de categorías principales
     */
    static async getMainCategories() {
        try {
            return await this.executeProcedure('sp_GetMainCategories');
        } catch (error) {
            logger.error(`Error al obtener categorías principales: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtiene subcategorías de una categoría padre
     * @param {number} parentId - ID de la categoría padre
     * @returns {Promise<Array>} - Lista de subcategorías
     */
    static async getSubcategories(parentId) {
        try {
            return await this.executeProcedure('sp_GetSubcategoriesByParentId', { parentId });
        } catch (error) {
            logger.error(`Error al obtener subcategorías: ${error.message}`);
            throw error;
        }
    }

    /**
     * Crea una nueva categoría
     * @param {Object} categoryData - Datos de la categoría
     * @returns {Promise<Object>} - Categoría creada
     */
    static async create(categoryData) {
        try {
            const result = await this.executeProcedure('sp_CreateCategory', {
                name: categoryData.name,
                description: categoryData.description,
                parentId: categoryData.parentId || null
            });

            if (result && result.length > 0 && result[0].id) {
                return await this.getById(result[0].id);
            }

            throw new Error('No se pudo crear la categoría');
        } catch (error) {
            logger.error(`Error al crear categoría: ${error.message}`);
            throw error;
        }
    }

    /**
     * Actualiza una categoría existente
     * @param {number} categoryId - ID de la categoría
     * @param {Object} categoryData - Datos a actualizar
     * @returns {Promise<Object>} - Categoría actualizada
     */
    static async update(categoryId, categoryData) {
        try {
            await this.executeProcedure('sp_UpdateCategory', {
                categoryId,
                name: categoryData.name,
                description: categoryData.description,
                parentId: categoryData.parentId,
                active: categoryData.active
            });

            return await this.getById(categoryId);
        } catch (error) {
            logger.error(`Error al actualizar categoría: ${error.message}`);
            throw error;
        }
    }

    /**
     * Desactiva una categoría (eliminación lógica)
     * @param {number} categoryId - ID de la categoría
     * @returns {Promise<boolean>} - Resultado de la operación
     */
    static async deactivate(categoryId) {
        try {
            const result = await this.executeProcedure('sp_DeactivateCategory', { categoryId });
            return result && result.length > 0 && result[0].rowsAffected > 0;
        } catch (error) {
            logger.error(`Error al desactivar categoría: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtiene la estructura jerárquica completa de categorías
     * @returns {Promise<Array>} - Estructura jerárquica de categorías
     */
    static async getHierarchy() {
        try {
            return await this.executeProcedure('sp_GetCategoryHierarchy');
        } catch (error) {
            logger.error(`Error al obtener jerarquía de categorías: ${error.message}`);
            throw error;
        }
    }
}

module.exports = Category;
