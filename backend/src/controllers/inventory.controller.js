// Controlador para la gestión de movimientos de inventario
const Inventory = require('../models/inventory.model');
const logger = require('../utils/logger');

/**
 * Controlador para manejar movimientos de inventario (entradas, salidas y asignaciones)
 */
class InventoryController {
    /**
     * Registrar entrada de inventario
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async registerEntry(req, res) {
        try {
            const { productId, quantity, sourceId, notes } = req.body;
            
            // Validar datos obligatorios
            if (!productId || !quantity) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Por favor proporcione producto y cantidad'
                });
            }
            
            // Validar que la cantidad sea positiva
            if (quantity <= 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'La cantidad debe ser mayor a cero'
                });
            }
            
            // Registrar entrada
            const result = await Inventory.registerEntry({
                productId,
                quantity,
                sourceId,
                notes,
                createdBy: req.user.id
            });
            
            return res.status(201).json({
                status: 'success',
                message: 'Entrada de inventario registrada exitosamente',
                data: result
            });
        } catch (error) {
            logger.error(`Error al registrar entrada: ${error.message}`);
            
            // Manejo específico para errores conocidos
            if (error.message.includes('producto no existe')) {
                return res.status(400).json({
                    status: 'error',
                    message: 'El producto no existe'
                });
            }
            
            return res.status(500).json({
                status: 'error',
                message: 'Error al registrar entrada',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Registrar salida de inventario (para todos los ítems excepto notebooks y celulares)
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async registerOut(req, res) {
        try {
            const { 
                productId, quantity, destinationDepartmentId, 
                destinationBranchId, notes 
            } = req.body;
            
            // Validar datos obligatorios
            if (!productId || !quantity) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Por favor proporcione producto y cantidad'
                });
            }
            
            // Validar que la cantidad sea positiva
            if (quantity <= 0) {
                return res.status(400).json({
                    status: 'error',
                    message: 'La cantidad debe ser mayor a cero'
                });
            }
            
            // Validar que se especifique un destino
            if (!destinationDepartmentId && !destinationBranchId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Por favor especifique un departamento o sucursal de destino'
                });
            }
            
            // Registrar salida
            const result = await Inventory.registerOut({
                productId,
                quantity,
                destinationDepartmentId,
                destinationBranchId,
                notes,
                createdBy: req.user.id
            });
            
            return res.status(201).json({
                status: 'success',
                message: 'Salida de inventario registrada exitosamente',
                data: result
            });
        } catch (error) {
            logger.error(`Error al registrar salida: ${error.message}`);
            
            // Manejo específico para errores conocidos
            if (error.message.includes('producto no existe')) {
                return res.status(400).json({
                    status: 'error',
                    message: 'El producto no existe'
                });
            } else if (error.message.includes('stock suficiente')) {
                return res.status(400).json({
                    status: 'error',
                    message: 'No hay suficiente stock disponible'
                });
            } else if (error.message.includes('especificar un destino')) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Debe especificar un departamento o sucursal de destino'
                });
            }
            
            return res.status(500).json({
                status: 'error',
                message: 'Error al registrar salida',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Registrar asignación de activo (para notebooks y celulares)
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async registerAssetAssignment(req, res) {
        try {
            const { assetDetailId, assignedUserId, notes, encryptionPass } = req.body;
            
            // Validar datos obligatorios
            if (!assetDetailId || !assignedUserId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Por favor proporcione activo y usuario asignado'
                });
            }
            
            // Registrar asignación
            const result = await Inventory.registerAssetAssignment({
                assetDetailId,
                assignedUserId,
                notes,
                encryptionPass,
                createdBy: req.user.id
            });
            
            return res.status(201).json({
                status: 'success',
                message: 'Asignación de activo registrada exitosamente',
                data: result
            });
        } catch (error) {
            logger.error(`Error al registrar asignación: ${error.message}`);
            
            // Manejo específico para errores conocidos
            if (error.message.includes('activo no existe')) {
                return res.status(400).json({
                    status: 'error',
                    message: 'El activo no existe'
                });
            } else if (error.message.includes('no está disponible')) {
                return res.status(400).json({
                    status: 'error',
                    message: 'El activo no está disponible para asignación'
                });
            } else if (error.message.includes('usuario asignado no existe')) {
                return res.status(400).json({
                    status: 'error',
                    message: 'El usuario asignado no existe'
                });
            }
            
            return res.status(500).json({
                status: 'error',
                message: 'Error al registrar asignación',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Obtener todos los movimientos de inventario
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getAllMovements(req, res) {
        try {
            const movements = await Inventory.getAllMovements();
            
            return res.json({
                status: 'success',
                data: movements
            });
        } catch (error) {
            logger.error(`Error al obtener movimientos: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener movimientos',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Obtener movimientos por tipo
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getMovementsByType(req, res) {
        try {
            const { type } = req.params;
            
            // Validar que el tipo sea válido
            const validTypes = ['entry', 'exit', 'assignment'];
            if (!validTypes.includes(type)) {
                return res.status(400).json({
                    status: 'error',
                    message: `Tipo de movimiento inválido. Debe ser uno de: ${validTypes.join(', ')}`
                });
            }
            
            const movements = await Inventory.getMovementsByType(type);
            
            return res.json({
                status: 'success',
                data: movements
            });
        } catch (error) {
            logger.error(`Error al obtener movimientos por tipo: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener movimientos por tipo',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Obtener movimientos por producto
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getMovementsByProduct(req, res) {
        try {
            const { productId } = req.params;
            const movements = await Inventory.getMovementsByProduct(productId);
            
            return res.json({
                status: 'success',
                data: movements
            });
        } catch (error) {
            logger.error(`Error al obtener movimientos por producto: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener movimientos por producto',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Obtener movimientos por activo
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getMovementsByAsset(req, res) {
        try {
            const { assetDetailId } = req.params;
            const movements = await Inventory.getMovementsByAsset(assetDetailId);
            
            return res.json({
                status: 'success',
                data: movements
            });
        } catch (error) {
            logger.error(`Error al obtener movimientos por activo: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener movimientos por activo',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Obtener movimientos por usuario asignado
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getMovementsByAssignedUser(req, res) {
        try {
            const { userId } = req.params;
            const movements = await Inventory.getMovementsByAssignedUser(userId);
            
            return res.json({
                status: 'success',
                data: movements
            });
        } catch (error) {
            logger.error(`Error al obtener movimientos por usuario: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener movimientos por usuario',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Obtener activos asignados a un usuario
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getAssignedAssetsByUser(req, res) {
        try {
            const { userId } = req.params;
            const assets = await Inventory.getAssignedAssetsByUser(userId);
            
            return res.json({
                status: 'success',
                data: assets
            });
        } catch (error) {
            logger.error(`Error al obtener activos asignados: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener activos asignados',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Obtener activos asignados al usuario actual
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getMyAssignedAssets(req, res) {
        try {
            const userId = req.user.id;
            const assets = await Inventory.getAssignedAssetsByUser(userId);
            
            return res.json({
                status: 'success',
                data: assets
            });
        } catch (error) {
            logger.error(`Error al obtener activos asignados propios: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener activos asignados',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }
}

module.exports = InventoryController;
