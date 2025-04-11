// Middleware para verificar umbrales de stock y crear alertas
const Product = require('../models/product.model');
const Notification = require('../models/notification.model');
const logger = require('../utils/logger');

/**
 * Middleware para verificar umbrales de stock después de operaciones de salida de inventario
 * y crear notificaciones para administradores cuando sea necesario
 */
const checkStockThresholds = async (req, res, next) => {
    try {
        // Solo verificar después de operaciones exitosas de inventario
        const originalSend = res.send;

        res.send = function(body) {
            // Restaurar el método original
            res.send = originalSend;
            
            // Continuar solo si la operación fue exitosa y modificó stock
            const data = typeof body === 'string' ? JSON.parse(body) : body;
            
            if (data.status === 'success' && 
                (req.path.includes('/inventory/out') || req.path.includes('/inventory/assign'))) {
                
                // Extraer el ID del producto de la respuesta o del request
                const productId = data.data?.productId || req.body.productId;
                
                if (productId) {
                    // Verificar de forma asíncrona sin bloquear la respuesta
                    checkAndNotifyIfBelowThreshold(productId)
                        .catch(err => logger.error(`Error al verificar umbral de stock: ${err.message}`));
                }
            }
            
            // Continuar con la respuesta original
            return originalSend.call(this, body);
        };
        
        next();
    } catch (error) {
        logger.error(`Error en middleware de verificación de stock: ${error.message}`);
        next();
    }
};

/**
 * Función auxiliar para verificar si un producto está por debajo del umbral
 * y notificar a los administradores
 * @param {number} productId - ID del producto a verificar
 */
const checkAndNotifyIfBelowThreshold = async (productId) => {
    try {
        // Obtener información actualizada del producto
        const product = await Product.getById(productId);
        
        // Si el producto es un consumible y tiene umbral definido
        if (product && product.type === 'consumable' && product.minStockThreshold !== null) {
            // Verificar si está por debajo del umbral
            if (product.currentStock <= product.minStockThreshold) {
                // Crear notificación para administradores
                await Notification.create({
                    title: 'Alerta de Stock Bajo',
                    message: `El producto "${product.name} ${product.model}" ha alcanzado el nivel mínimo de stock. Stock actual: ${product.currentStock}, Umbral: ${product.minStockThreshold}`,
                    type: 'warning',
                    forAllAdmins: true
                });
                
                logger.info(`Notificación creada para stock bajo de ${product.name} ${product.model}`);
            }
        }
    } catch (error) {
        logger.error(`Error al verificar umbral de stock para producto ${productId}: ${error.message}`);
        throw error;
    }
};

module.exports = {
    checkStockThresholds
};
