// Controlador para la generación de reportes
const Report = require('../models/report.model');
const logger = require('../utils/logger');

/**
 * Controlador para manejar la generación de reportes
 */
class ReportController {
    /**
     * Obtener listado de reportes disponibles
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getAvailableReports(req, res) {
        try {
            // Lista de reportes disponibles para el usuario
            const reports = [
                {
                    id: 'current-inventory',
                    name: 'Inventario Actual',
                    description: 'Muestra el estado actual del inventario con filtros por categoría o tipo',
                    requiresAdmin: false
                },
                {
                    id: 'my-assets',
                    name: 'Mis Activos Asignados',
                    description: 'Muestra los activos asignados al usuario actual',
                    requiresAdmin: false
                },
                {
                    id: 'asset-history',
                    name: 'Historial de Activo',
                    description: 'Muestra el historial completo de un activo específico',
                    requiresAdmin: false,
                    requiresAssetId: true
                },
                {
                    id: 'assigned-assets',
                    name: 'Activos Asignados (Todos)',
                    description: 'Muestra todos los activos asignados filtrados por departamento o usuario',
                    requiresAdmin: true
                },
                {
                    id: 'inventory-movements',
                    name: 'Movimientos de Inventario',
                    description: 'Muestra el historial de movimientos con filtros por fecha, tipo o producto',
                    requiresAdmin: true
                },
                {
                    id: 'low-stock',
                    name: 'Consumibles Bajo Stock Mínimo',
                    description: 'Muestra los consumibles que están por debajo del umbral mínimo configurado',
                    requiresAdmin: true
                },
                {
                    id: 'repairs-maintenance',
                    name: 'Reparaciones y Mantenimiento',
                    description: 'Muestra el historial de reparaciones con estado y tiempo de servicio',
                    requiresAdmin: true
                },
                {
                    id: 'custom',
                    name: 'Reporte Personalizado',
                    description: 'Permite crear un reporte personalizado con múltiples filtros y criterios',
                    requiresAdmin: true,
                    isCustom: true
                }
            ];
            
            // Si el usuario no es admin, filtrar reportes que requieren permisos
            const isAdmin = req.user && req.user.role === 'admin';
            const availableReports = isAdmin ? reports : reports.filter(r => !r.requiresAdmin);
            
            return res.json({
                status: 'success',
                data: availableReports
            });
        } catch (error) {
            logger.error(`Error al obtener reportes disponibles: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener reportes disponibles',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }
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
     * Generar reporte de activos asignados al usuario actual
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async myAssignedAssets(req, res) {
        try {
            // Obtener el ID del usuario actual desde el token JWT
            const userId = req.user.id;
            
            // Generar el reporte de activos asignados
            const report = await Report.getAssignedAssetsByUser(userId);
            
            return res.json({
                status: 'success',
                data: report
            });
        } catch (error) {
            logger.error(`Error al generar reporte de activos asignados: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al generar reporte de activos asignados',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Generar reporte de historial de un activo específico
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async assetHistory(req, res) {
        try {
            const assetId = parseInt(req.params.assetId);
            
            if (!assetId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Se requiere un ID de activo válido'
                });
            }
            
            // Generar el reporte de historial del activo
            const report = await Report.getAssetHistory(assetId);
            
            return res.json({
                status: 'success',
                data: report
            });
        } catch (error) {
            logger.error(`Error al generar historial de activo: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al generar historial de activo',
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

    /**
     * Generar reporte de consumibles bajo stock mínimo
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async lowStock(req, res) {
        try {
            const { categoryId } = req.query;
            
            const filters = {
                categoryId: categoryId ? parseInt(categoryId) : null
            };
            
            const report = await Report.lowStock(filters);
            
            return res.json({
                status: 'success',
                data: report
            });
        } catch (error) {
            logger.error(`Error al generar reporte de stock bajo: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al generar reporte de stock bajo',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Generar reporte de reparaciones y mantenimiento
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async repairsAndMaintenance(req, res) {
        try {
            const { status, startDate, endDate, repairProvider } = req.query;
            
            const filters = {
                status: status || null,
                startDate: startDate || null,
                endDate: endDate || null,
                repairProvider: repairProvider || null
            };
            
            const report = await Report.repairsAndMaintenance(filters);
            
            return res.json({
                status: 'success',
                data: report
            });
        } catch (error) {
            logger.error(`Error al generar reporte de reparaciones: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al generar reporte de reparaciones',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Generar reporte personalizado con filtros avanzados
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async customReport(req, res) {
        try {
            const reportConfig = req.body;
            
            if (!reportConfig || !reportConfig.reportType) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Configuración de reporte inválida'
                });
            }
            
            const report = await Report.customReport(reportConfig);
            
            return res.json({
                status: 'success',
                data: report
            });
        } catch (error) {
            logger.error(`Error al generar reporte personalizado: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al generar reporte personalizado',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }
}

module.exports = ReportController;
