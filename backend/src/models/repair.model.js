// Modelo para la gestión de reparaciones
const BaseModel = require('./base.model');
const sql = require('mssql');
const logger = require('../utils/logger');

/**
 * Clase para manejar las operaciones relacionadas con reparaciones de activos
 */
class Repair extends BaseModel {
    /**
     * Registrar un envío a reparación
     * @param {Object} data - Datos de la reparación
     * @returns {Promise<Object>} - Resultado de la operación
     */
    static async sendToRepair(data) {
        try {
            return await this.executeProcedure('sp_RegisterRepairSend', {
                assetDetailId: data.assetDetailId,
                repairProvider: data.repairProvider,
                issueDescription: data.issueDescription,
                sentDate: data.sentDate || new Date(),
                sentBy: data.sentBy
            });
        } catch (error) {
            logger.error(`Error al registrar envío a reparación: ${error.message}`);
            throw error;
        }
    }

    /**
     * Registrar el retorno de un activo de reparación
     * @param {Object} data - Datos del retorno
     * @returns {Promise<Object>} - Resultado de la operación
     */
    static async registerReturn(data) {
        try {
            return await this.executeProcedure('sp_RegisterRepairReturn', {
                repairId: data.repairId,
                returnDate: data.returnDate || new Date(),
                wasRepaired: data.wasRepaired,
                repairDescription: data.repairDescription,
                disposalReason: data.disposalReason,
                registeredBy: data.registeredBy
            });
        } catch (error) {
            logger.error(`Error al registrar retorno de reparación: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtener todas las reparaciones
     * @returns {Promise<Array>} - Lista de reparaciones
     */
    static async getAll() {
        try {
            return await this.executeProcedure('sp_GetAllRepairs');
        } catch (error) {
            logger.error(`Error al obtener reparaciones: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtener reparaciones por estado
     * @param {string} status - Estado de la reparación (pending, completed, disposed)
     * @returns {Promise<Array>} - Lista de reparaciones filtradas por estado
     */
    static async getByStatus(status) {
        try {
            return await this.executeProcedure('sp_GetRepairsByStatus', {
                status
            });
        } catch (error) {
            logger.error(`Error al obtener reparaciones por estado: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtener historial de reparaciones de un activo
     * @param {number} assetDetailId - ID del detalle de activo
     * @returns {Promise<Array>} - Historial de reparaciones
     */
    static async getHistoryByAsset(assetDetailId) {
        try {
            return await this.executeProcedure('sp_GetRepairHistoryByAsset', {
                assetDetailId
            });
        } catch (error) {
            logger.error(`Error al obtener historial de reparaciones: ${error.message}`);
            throw error;
        }
    }
}

module.exports = Repair;
