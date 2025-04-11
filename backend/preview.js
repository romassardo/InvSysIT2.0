// Servidor básico para preview
const express = require('express');
const cors = require('cors');
const app = express();

// Configurar middleware
app.use(cors());
app.use(express.json());

// Ruta para comprobar que el servidor funciona
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'API del Sistema de Inventario IT funcionando en modo preview',
    version: '1.0.0'
  });
});

// Rutas de ejemplo para mostrar estructura de la API
app.get('/api/auth/verify', (req, res) => {
  res.json({
    status: 'success',
    message: 'Esta ruta normalmente verificaría el token JWT',
    endpoint: '/api/auth/verify'
  });
});

// Ejemplo de rutas de usuario
app.get('/api/users/profile', (req, res) => {
  res.json({
    status: 'success',
    message: 'Esta ruta normalmente devolvería el perfil del usuario autenticado',
    endpoint: '/api/users/profile'
  });
});

// Ejemplo para categorías
app.get('/api/categories', (req, res) => {
  res.json({
    status: 'success',
    message: 'Esta ruta normalmente devolvería todas las categorías',
    endpoint: '/api/categories',
    data: [
      { id: 1, name: 'Computadoras', parentId: null },
      { id: 2, name: 'Notebooks', parentId: 1 },
      { id: 3, name: 'Celulares', parentId: null },
      { id: 4, name: 'Periféricos', parentId: null }
    ]
  });
});

// Ejemplo para productos
app.get('/api/products', (req, res) => {
  res.json({
    status: 'success',
    message: 'Esta ruta normalmente devolvería todos los productos',
    endpoint: '/api/products',
    data: [
      { id: 1, name: 'Notebook Dell Latitude', categoryId: 2, type: 'asset' },
      { id: 2, name: 'Samsung Galaxy A52', categoryId: 3, type: 'asset' },
      { id: 3, name: 'Cable HDMI', categoryId: 4, type: 'consumable' }
    ]
  });
});

// Ejemplo de formularios específicos mencionados
app.get('/api/forms/assign', (req, res) => {
  res.json({
    status: 'success',
    message: 'Estructura del formulario de asignación para notebooks y celulares',
    endpoint: '/api/forms/assign',
    formFields: [
      { id: 'assetDetailId', label: 'Activo', type: 'select', required: true },
      { id: 'assignedUserId', label: 'Usuario Asignado', type: 'select', required: true },
      { id: 'encryptionPass', label: 'Contraseña de Encriptación', type: 'text', required: true },
      { id: 'notes', label: 'Notas', type: 'textarea', required: false }
    ]
  });
});

app.get('/api/forms/inventory-out', (req, res) => {
  res.json({
    status: 'success',
    message: 'Estructura del formulario de salida para otros ítems',
    endpoint: '/api/forms/inventory-out',
    formFields: [
      { id: 'productId', label: 'Producto', type: 'select', required: true },
      { id: 'quantity', label: 'Cantidad', type: 'number', required: true },
      { id: 'destinationType', label: 'Tipo de Destino', type: 'select', required: true,
        options: ['department', 'branch'] },
      { id: 'destinationId', label: 'Destino', type: 'select', required: true },
      { id: 'notes', label: 'Notas', type: 'textarea', required: false }
    ]
  });
});

// Ejemplo para sistema de reparaciones
app.get('/api/repairs', (req, res) => {
  res.json({
    status: 'success',
    message: 'Esta ruta normalmente devolvería todas las reparaciones',
    endpoint: '/api/repairs',
    data: [
      { 
        id: 1, 
        assetName: 'Notebook Dell Latitude', 
        serialNumber: 'ABC123',
        repairProvider: 'TechFix Solutions',
        issueDescription: 'Pantalla rota',
        sentDate: '2025-03-15',
        repairStatus: 'pending'
      },
      { 
        id: 2, 
        assetName: 'Samsung Galaxy A52', 
        serialNumber: 'XYZ789',
        repairProvider: 'PhoneRepair Pro',
        issueDescription: 'No carga batería',
        sentDate: '2025-03-10',
        returnDate: '2025-03-20',
        repairStatus: 'completed'
      }
    ]
  });
});

// Ejemplo para notificaciones
app.get('/api/notifications/unread', (req, res) => {
  res.json({
    status: 'success',
    message: 'Esta ruta normalmente devolvería las notificaciones no leídas',
    endpoint: '/api/notifications/unread',
    data: [
      { 
        id: 1, 
        title: 'Stock Bajo', 
        message: 'El producto "Cable HDMI" ha alcanzado el nivel mínimo de stock',
        type: 'warning',
        createdAt: '2025-04-09',
        read: false
      },
      { 
        id: 2, 
        title: 'Reparación Completada', 
        message: 'El activo "Samsung Galaxy A52" ha sido reparado y está disponible',
        type: 'success',
        createdAt: '2025-04-10',
        read: false
      }
    ]
  });
});

// Puerto
const PORT = 3000;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor de preview ejecutándose en http://localhost:${PORT}`);
  console.log('Este es un servidor de demostración que muestra la estructura de API');
  console.log('No tiene conexión a la base de datos');
});
