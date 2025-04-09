// Archivo principal del servidor backend
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sqlConfig } = require('./config/database');
const sql = require('mssql');
const authRoutes = require('./routes/auth.routes');
const assetRoutes = require('./routes/asset.routes');
const categoryRoutes = require('./routes/category.routes');
const userRoutes = require('./routes/user.routes');
const reportRoutes = require('./routes/report.routes');
const logger = require('./utils/logger');

// Inicialización de la app Express
const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Manejador básico de errores
app.use((err, req, res, next) => {
  logger.error(`Error: ${err.message}`);
  res.status(500).json({
    status: 'error',
    message: 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Error interno'
  });
});

// Rutas
app.use('/api/auth', authRoutes);
app.use('/api/assets', assetRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
app.use('/api/reports', reportRoutes);

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'API del Sistema de Inventario IT',
    version: '1.0.0',
    status: 'running'
  });
});

// Iniciar servidor
async function startServer() {
  try {
    // Intentar conectar a la base de datos
    await sql.connect(sqlConfig);
    logger.info('Conexión exitosa a la base de datos SQL Server');
    
    // Iniciar servidor
    app.listen(PORT, () => {
      logger.info(`Servidor iniciado en http://localhost:${PORT}`);
    });
  } catch (error) {
    logger.error(`Error al iniciar: ${error.message}`);
    process.exit(1);
  }
}

startServer();
