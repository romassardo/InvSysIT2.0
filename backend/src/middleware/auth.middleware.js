// Middleware para verificar autenticación y autorización
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');

/**
 * Middleware para verificar que el usuario esté autenticado mediante JWT
 */
const authenticate = (req, res, next) => {
    try {
        // Obtener token de los headers
        const bearerHeader = req.headers.authorization;
        
        if (!bearerHeader) {
            return res.status(401).json({
                status: 'error',
                message: 'Acceso denegado, token no proporcionado'
            });
        }
        
        // Verificar el formato del token (Bearer [token])
        const bearer = bearerHeader.split(' ');
        if (bearer.length !== 2 || bearer[0] !== 'Bearer') {
            return res.status(401).json({
                status: 'error',
                message: 'Formato de token inválido'
            });
        }
        
        const token = bearer[1];
        
        // Verificar y decodificar el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        
        // Añadir el usuario decodificado a la request
        req.user = decoded;
        
        // Continuar con la siguiente función
        next();
    } catch (error) {
        logger.error(`Error al verificar token: ${error.message}`);
        
        if (error.name === 'TokenExpiredError') {
            return res.status(401).json({
                status: 'error',
                message: 'Sesión expirada, por favor inicie sesión nuevamente'
            });
        }
        
        return res.status(401).json({
            status: 'error',
            message: 'Token inválido, por favor inicie sesión nuevamente'
        });
    }
};

/**
 * Middleware para verificar que el usuario tenga rol de administrador
 */
const isAdmin = (req, res, next) => {
    try {
        // Verificar que el middleware authenticate se haya ejecutado antes
        if (!req.user) {
            return res.status(401).json({
                status: 'error',
                message: 'No autenticado'
            });
        }
        
        // Verificar rol de administrador
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                status: 'error',
                message: 'Acceso denegado, se requieren permisos de administrador'
            });
        }
        
        // Continuar con la siguiente función
        next();
    } catch (error) {
        logger.error(`Error al verificar permisos: ${error.message}`);
        return res.status(500).json({
            status: 'error',
            message: 'Error al verificar permisos',
            error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
        });
    }
};

module.exports = {
    authenticate,
    isAdmin
};
