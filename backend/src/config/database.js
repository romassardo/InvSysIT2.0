// Configuración de la conexión a SQL Server
require('dotenv').config();

const sqlConfig = {
  database: process.env.DB_NAME || 'InvSysIT',
  server: process.env.DB_SERVER || 'localhost\\SQLEXPRESS',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, // Para conexiones Azure usar true
    trustServerCertificate: true, // Solo para desarrollo local
    trustedConnection: process.env.DB_TRUSTED_CONNECTION === 'true' || false // Usar autenticación de Windows
  }
};

module.exports = { sqlConfig };
