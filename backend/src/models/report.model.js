// Modelo para gestionar reportes
const BaseModel = require('./base.model');
const logger = require('../utils/logger');

class Report extends BaseModel {
    /**
     * Genera reporte de inventario actual
     * @param {Object} filters - Filtros para el reporte
     * @returns {Promise<Array>} - Datos del reporte
     */
    static async currentInventory(filters = {}) {
        try {
            return await this.executeProcedure('sp_ReportCurrentInventory', {
                categoryId: filters.categoryId,
                type: filters.type,
                lowStock: filters.lowStock
            });
        } catch (error) {
            logger.error(`Error al generar reporte de inventario actual: ${error.message}`);
            throw error;
        }
    }

    /**
     * Genera reporte de movimientos de inventario
     * @param {Object} filters - Filtros para el reporte
     * @returns {Promise<Array>} - Datos del reporte
     */
    static async inventoryMovements(filters = {}) {
        try {
            return await this.executeProcedure('sp_ReportInventoryMovements', {
                startDate: filters.startDate,
                endDate: filters.endDate,
                movementType: filters.movementType,
                productId: filters.productId,
                departmentId: filters.departmentId,
                branchId: filters.branchId,
                userId: filters.userId
            });
        } catch (error) {
            logger.error(`Error al generar reporte de movimientos: ${error.message}`);
            throw error;
        }
    }

    /**
     * Genera reporte de activos asignados
     * @param {Object} filters - Filtros para el reporte
     * @returns {Promise<Array>} - Datos del reporte
     */
    static async assignedAssets(filters = {}) {
        try {
            return await this.executeProcedure('sp_ReportAssignedAssets', {
                departmentId: filters.departmentId,
                categoryId: filters.categoryId,
                userId: filters.userId
            });
        } catch (error) {
            logger.error(`Error al generar reporte de activos asignados: ${error.message}`);
            throw error;
        }
    }

    /**
     * Genera reporte de activos por categoría
     * @returns {Promise<Array>} - Datos del reporte
     */
    static async assetsByCategory() {
        try {
            return await this.executeProcedure('sp_ReportAssetsByCategory');
        } catch (error) {
            logger.error(`Error al generar reporte de activos por categoría: ${error.message}`);
            throw error;
        }
    }

    /**
     * Genera reporte de activos por estado
     * @returns {Promise<Array>} - Datos del reporte
     */
    static async assetsByStatus() {
        try {
            return await this.executeProcedure('sp_ReportAssetsByStatus');
        } catch (error) {
            logger.error(`Error al generar reporte de activos por estado: ${error.message}`);
            throw error;
        }
    }

    /**
     * Genera reporte de activos por departamento
     * @returns {Promise<Array>} - Datos del reporte
     */
    static async assetsByDepartment() {
        try {
            return await this.executeProcedure('sp_ReportAssetsByDepartment');
        } catch (error) {
            logger.error(`Error al generar reporte de activos por departamento: ${error.message}`);
            throw error;
        }
    }

    /**
     * Genera reporte de consumo por departamento
     * @param {Object} filters - Filtros para el reporte
     * @returns {Promise<Array>} - Datos del reporte
     */
    static async consumptionByDepartment(filters = {}) {
        try {
            return await this.executeProcedure('sp_ReportConsumptionByDepartment', {
                startDate: filters.startDate,
                endDate: filters.endDate
            });
        } catch (error) {
            logger.error(`Error al generar reporte de consumo por departamento: ${error.message}`);
            throw error;
        }
    }

    /**
     * Genera reporte de garantías próximas a vencer
     * @param {number} daysThreshold - Umbral de días para considerar próximas a vencer
     * @returns {Promise<Array>} - Datos del reporte
     */
    static async warrantiesExpiringSoon(daysThreshold = 90) {
        try {
            return await this.executeProcedure('sp_ReportWarrantiesExpiringSoon', { daysThreshold });
        } catch (error) {
            logger.error(`Error al generar reporte de garantías: ${error.message}`);
            throw error;
        }
    }
}

module.exports = Report;
