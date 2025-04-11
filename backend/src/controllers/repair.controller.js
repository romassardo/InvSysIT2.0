// Controlador para la gestión de reparaciones
const Repair = require('../models/repair.model');
const logger = require('../utils/logger');

/**
 * Controlador para manejar operaciones relacionadas con reparaciones
 */
class RepairController {
    /**
     * Registrar un envío a reparación
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async sendToRepair(req, res) {
        try {
            const { assetDetailId, repairProvider, issueDescription, sentDate } = req.body;
            
            // Validar datos obligatorios
            if (!assetDetailId || !repairProvider || !issueDescription) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Por favor proporcione activo, proveedor y descripción del problema'
                });
            }
            
            // Registrar envío
            const result = await Repair.sendToRepair({
                assetDetailId,
                repairProvider,
                issueDescription,
                sentDate,
                sentBy: req.user.id
            });
            
            return res.status(201).json({
                status: 'success',
                message: 'Envío a reparación registrado exitosamente',
                data: result
            });
        } catch (error) {
            logger.error(`Error al registrar envío a reparación: ${error.message}`);
            
            // Manejo específico para errores conocidos
            if (error.message.includes('activo no existe')) {
                return res.status(400).json({
                    status: 'error',
                    message: 'El activo no existe'
                });
            } else if (error.message.includes('no está disponible')) {
                return res.status(400).json({
                    status: 'error',
                    message: 'El activo no está disponible para enviar a reparación'
                });
            }
            
            return res.status(500).json({
                status: 'error',
                message: 'Error al registrar envío a reparación',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Registrar el retorno de un activo de reparación
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async registerReturn(req, res) {
        try {
            const { 
                repairId, returnDate, wasRepaired, 
                repairDescription, disposalReason 
            } = req.body;
            
            // Validar datos obligatorios
            if (!repairId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Por favor proporcione el ID de la reparación'
                });
            }
            
            // Validar campos condicionales según el estado
            if (wasRepaired && !repairDescription) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Para activos reparados, proporcione una descripción de la reparación'
                });
            }
            
            if (!wasRepaired && !disposalReason) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Para activos no reparados, proporcione el motivo de la baja'
                });
            }
            
            // Registrar retorno
            const result = await Repair.registerReturn({
                repairId,
                returnDate,
                wasRepaired,
                repairDescription,
                disposalReason,
                registeredBy: req.user.id
            });
            
            return res.status(200).json({
                status: 'success',
                message: wasRepaired 
                    ? 'Retorno de reparación registrado exitosamente' 
                    : 'Activo dado de baja exitosamente',
                data: result
            });
        } catch (error) {
            logger.error(`Error al registrar retorno de reparación: ${error.message}`);
            
            // Manejo específico para errores conocidos
            if (error.message.includes('reparación no existe')) {
                return res.status(400).json({
                    status: 'error',
                    message: 'La reparación especificada no existe'
                });
            } else if (error.message.includes('ya retornada')) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Esta reparación ya ha sido retornada'
                });
            }
            
            return res.status(500).json({
                status: 'error',
                message: 'Error al registrar retorno de reparación',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Obtener todas las reparaciones
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getAll(req, res) {
        try {
            const repairs = await Repair.getAll();
            
            return res.json({
                status: 'success',
                data: repairs
            });
        } catch (error) {
            logger.error(`Error al obtener reparaciones: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener reparaciones',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Obtener reparaciones por estado
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getByStatus(req, res) {
        try {
            const { status } = req.params;
            
            // Validar que el estado sea válido
            const validStatuses = ['pending', 'completed', 'disposed'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    status: 'error',
                    message: `Estado inválido. Debe ser uno de: ${validStatuses.join(', ')}`
                });
            }
            
            const repairs = await Repair.getByStatus(status);
            
            return res.json({
                status: 'success',
                data: repairs
            });
        } catch (error) {
            logger.error(`Error al obtener reparaciones por estado: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener reparaciones por estado',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Obtener historial de reparaciones de un activo
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getHistoryByAsset(req, res) {
        try {
            const { assetDetailId } = req.params;
            const history = await Repair.getHistoryByAsset(assetDetailId);
            
            return res.json({
                status: 'success',
                data: history
            });
        } catch (error) {
            logger.error(`Error al obtener historial de reparaciones: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener historial de reparaciones',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }
}

module.exports = RepairController;
