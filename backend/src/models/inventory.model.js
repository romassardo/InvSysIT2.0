// Modelo para gestionar movimientos de inventario
const BaseModel = require('./base.model');
const logger = require('../utils/logger');

class Inventory extends BaseModel {
    /**
     * Registra una entrada de inventario
     * @param {Object} entryData - Datos de la entrada
     * @returns {Promise<Object>} - Resultado de la operación
     */
    static async registerEntry(entryData) {
        try {
            const result = await this.executeProcedure('sp_RegisterInventoryEntry', {
                productId: entryData.productId,
                quantity: entryData.quantity,
                sourceId: entryData.sourceId,
                notes: entryData.notes,
                createdBy: entryData.createdBy
            });

            return result && result.length > 0 ? result[0] : null;
        } catch (error) {
            logger.error(`Error al registrar entrada de inventario: ${error.message}`);
            throw error;
        }
    }

    /**
     * Registra una salida de inventario (para todos los ítems excepto notebooks y celulares)
     * @param {Object} outData - Datos de la salida
     * @returns {Promise<Object>} - Resultado de la operación
     */
    static async registerOut(outData) {
        try {
            const result = await this.executeProcedure('sp_RegisterInventoryOut', {
                productId: outData.productId,
                quantity: outData.quantity,
                destinationDepartmentId: outData.destinationDepartmentId,
                destinationBranchId: outData.destinationBranchId,
                notes: outData.notes,
                createdBy: outData.createdBy
            });

            return result && result.length > 0 ? result[0] : null;
        } catch (error) {
            logger.error(`Error al registrar salida de inventario: ${error.message}`);
            throw error;
        }
    }

    /**
     * Registra una asignación de activo (para notebooks y celulares)
     * @param {Object} assignmentData - Datos de la asignación
     * @returns {Promise<Object>} - Resultado de la operación
     */
    static async registerAssetAssignment(assignmentData) {
        try {
            const result = await this.executeProcedure('sp_RegisterAssetAssignment', {
                assetDetailId: assignmentData.assetDetailId,
                assignedUserId: assignmentData.assignedUserId,
                notes: assignmentData.notes,
                encryptionPass: assignmentData.encryptionPass,
                createdBy: assignmentData.createdBy
            });

            return result && result.length > 0 ? result[0] : null;
        } catch (error) {
            logger.error(`Error al registrar asignación de activo: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtiene todos los movimientos de inventario
     * @returns {Promise<Array>} - Lista de movimientos
     */
    static async getAllMovements() {
        try {
            return await this.executeProcedure('sp_GetInventoryMovements');
        } catch (error) {
            logger.error(`Error al obtener movimientos de inventario: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtiene movimientos por tipo
     * @param {string} type - Tipo de movimiento ('entry', 'exit', 'assignment')
     * @returns {Promise<Array>} - Lista de movimientos
     */
    static async getMovementsByType(type) {
        try {
            return await this.executeProcedure('sp_GetMovementsByType', { type });
        } catch (error) {
            logger.error(`Error al obtener movimientos por tipo: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtiene movimientos por producto
     * @param {number} productId - ID del producto
     * @returns {Promise<Array>} - Lista de movimientos
     */
    static async getMovementsByProduct(productId) {
        try {
            return await this.executeProcedure('sp_GetMovementsByProduct', { productId });
        } catch (error) {
            logger.error(`Error al obtener movimientos por producto: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtiene movimientos por activo
     * @param {number} assetDetailId - ID del detalle de activo
     * @returns {Promise<Array>} - Lista de movimientos
     */
    static async getMovementsByAsset(assetDetailId) {
        try {
            return await this.executeProcedure('sp_GetMovementsByAsset', { assetDetailId });
        } catch (error) {
            logger.error(`Error al obtener movimientos por activo: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtiene movimientos por usuario asignado
     * @param {number} userId - ID del usuario
     * @returns {Promise<Array>} - Lista de movimientos
     */
    static async getMovementsByAssignedUser(userId) {
        try {
            return await this.executeProcedure('sp_GetMovementsByAssignedUser', { userId });
        } catch (error) {
            logger.error(`Error al obtener movimientos por usuario: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtiene activos asignados a un usuario
     * @param {number} userId - ID del usuario
     * @returns {Promise<Array>} - Lista de activos asignados
     */
    static async getAssignedAssetsByUser(userId) {
        try {
            return await this.executeProcedure('sp_GetAssignedAssetsByUser', { userId });
        } catch (error) {
            logger.error(`Error al obtener activos asignados: ${error.message}`);
            throw error;
        }
    }
}

module.exports = Inventory;
