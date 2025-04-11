const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const sql = require('mssql');

// Rutas
const authRoutes = require('./src/routes/auth.routes');
const userRoutes = require('./src/routes/user.routes');
const categoryRoutes = require('./src/routes/category.routes');
const productRoutes = require('./src/routes/product.routes');
const assetRoutes = require('./src/routes/asset.routes');
const inventoryRoutes = require('./src/routes/inventory.routes');
const notificationRoutes = require('./src/routes/notification.routes');
const reportRoutes = require('./src/routes/report.routes');
const repairRoutes = require('./src/routes/repair.routes');

// Cargar variables de entorno
dotenv.config();

// Inicializar la aplicación Express
const app = express();

// Configuración de middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para verificación de stock y alertas
const { checkStockThresholds } = require('./src/middleware/stock-alert.middleware');

// Definir rutas de la API
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/products', productRoutes);
app.use('/api/assets', assetRoutes);
// Aplicar middleware de verificación de stock a las rutas de inventario
app.use('/api/inventory', checkStockThresholds, inventoryRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/repairs', repairRoutes);

// Ruta básica para verificar que el servidor está funcionando
app.get('/', (req, res) => {
  res.status(200).json({ 
    message: 'API del Sistema de Inventario IT funcionando correctamente',
    version: '1.0.0'
  });
});

// Manejador global de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    status: 'error',
    message: err.message || 'Error interno del servidor',
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

// La inicialización del servidor se realiza en server.js
// Este archivo solo configura la aplicación Express

module.exports = app;
