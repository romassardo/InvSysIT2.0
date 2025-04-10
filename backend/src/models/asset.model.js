// Modelo para gestionar detalles de activos
const BaseModel = require('./base.model');
const logger = require('../utils/logger');

class Asset extends BaseModel {
    /**
     * Obtiene detalle de un activo por su ID
     * @param {number} assetDetailId - ID del detalle de activo
     * @returns {Promise<Object>} - Detalle del activo
     */
    static async getById(assetDetailId) {
        try {
            const assets = await this.executeProcedure('sp_GetAssetDetailById', { assetDetailId });
            return assets && assets.length > 0 ? assets[0] : null;
        } catch (error) {
            logger.error(`Error al obtener detalle de activo por ID: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtiene todos los activos de un producto
     * @param {number} productId - ID del producto
     * @returns {Promise<Array>} - Lista de detalles de activos
     */
    static async getByProductId(productId) {
        try {
            return await this.executeProcedure('sp_GetAssetDetailsByProductId', { productId });
        } catch (error) {
            logger.error(`Error al obtener activos por producto: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtiene activos disponibles de un producto
     * @param {number} productId - ID del producto
     * @returns {Promise<Array>} - Lista de activos disponibles
     */
    static async getAvailableByProductId(productId) {
        try {
            return await this.executeProcedure('sp_GetAvailableAssetsByProductId', { productId });
        } catch (error) {
            logger.error(`Error al obtener activos disponibles: ${error.message}`);
            throw error;
        }
    }

    /**
     * Crea un nuevo detalle de activo
     * @param {Object} assetData - Datos del activo
     * @returns {Promise<Object>} - Activo creado
     */
    static async create(assetData) {
        try {
            const result = await this.executeProcedure('sp_CreateAssetDetail', {
                productId: assetData.productId,
                serialNumber: assetData.serialNumber,
                assetTag: assetData.assetTag,
                purchaseDate: assetData.purchaseDate,
                warrantyExpiration: assetData.warrantyExpiration,
                notes: assetData.notes,
                encryptionPass: assetData.encryptionPass
            });

            if (result && result.length > 0 && result[0].id) {
                return await this.getById(result[0].id);
            }

            throw new Error('No se pudo crear el detalle de activo');
        } catch (error) {
            logger.error(`Error al crear detalle de activo: ${error.message}`);
            throw error;
        }
    }

    /**
     * Actualiza un detalle de activo existente
     * @param {number} assetDetailId - ID del detalle de activo
     * @param {Object} assetData - Datos a actualizar
     * @returns {Promise<Object>} - Activo actualizado
     */
    static async update(assetDetailId, assetData) {
        try {
            await this.executeProcedure('sp_UpdateAssetDetail', {
                assetDetailId,
                serialNumber: assetData.serialNumber,
                assetTag: assetData.assetTag,
                purchaseDate: assetData.purchaseDate,
                warrantyExpiration: assetData.warrantyExpiration,
                status: assetData.status,
                notes: assetData.notes,
                encryptionPass: assetData.encryptionPass
            });

            return await this.getById(assetDetailId);
        } catch (error) {
            logger.error(`Error al actualizar detalle de activo: ${error.message}`);
            throw error;
        }
    }

    /**
     * Actualiza el estado de un activo
     * @param {number} assetDetailId - ID del detalle de activo
     * @param {string} status - Nuevo estado
     * @returns {Promise<boolean>} - Resultado de la operación
     */
    static async updateStatus(assetDetailId, status) {
        try {
            const result = await this.executeProcedure('sp_UpdateAssetStatus', { 
                assetDetailId,
                status
            });
            
            return result && result.length > 0 && result[0].rowsAffected > 0;
        } catch (error) {
            logger.error(`Error al actualizar estado de activo: ${error.message}`);
            throw error;
        }
    }

    /**
     * Busca activos por término de búsqueda
     * @param {string} searchTerm - Término a buscar
     * @returns {Promise<Array>} - Lista de activos que coinciden
     */
    static async search(searchTerm) {
        try {
            return await this.executeProcedure('sp_SearchAssets', { searchTerm });
        } catch (error) {
            logger.error(`Error al buscar activos: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtiene activos disponibles para asignación (notebooks y celulares)
     * @returns {Promise<Array>} - Lista de activos disponibles para asignación
     */
    static async getAssignableAssets() {
        try {
            return await this.executeProcedure('sp_GetAssignableAssets');
        } catch (error) {
            logger.error(`Error al obtener activos asignables: ${error.message}`);
            throw error;
        }
    }
}

module.exports = Asset;
