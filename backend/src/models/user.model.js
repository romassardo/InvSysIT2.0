// Modelo para gestionar usuarios
const BaseModel = require('./base.model');
const bcrypt = require('bcryptjs');
const logger = require('../utils/logger');

class User extends BaseModel {
    /**
     * Obtiene un usuario por su ID
     * @param {number} userId - ID del usuario
     * @returns {Promise<Object>} - Datos del usuario
     */
    static async getById(userId) {
        try {
            return await this.executeProcedure('sp_GetUserById', { userId });
        } catch (error) {
            logger.error(`Error al obtener usuario por ID: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtiene un usuario por su email
     * @param {string} email - Email del usuario
     * @returns {Promise<Object>} - Datos del usuario incluyendo la contraseña (para autenticación)
     */
    static async getByEmail(email) {
        try {
            const users = await this.executeProcedure('sp_GetUserByEmail', { email });
            return users && users.length > 0 ? users[0] : null;
        } catch (error) {
            logger.error(`Error al obtener usuario por email: ${error.message}`);
            throw error;
        }
    }

    /**
     * Obtiene todos los usuarios
     * @returns {Promise<Array>} - Lista de usuarios
     */
    static async getAll() {
        try {
            return await this.executeProcedure('sp_GetAllUsers');
        } catch (error) {
            logger.error(`Error al obtener todos los usuarios: ${error.message}`);
            throw error;
        }
    }

    /**
     * Crea un nuevo usuario
     * @param {Object} userData - Datos del usuario
     * @returns {Promise<Object>} - Usuario creado
     */
    static async create(userData) {
        try {
            // Encriptar contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(userData.password, salt);

            const result = await this.executeProcedure('sp_CreateUser', {
                name: userData.name,
                email: userData.email,
                password: hashedPassword,
                role: userData.role || 'user',
                departmentId: userData.departmentId
            });

            if (result && result.length > 0 && result[0].id) {
                return await this.getById(result[0].id);
            }

            throw new Error('No se pudo crear el usuario');
        } catch (error) {
            logger.error(`Error al crear usuario: ${error.message}`);
            throw error;
        }
    }

    /**
     * Actualiza un usuario existente
     * @param {number} userId - ID del usuario
     * @param {Object} userData - Datos a actualizar
     * @returns {Promise<Object>} - Usuario actualizado
     */
    static async update(userId, userData) {
        try {
            await this.executeProcedure('sp_UpdateUser', {
                userId,
                name: userData.name,
                email: userData.email,
                role: userData.role,
                departmentId: userData.departmentId,
                active: userData.active
            });

            return await this.getById(userId);
        } catch (error) {
            logger.error(`Error al actualizar usuario: ${error.message}`);
            throw error;
        }
    }

    /**
     * Cambia la contraseña de un usuario
     * @param {number} userId - ID del usuario
     * @param {string} newPassword - Nueva contraseña
     * @returns {Promise<boolean>} - Resultado de la operación
     */
    static async changePassword(userId, newPassword) {
        try {
            // Encriptar nueva contraseña
            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(newPassword, salt);

            const result = await this.executeProcedure('sp_ChangePassword', {
                userId,
                newPassword: hashedPassword
            });

            return result && result.length > 0 && result[0].rowsAffected > 0;
        } catch (error) {
            logger.error(`Error al cambiar contraseña: ${error.message}`);
            throw error;
        }
    }

    /**
     * Desactiva un usuario (eliminación lógica)
     * @param {number} userId - ID del usuario
     * @returns {Promise<boolean>} - Resultado de la operación
     */
    static async deactivate(userId) {
        try {
            const result = await this.executeProcedure('sp_DeactivateUser', { userId });
            return result && result.length > 0 && result[0].rowsAffected > 0;
        } catch (error) {
            logger.error(`Error al desactivar usuario: ${error.message}`);
            throw error;
        }
    }

    /**
     * Verifica si una contraseña coincide con la del usuario
     * @param {string} plainPassword - Contraseña en texto plano
     * @param {string} hashedPassword - Contraseña encriptada
     * @returns {Promise<boolean>} - Resultado de la verificación
     */
    static async verifyPassword(plainPassword, hashedPassword) {
        try {
            return await bcrypt.compare(plainPassword, hashedPassword);
        } catch (error) {
            logger.error(`Error al verificar contraseña: ${error.message}`);
            throw error;
        }
    }
}

module.exports = User;
