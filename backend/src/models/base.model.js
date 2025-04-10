// Modelo base que proporciona métodos para ejecutar queries y stored procedures
const sql = require('mssql');
const logger = require('../utils/logger');

/**
 * Clase base para todos los modelos con métodos comunes para interactuar con la base de datos
 */
class BaseModel {
    /**
     * Ejecuta un stored procedure
     * @param {string} procedureName - Nombre del stored procedure
     * @param {Object} params - Objeto con los parámetros para el stored procedure
     * @returns {Promise<Array>} - Resultado del stored procedure
     */
    static async executeProcedure(procedureName, params = {}) {
        try {
            const pool = await sql.connect();
            const request = pool.request();

            // Agregar parámetros
            Object.entries(params).forEach(([key, value]) => {
                request.input(key, value);
            });

            logger.debug(`Ejecutando stored procedure: ${procedureName}`);
            const result = await request.execute(procedureName);
            
            // Si el stored procedure retorna múltiples conjuntos de resultados, devolver todos
            if (result.recordsets.length > 1) {
                return result.recordsets;
            }
            
            // Por defecto, devolver el primer conjunto de resultados
            return result.recordset;
        } catch (error) {
            logger.error(`Error al ejecutar stored procedure ${procedureName}: ${error.message}`);
            throw error;
        }
    }

    /**
     * Ejecuta una consulta SQL directa
     * @param {string} query - Consulta SQL a ejecutar
     * @param {Object} params - Objeto con los parámetros para la consulta
     * @returns {Promise<Array>} - Resultado de la consulta
     */
    static async executeQuery(query, params = {}) {
        try {
            const pool = await sql.connect();
            const request = pool.request();

            // Agregar parámetros
            Object.entries(params).forEach(([key, value]) => {
                request.input(key, value);
            });

            logger.debug(`Ejecutando query: ${query}`);
            const result = await request.query(query);
            
            return result.recordset;
        } catch (error) {
            logger.error(`Error al ejecutar query: ${error.message}`);
            throw error;
        }
    }
}

module.exports = BaseModel;
