const sql = require('mssql');
const dotenv = require('dotenv');

// Cargar variables de entorno
dotenv.config();

// Configuración de la conexión a SQL Server
const config = {
  server: process.env.DB_SERVER,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false, // Para conexiones a Azure usar true
    trustServerCertificate: true, // Para desarrollo local
    enableArithAbort: true,
    trustedConnection: false // No usar autenticación de Windows
  },
  pool: {
    max: 10,
    min: 0,
    idleTimeoutMillis: 30000
  }
};

// Función para conectarse a la base de datos
async function connectToDatabase() {
  try {
    const pool = await sql.connect(config);
    console.log('Conexión a SQL Server establecida correctamente');
    return pool;
  } catch (err) {
    console.error('Error al conectar a SQL Server:', err);
    throw err;
  }
}

// Exportar pool de conexiones y configuración
module.exports = {
  config,
  connectToDatabase,
  sql
};
