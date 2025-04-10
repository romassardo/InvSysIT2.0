// Controlador para la gestión de activos específicos
const Asset = require('../models/asset.model');
const logger = require('../utils/logger');

/**
 * Controlador para manejar operaciones CRUD de activos específicos
 */
class AssetController {
    /**
     * Obtener un activo por ID
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getById(req, res) {
        try {
            const { id } = req.params;
            const asset = await Asset.getById(id);
            
            if (!asset) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Activo no encontrado'
                });
            }
            
            return res.json({
                status: 'success',
                data: asset
            });
        } catch (error) {
            logger.error(`Error al obtener activo: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener activo',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Obtener activos por producto
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getByProductId(req, res) {
        try {
            const { productId } = req.params;
            const assets = await Asset.getByProductId(productId);
            
            return res.json({
                status: 'success',
                data: assets
            });
        } catch (error) {
            logger.error(`Error al obtener activos por producto: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener activos por producto',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Obtener activos disponibles por producto
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getAvailableByProductId(req, res) {
        try {
            const { productId } = req.params;
            const assets = await Asset.getAvailableByProductId(productId);
            
            return res.json({
                status: 'success',
                data: assets
            });
        } catch (error) {
            logger.error(`Error al obtener activos disponibles: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener activos disponibles',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Crear un nuevo activo específico
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async create(req, res) {
        try {
            const { 
                productId, serialNumber, assetTag, purchaseDate,
                warrantyExpiration, notes, encryptionPass
            } = req.body;
            
            // Validar datos obligatorios
            if (!productId) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Por favor proporcione el ID del producto'
                });
            }
            
            // Crear activo
            const newAsset = await Asset.create({
                productId,
                serialNumber,
                assetTag,
                purchaseDate,
                warrantyExpiration,
                notes,
                encryptionPass
            });
            
            return res.status(201).json({
                status: 'success',
                message: 'Activo creado exitosamente',
                data: newAsset
            });
        } catch (error) {
            logger.error(`Error al crear activo: ${error.message}`);
            
            // Manejo específico para errores conocidos
            if (error.message.includes('mismo número de serie')) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Ya existe un activo con el mismo número de serie'
                });
            } else if (error.message.includes('no es un activo')) {
                return res.status(400).json({
                    status: 'error',
                    message: 'El producto seleccionado no es un activo'
                });
            }
            
            return res.status(500).json({
                status: 'error',
                message: 'Error al crear activo',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Actualizar un activo existente
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async update(req, res) {
        try {
            const { id } = req.params;
            const { 
                serialNumber, assetTag, purchaseDate, warrantyExpiration,
                status, notes, encryptionPass
            } = req.body;
            
            // Validar que el activo exista
            const existingAsset = await Asset.getById(id);
            if (!existingAsset) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Activo no encontrado'
                });
            }
            
            // Actualizar activo
            const updatedAsset = await Asset.update(id, {
                serialNumber,
                assetTag,
                purchaseDate,
                warrantyExpiration,
                status: status || existingAsset.status,
                notes,
                encryptionPass
            });
            
            return res.json({
                status: 'success',
                message: 'Activo actualizado exitosamente',
                data: updatedAsset
            });
        } catch (error) {
            logger.error(`Error al actualizar activo: ${error.message}`);
            
            // Manejo específico para errores conocidos
            if (error.message.includes('mismo número de serie')) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Ya existe un activo con el mismo número de serie'
                });
            }
            
            return res.status(500).json({
                status: 'error',
                message: 'Error al actualizar activo',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Actualizar estado de un activo
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async updateStatus(req, res) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            
            // Validar datos obligatorios
            if (!status) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Por favor proporcione el nuevo estado'
                });
            }
            
            // Validar que el estado sea válido
            const validStatuses = ['available', 'assigned', 'maintenance', 'retired'];
            if (!validStatuses.includes(status)) {
                return res.status(400).json({
                    status: 'error',
                    message: `Estado inválido. Debe ser uno de: ${validStatuses.join(', ')}`
                });
            }
            
            // Validar que el activo exista
            const existingAsset = await Asset.getById(id);
            if (!existingAsset) {
                return res.status(404).json({
                    status: 'error',
                    message: 'Activo no encontrado'
                });
            }
            
            // Actualizar estado
            const updated = await Asset.updateStatus(id, status);
            
            if (updated) {
                return res.json({
                    status: 'success',
                    message: 'Estado del activo actualizado exitosamente'
                });
            } else {
                return res.status(400).json({
                    status: 'error',
                    message: 'No se pudo actualizar el estado del activo'
                });
            }
        } catch (error) {
            logger.error(`Error al actualizar estado: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al actualizar estado',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Buscar activos por término
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async search(req, res) {
        try {
            const { term } = req.query;
            
            if (!term) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Por favor proporcione un término de búsqueda'
                });
            }
            
            const assets = await Asset.search(term);
            
            return res.json({
                status: 'success',
                data: assets
            });
        } catch (error) {
            logger.error(`Error al buscar activos: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al buscar activos',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }

    /**
     * Obtener activos disponibles para asignación (notebooks y celulares)
     * @param {Object} req - Request de Express
     * @param {Object} res - Response de Express
     */
    static async getAssignableAssets(req, res) {
        try {
            const assets = await Asset.getAssignableAssets();
            
            return res.json({
                status: 'success',
                data: assets
            });
        } catch (error) {
            logger.error(`Error al obtener activos asignables: ${error.message}`);
            return res.status(500).json({
                status: 'error',
                message: 'Error al obtener activos asignables',
                error: process.env.NODE_ENV === 'development' ? error.message : 'Error interno'
            });
        }
    }
}

module.exports = AssetController;
