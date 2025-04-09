// Configuración de la conexión a SQL Server
require('dotenv').config();

const sqlConfig = {
  user: process.env.DB_USER || 'sa',
  password: process.env.DB_PASSWORD || 'YourStrong@Passw0rd',
  database: process.env.DB_NAME || 'InvSysIT',
  server: process.env.DB_SERVER || 'localhost',
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  },
  options: {
    encrypt: false, // Para conexiones Azure usar true
    trustServerCertificate: true // Solo para desarrollo local
  }
};

module.exports = { sqlConfig };
