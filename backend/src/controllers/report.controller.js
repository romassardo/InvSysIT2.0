// Controlador para la generación de reportes
const Report = require('../models/report.model');
const logger = require('../utils/logger');

/**
 * Controlador para manejar la generación de reportes
 */
class ReportController {
    /**
     * Generar reporte de inventario actual
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async currentInventory(req, res) {
        try {
            const { categoryId, type, lowStock } = req.query;
            
            const filters = {
                categoryId: categoryId ? parseInt(categoryId) : null,
                type: type || null,
                lowStock: lowStock === 'true' ? 1 : (lowStock === 'false' ? 0 : null)
            };
            
            const report = await Report.currentInventory(filters);
            
            return res.json({
                status: 'success',
                data: report
            });
        } catch (error) {
            logger.error(`Error al generar reporte de inventario: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al generar reporte',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Generar reporte de movimientos de inventario
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async inventoryMovements(req, res) {
        try {
            const { 
                startDate, endDate, movementType, 
                productId, departmentId, branchId, userId 
            } = req.query;
            
            const filters = {
                startDate: startDate || null,
                endDate: endDate || null,
                movementType: movementType || null,
                productId: productId ? parseInt(productId) : null,
                departmentId: departmentId ? parseInt(departmentId) : null,
                branchId: branchId ? parseInt(branchId) : null,
                userId: userId ? parseInt(userId) : null
            };
            
            const report = await Report.inventoryMovements(filters);
            
            return res.json({
                status: 'success',
                data: report
            });
        } catch (error) {
            logger.error(`Error al generar reporte de movimientos: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al generar reporte',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Generar reporte de activos asignados
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async assignedAssets(req, res) {
        try {
            const { departmentId, categoryId, userId } = req.query;
            
            const filters = {
                departmentId: departmentId ? parseInt(departmentId) : null,
                categoryId: categoryId ? parseInt(categoryId) : null,
                userId: userId ? parseInt(userId) : null
            };
            
            const report = await Report.assignedAssets(filters);
            
            return res.json({
                status: 'success',
                data: report
            });
        } catch (error) {
            logger.error(`Error al generar reporte de activos asignados: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al generar reporte',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Generar reporte de activos por categoría
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async assetsByCategory(req, res) {
        try {
            const report = await Report.assetsByCategory();
            
            return res.json({
                status: 'success',
                data: report
            });
        } catch (error) {
            logger.error(`Error al generar reporte de activos por categoría: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al generar reporte',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Generar reporte de activos por estado
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async assetsByStatus(req, res) {
        try {
            const report = await Report.assetsByStatus();
            
            return res.json({
                status: 'success',
                data: report
            });
        } catch (error) {
            logger.error(`Error al generar reporte de activos por estado: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al generar reporte',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Generar reporte de activos por departamento
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async assetsByDepartment(req, res) {
        try {
            const report = await Report.assetsByDepartment();
            
            return res.json({
                status: 'success',
                data: report
            });
        } catch (error) {
            logger.error(`Error al generar reporte de activos por departamento: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al generar reporte',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Generar reporte de consumo por departamento
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async consumptionByDepartment(req, res) {
        try {
            const { startDate, endDate } = req.query;
            
            const filters = {
                startDate: startDate || null,
                endDate: endDate || null
            };
            
            const report = await Report.consumptionByDepartment(filters);
            
            return res.json({
                status: 'success',
                data: report
            });
        } catch (error) {
            logger.error(`Error al generar reporte de consumo por departamento: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al generar reporte',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Generar reporte de garantías próximas a vencer
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async warrantiesExpiringSoon(req, res) {
        try {
            const { daysThreshold } = req.query;
            
            const threshold = daysThreshold ? parseInt(daysThreshold) : 90;
            
            const report = await Report.warrantiesExpiringSoon(threshold);
            
            return res.json({
                status: 'success',
                data: report
            });
        } catch (error) {
            logger.error(`Error al generar reporte de garantías: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al generar reporte',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }
}

module.exports = ReportController;
