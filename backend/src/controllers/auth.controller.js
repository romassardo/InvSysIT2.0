// Controlador para la autenticación de usuarios
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');
const logger = require('../utils/logger');

/**
 * Controlador para manejar la autenticación
 */
class AuthController {
    /**
     * Autenticar usuario y generar token JWT
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async login(req, res) {
        try {
            const { email, password } = req.body;

            // Validar que se proporcionen email y password
            if (!email || !password) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Por favor proporcione email y contraseña'
                });
            }

            // Buscar usuario por email
            const user = await User.getByEmail(email);

            // Verificar si el usuario existe
            if (!user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Credenciales inválidas'
                });
            }

            // Verificar si el usuario está activo
            if (!user.active) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Usuario inactivo, contacte al administrador'
                });
            }

            // Verificar contraseña
            const isMatch = await User.verifyPassword(password, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Credenciales inválidas'
                });
            }

            // Generar token JWT
            const token = jwt.sign(
                { 
                    id: user.id,
                    role: user.role,
                    name: user.name,
                    email: user.email
                },
                process.env.JWT_SECRET,
                { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
            );

            // Ocultar contraseña en la respuesta
            const { password: _, ...userWithoutPassword } = user;

            return res.json({
                status: 'success',
                message: 'Login exitoso',
                data: {
                    user: userWithoutPassword,
                    token
                }
            });
        } catch (error) {
            logger.error(`Error en login: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al procesar la solicitud',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Verificar token JWT actual
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async verifyToken(req, res) {
        try {
            // req.user ya fue establecido por el middleware de autenticación
            if (!req.user) {
                return res.status(401).json({
                    status: 'error',
                    message: 'No autenticado'
                });
            }

            // Obtener información actualizada del usuario
            const user = await User.getById(req.user.id);

            if (!user || !user.active) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Usuario no encontrado o inactivo'
                });
            }

            return res.json({
                status: 'success',
                data: {
                    user
                }
            });
        } catch (error) {
            logger.error(`Error en verifyToken: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al procesar la solicitud',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Cambiar contraseña del usuario
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async changePassword(req, res) {
        try {
            const { currentPassword, newPassword } = req.body;
            const userId = req.user.id;

            if (!currentPassword || !newPassword) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Por favor proporcione la contraseña actual y la nueva'
                });
            }

            // Obtener usuario completo con contraseña
            const user = await User.getByEmail(req.user.email);

            // Verificar contraseña actual
            const isMatch = await User.verifyPassword(currentPassword, user.password);
            if (!isMatch) {
                return res.status(401).json({
                    status: 'error',
                    message: 'Contraseña actual incorrecta'
                });
            }

            // Cambiar contraseña
            const updated = await User.changePassword(userId, newPassword);

            if (updated) {
                return res.json({
                    status: 'success',
                    message: 'Contraseña actualizada correctamente'
                });
            } else {
                return res.status(400).json({
                    status: 'error',
                    message: 'No se pudo actualizar la contraseña'
                });
            }
        } catch (error) {
            logger.error(`Error en changePassword: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al procesar la solicitud',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }
}

module.exports = AuthController;
