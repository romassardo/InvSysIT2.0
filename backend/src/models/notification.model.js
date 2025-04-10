// Modelo para gestionar notificaciones
const BaseModel = require('./base.model');
const logger = require('../utils/logger');

class Notification extends BaseModel {
    /**
     * Obtiene notificaciones no leídas para un usuario
     * @param {number} userId - ID del usuario
     * @returns {Promise<Array>} - Lista de notificaciones no leídas
     */
    static async getUnreadByUser(userId) {
        try {
            return await this.executeProcedure('sp_GetUnreadNotificationsByUser', { userId });
        } catch (error) {
            logger.error(`Error al obtener notificaciones no leídas: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtiene todas las notificaciones para un usuario
     * @param {number} userId - ID del usuario
     * @returns {Promise<Array>} - Lista de todas las notificaciones
     */
    static async getAllByUser(userId) {
        try {
            return await this.executeProcedure('sp_GetAllNotificationsByUser', { userId });
        } catch (error) {
            logger.error(`Error al obtener todas las notificaciones: ${error.message}`);
            throw error;
        }
    }

    /**
     * Marca una notificación como leída
     * @param {number} notificationId - ID de la notificación
     * @returns {Promise<boolean>} - Resultado de la operación
     */
    static async markAsRead(notificationId) {
        try {
            const result = await this.executeProcedure('sp_MarkNotificationAsRead', { notificationId });
            return result && result.length > 0 && result[0].rowsAffected > 0;
        } catch (error) {
            logger.error(`Error al marcar notificación como leída: ${error.message}`);
            throw error;
        }
    }

    /**
     * Marca todas las notificaciones de un usuario como leídas
     * @param {number} userId - ID del usuario
     * @returns {Promise<boolean>} - Resultado de la operación
     */
    static async markAllAsRead(userId) {
        try {
            const result = await this.executeProcedure('sp_MarkAllNotificationsAsRead', { userId });
            return result && result.length > 0 && result[0].rowsAffected > 0;
        } catch (error) {
            logger.error(`Error al marcar todas las notificaciones como leídas: ${error.message}`);
            throw error;
        }
    }

    /**
     * Crea una nueva notificación
     * @param {Object} notificationData - Datos de la notificación
     * @returns {Promise<Object>} - Notificación creada
     */
    static async create(notificationData) {
        try {
            const result = await this.executeProcedure('sp_CreateNotification', {
                userId: notificationData.userId,
                message: notificationData.message,
                type: notificationData.type,
                relatedItemId: notificationData.relatedItemId,
                relatedItemType: notificationData.relatedItemType
            });

            return result && result.length > 0 ? result[0] : null;
        } catch (error) {
            logger.error(`Error al crear notificación: ${error.message}`);
            throw error;
        }
    }

    /**
     * Elimina notificaciones antiguas y leídas
     * @param {number} daysToKeep - Días a mantener las notificaciones
     * @returns {Promise<Object>} - Resultado de la operación
     */
    static async cleanupOld(daysToKeep = 30) {
        try {
            return await this.executeProcedure('sp_CleanupOldNotifications', { daysToKeep });
        } catch (error) {
            logger.error(`Error al limpiar notificaciones antiguas: ${error.message}`);
            throw error;
        }
    }

    /**
     * Cuenta notificaciones no leídas para un usuario
     * @param {number} userId - ID del usuario
     * @returns {Promise<number>} - Cantidad de notificaciones no leídas
     */
    static async countUnread(userId) {
        try {
            const result = await this.executeProcedure('sp_CountUnreadNotifications', { userId });
            return result && result.length > 0 ? result[0].unreadCount : 0;
        } catch (error) {
            logger.error(`Error al contar notificaciones no leídas: ${error.message}`);
            throw error;
        }
    }
}

module.exports = Notification;
