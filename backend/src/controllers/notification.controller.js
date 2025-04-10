// Controlador para la gestión de notificaciones
const Notification = require('../models/notification.model');
const logger = require('../utils/logger');

/**
 * Controlador para manejar operaciones de notificaciones
 */
class NotificationController {
    /**
     * Obtener notificaciones no leídas para el usuario actual
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getUnread(req, res) {
        try {
            const userId = req.user.id;
            const notifications = await Notification.getUnreadByUser(userId);
            
            return res.json({
                status: 'success',
                data: notifications
            });
        } catch (error) {
            logger.error(`Error al obtener notificaciones no leídas: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener notificaciones',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Obtener todas las notificaciones para el usuario actual
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getAll(req, res) {
        try {
            const userId = req.user.id;
            const notifications = await Notification.getAllByUser(userId);
            
            return res.json({
                status: 'success',
                data: notifications
            });
        } catch (error) {
            logger.error(`Error al obtener todas las notificaciones: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener notificaciones',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Marcar una notificación como leída
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async markAsRead(req, res) {
        try {
            const { id } = req.params;
            const updated = await Notification.markAsRead(id);
            
            if (updated) {
                return res.json({
                    status: 'success',
                    message: 'Notificación marcada como leída'
                });
            } else {
                return res.status(400).json({
                    status: 'error',
                    message: 'No se pudo marcar la notificación como leída'
                });
            }
        } catch (error) {
            logger.error(`Error al marcar notificación como leída: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al marcar notificación',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Marcar todas las notificaciones del usuario actual como leídas
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async markAllAsRead(req, res) {
        try {
            const userId = req.user.id;
            const updated = await Notification.markAllAsRead(userId);
            
            return res.json({
                status: 'success',
                message: 'Todas las notificaciones marcadas como leídas',
                data: {
                    count: updated && updated.length > 0 ? updated[0].rowsAffected : 0
                }
            });
        } catch (error) {
            logger.error(`Error al marcar todas las notificaciones como leídas: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al marcar notificaciones',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Crear una nueva notificación manualmente
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async create(req, res) {
        try {
            const { userId, message, type, relatedItemId, relatedItemType } = req.body;
            
            // Validar datos obligatorios
            if (!userId || !message || !type) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Por favor proporcione usuario, mensaje y tipo'
                });
            }
            
            // Validar que el tipo sea válido
            const validTypes = ['info', 'warning', 'success'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({
                    status: 'error',
                    message: `Tipo de notificación inválido. Debe ser uno de: ${validTypes.join(', ')}`
                });
            }
            
            // Crear notificación
            const result = await Notification.create({
                userId,
                message,
                type,
                relatedItemId,
                relatedItemType
            });
            
            return res.status(201).json({
                status: 'success',
                message: 'Notificación creada exitosamente',
                data: result
            });
        } catch (error) {
            logger.error(`Error al crear notificación: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al crear notificación',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Eliminar notificaciones antiguas (solo para administradores)
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async cleanup(req, res) {
        try {
            const { daysToKeep } = req.body;
            
            const result = await Notification.cleanupOld(daysToKeep || 30);
            
            return res.json({
                status: 'success',
                message: 'Notificaciones antiguas eliminadas',
                data: {
                    count: result && result.length > 0 ? result[0].rowsAffected : 0
                }
            });
        } catch (error) {
            logger.error(`Error al limpiar notificaciones antiguas: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al limpiar notificaciones',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Obtener conteo de notificaciones no leídas
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async countUnread(req, res) {
        try {
            const userId = req.user.id;
            const count = await Notification.countUnread(userId);
            
            return res.json({
                status: 'success',
                data: {
                    count
                }
            });
        } catch (error) {
            logger.error(`Error al contar notificaciones no leídas: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al contar notificaciones',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }
}

module.exports = NotificationController;
