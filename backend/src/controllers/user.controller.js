// Controlador para la gestión de usuarios
const User = require('../models/user.model');
const logger = require('../utils/logger');

/**
 * Controlador para manejar operaciones CRUD de usuarios
 */
class UserController {
    /**
     * Obtener todos los usuarios
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getAll(req, res) {
        try {
            const users = await User.getAll();
            
            return res.json({
                status: 'success',
                data: users
            });
        } catch (error) {
            logger.error(`Error al obtener usuarios: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener usuarios',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Obtener un usuario por ID
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const user = await User.getById(id);
            
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuario no encontrado'
                });
            }
            
            return res.json({
                status: 'success',
                data: user
            });
        } catch (error) {
            logger.error(`Error al obtener usuario: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener usuario',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Crear un nuevo usuario
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async create(req, res) {
        try {
            const { name, email, password, role, departmentId } = req.body;
            
            // Validar datos obligatorios
            if (!name || !email || !password) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Por favor proporcione nombre, email y contraseña'
                });
            }
            
            // Crear usuario
            const newUser = await User.create({
                name,
                email,
                password,
                role: role || 'user',
                departmentId
            });
            
            return res.status(201).json({
                status: 'success',
                message: 'Usuario creado exitosamente',
                data: newUser
            });
        } catch (error) {
            logger.error(`Error al crear usuario: ${error.message}`);
            
            // Manejo específico para errores conocidos
            if (error.message.includes('ya está registrado')) {
                return res.status(400).json({
                    status: 'error',
                    message: 'El email ya está registrado'
                });
            }
            
            return res.status(500).json({
                status: 'error',
                message: 'Error al crear usuario',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Actualizar un usuario existente
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { name, email, role, departmentId, active } = req.body;
            
            // Validar que el usuario exista
            const existingUser = await User.getById(id);
            if (!existingUser) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuario no encontrado'
                });
            }
            
            // Actualizar usuario
            const updatedUser = await User.update(id, {
                name,
                email,
                role,
                departmentId,
                active: active !== undefined ? active : existingUser.active
            });
            
            return res.json({
                status: 'success',
                message: 'Usuario actualizado exitosamente',
                data: updatedUser
            });
        } catch (error) {
            logger.error(`Error al actualizar usuario: ${error.message}`);
            
            // Manejo específico para errores conocidos
            if (error.message.includes('ya está registrado')) {
                return res.status(400).json({
                    status: 'error',
                    message: 'El email ya está registrado para otro usuario'
                });
            }
            
            return res.status(500).json({
                status: 'error',
                message: 'Error al actualizar usuario',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Desactivar un usuario (borrado lógico)
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async deactivate(req, res) {
        try {
            const { id } = req.params;
            
            // Verificar que no se está desactivando al propio usuario
            if (parseInt(id) === req.user.id) {
                return res.status(400).json({
                    status: 'error',
                    message: 'No puede desactivar su propio usuario'
                });
            }
            
            // Validar que el usuario exista
            const existingUser = await User.getById(id);
            if (!existingUser) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuario no encontrado'
                });
            }
            
            // Desactivar usuario
            const deactivated = await User.deactivate(id);
            
            if (deactivated) {
                return res.json({
                    status: 'success',
                    message: 'Usuario desactivado exitosamente'
                });
            } else {
                return res.status(400).json({
                    status: 'error',
                    message: 'No se pudo desactivar el usuario'
                });
            }
        } catch (error) {
            logger.error(`Error al desactivar usuario: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al desactivar usuario',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Obtener perfil del usuario actual
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getProfile(req, res) {
        try {
            const userId = req.user.id;
            const user = await User.getById(userId);
            
            if (!user) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Usuario no encontrado'
                });
            }
            
            return res.json({
                status: 'success',
                data: user
            });
        } catch (error) {
            logger.error(`Error al obtener perfil: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener perfil',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Actualizar perfil del usuario actual
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async updateProfile(req, res) {
        try {
            const userId = req.user.id;
            const { name, email } = req.body;
            
            // Validar datos obligatorios
            if (!name || !email) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Por favor proporcione nombre y email'
                });
            }
            
            // Obtener datos actuales del usuario
            const existingUser = await User.getById(userId);
            
            // Actualizar usuario (preservando rol y departamento)
            const updatedUser = await User.update(userId, {
                name,
                email,
                role: existingUser.role,
                departmentId: existingUser.departmentId,
                active: existingUser.active
            });
            
            return res.json({
                status: 'success',
                message: 'Perfil actualizado exitosamente',
                data: updatedUser
            });
        } catch (error) {
            logger.error(`Error al actualizar perfil: ${error.message}`);
            
            // Manejo específico para errores conocidos
            if (error.message.includes('ya está registrado')) {
                return res.status(400).json({
                    status: 'error',
                    message: 'El email ya está registrado para otro usuario'
                });
            }
            
            return res.status(500).json({
                status: 'error',
                message: 'Error al actualizar perfil',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }
}

module.exports = UserController;
