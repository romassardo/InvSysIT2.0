// Servidor de demostración completo con datos simulados
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const app = express();

// Configurar middleware
app.use(cors());
app.use(express.json());

// Datos simulados
const users = [
  { 
    id: 1, 
    name: 'Admin Usuario', 
    email: 'admin@example.com', 
    role: 'admin',
    department: 'IT',
    active: true 
  },
  { 
    id: 2, 
    name: 'Usuario Regular', 
    email: 'user@example.com', 
    role: 'user',
    department: 'Marketing',
    active: true 
  }
];

const categories = [
  { id: 1, name: 'Computadoras', parentId: null },
  { id: 2, name: 'Notebooks', parentId: 1 },
  { id: 3, name: 'Desktops', parentId: 1 },
  { id: 4, name: 'Celulares', parentId: null },
  { id: 5, name: 'Periféricos', parentId: null },
  { id: 6, name: 'Teclados', parentId: 5 },
  { id: 7, name: 'Mouse', parentId: 5 },
  { id: 8, name: 'Auriculares', parentId: 5 },
  { id: 9, name: 'Monitores', parentId: 5 },
  { id: 10, name: 'Consumibles', parentId: null },
  { id: 11, name: 'Cables', parentId: 10 },
  { id: 12, name: 'Cargadores', parentId: 10 },
  { id: 13, name: 'Componentes', parentId: null },
  { id: 14, name: 'Memorias RAM', parentId: 13 },
  { id: 15, name: 'Discos SSD', parentId: 13 }
];

const products = [
  { 
    id: 1, 
    name: 'Notebook Dell Latitude', 
    model: '5520',
    categoryId: 2, 
    type: 'asset',
    minStockThreshold: null,
    currentStock: 5
  },
  { 
    id: 2, 
    name: 'Samsung Galaxy', 
    model: 'A52',
    categoryId: 4, 
    type: 'asset',
    minStockThreshold: null,
    currentStock: 8
  },
  { 
    id: 3, 
    name: 'Cable HDMI', 
    model: '2m',
    categoryId: 11, 
    type: 'consumable',
    minStockThreshold: 10,
    currentStock: 15
  },
  { 
    id: 4, 
    name: 'Teclado Logitech', 
    model: 'K380',
    categoryId: 6, 
    type: 'asset',
    minStockThreshold: null,
    currentStock: 7
  },
  { 
    id: 5, 
    name: 'Mouse HP', 
    model: 'Wireless',
    categoryId: 7, 
    type: 'asset',
    minStockThreshold: null,
    currentStock: 12
  },
  { 
    id: 6, 
    name: 'Memoria RAM Kingston', 
    model: '8GB DDR4',
    categoryId: 14, 
    type: 'asset',
    minStockThreshold: 3,
    currentStock: 2
  }
];

const assetDetails = [
  {
    id: 1,
    productId: 1,
    serialNumber: 'DL5520-001',
    status: 'assigned',
    assignedUser: users[1],
    encryptionPass: 'sec-pass-123',
    assignDate: '2025-03-15'
  },
  {
    id: 2,
    productId: 1,
    serialNumber: 'DL5520-002',
    status: 'available',
    assignedUser: null,
    encryptionPass: null,
    assignDate: null
  },
  {
    id: 3,
    productId: 2,
    serialNumber: 'SGA52-001',
    status: 'in_repair',
    assignedUser: null,
    encryptionPass: null,
    assignDate: null
  },
  {
    id: 4,
    productId: 2,
    serialNumber: 'SGA52-002',
    status: 'assigned',
    assignedUser: users[0],
    encryptionPass: 'cell-enc-456',
    assignDate: '2025-02-20'
  },
  {
    id: 5,
    productId: 4,
    serialNumber: 'TL-K380-001',
    status: 'available',
    assignedUser: null,
    encryptionPass: null,
    assignDate: null
  }
];

const departments = [
  { id: 1, name: 'IT' },
  { id: 2, name: 'Marketing' },
  { id: 3, name: 'Ventas' },
  { id: 4, name: 'Administración' },
  { id: 5, name: 'RRHH' }
];

const branches = [
  { id: 1, name: 'Sede Central', location: 'Buenos Aires' },
  { id: 2, name: 'Sucursal Norte', location: 'Córdoba' },
  { id: 3, name: 'Sucursal Sur', location: 'Bariloche' }
];

const repairs = [
  { 
    id: 1, 
    assetDetailId: 3,
    assetName: 'Samsung Galaxy A52',
    serialNumber: 'SGA52-001',
    repairProvider: 'TechFix Solutions',
    issueDescription: 'Pantalla rota',
    sentDate: '2025-03-15',
    sentBy: users[0],
    repairStatus: 'pending'
  },
  { 
    id: 2, 
    assetDetailId: null,
    assetName: 'Notebook Dell Latitude 5520',
    serialNumber: 'DL5520-003',
    repairProvider: 'Dell Support',
    issueDescription: 'No enciende',
    sentDate: '2025-03-10',
    sentBy: users[0],
    returnDate: '2025-03-20',
    wasRepaired: true,
    repairDescription: 'Reemplazo de motherboard',
    repairStatus: 'completed'
  }
];

const inventoryMovements = [
  {
    id: 1,
    type: 'entry',
    productName: 'Notebook Dell Latitude 5520',
    quantity: 3,
    date: '2025-03-01',
    createdBy: users[0].name
  },
  {
    id: 2,
    type: 'assignment',
    productName: 'Notebook Dell Latitude 5520',
    serialNumber: 'DL5520-001',
    assignedTo: users[1].name,
    date: '2025-03-15',
    createdBy: users[0].name
  },
  {
    id: 3,
    type: 'repair_send',
    productName: 'Samsung Galaxy A52',
    serialNumber: 'SGA52-001',
    date: '2025-03-15',
    createdBy: users[0].name
  },
  {
    id: 4,
    type: 'out',
    productName: 'Cable HDMI 2m',
    quantity: 5,
    destination: 'Departamento Marketing',
    date: '2025-03-20',
    createdBy: users[0].name
  }
];

const notifications = [
  { 
    id: 1, 
    title: 'Stock Bajo', 
    message: 'La "Memoria RAM Kingston 8GB DDR4" ha alcanzado el nivel mínimo de stock. Stock actual: 2, Umbral: 3',
    type: 'warning',
    createdAt: '2025-04-09',
    read: false
  },
  { 
    id: 2, 
    title: 'Activo Asignado', 
    message: 'Se ha asignado "Notebook Dell Latitude 5520 (DL5520-001)" a Usuario Regular',
    type: 'info',
    createdAt: '2025-03-15',
    read: false
  },
  { 
    id: 3, 
    title: 'Envío a Reparación', 
    message: 'El activo "Samsung Galaxy A52 (SGA52-001)" ha sido enviado a reparación',
    type: 'info',
    createdAt: '2025-03-15',
    read: true
  }
];

// Middleware para autenticación
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({
      status: 'error',
      message: 'Acceso denegado, token no proporcionado'
    });
  }
  
  try {
    // En modo demo, simplemente verificamos si el token es válido (format)
    const user = token === 'admin-token' 
      ? users[0]  // Token de admin
      : token === 'user-token'
        ? users[1]  // Token de usuario regular
        : null;
    
    if (!user) {
      return res.status(401).json({
        status: 'error',
        message: 'Token inválido'
      });
    }
    
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json({
      status: 'error',
      message: 'Token inválido'
    });
  }
};

// Middleware para verificar rol de admin
const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({
      status: 'error',
      message: 'No autenticado'
    });
  }
  
  if (req.user.role !== 'admin') {
    return res.status(403).json({
      status: 'error',
      message: 'Acceso denegado, se requieren permisos de administrador'
    });
  }
  
  next();
};

// Ruta principal
app.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'API del Sistema de Inventario IT - Versión DEMO',
    version: '1.0.0-demo'
  });
});

// Rutas de autenticación
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Simulamos login (en un entorno real verificaríamos la contraseña)
  if (email === 'admin@example.com' && password === 'admin') {
    return res.json({
      status: 'success',
      data: {
        user: users[0],
        token: 'admin-token'
      }
    });
  } else if (email === 'user@example.com' && password === 'user') {
    return res.json({
      status: 'success',
      data: {
        user: users[1],
        token: 'user-token'
      }
    });
  }
  
  return res.status(401).json({
    status: 'error',
    message: 'Credenciales inválidas'
  });
});

app.get('/api/auth/verify', authenticateToken, (req, res) => {
  res.json({
    status: 'success',
    data: {
      user: req.user
    }
  });
});

// Rutas de usuarios
app.get('/api/users/profile', authenticateToken, (req, res) => {
  res.json({
    status: 'success',
    data: req.user
  });
});

app.get('/api/users', authenticateToken, isAdmin, (req, res) => {
  res.json({
    status: 'success',
    data: users
  });
});

// Rutas de categorías
app.get('/api/categories', authenticateToken, (req, res) => {
  res.json({
    status: 'success',
    data: categories
  });
});

app.get('/api/categories/hierarchy/all', authenticateToken, (req, res) => {
  // Función para construir jerarquía
  const buildHierarchy = (categories, parentId = null) => {
    return categories
      .filter(category => category.parentId === parentId)
      .map(category => ({
        ...category,
        children: buildHierarchy(categories, category.id)
      }));
  };
  
  res.json({
    status: 'success',
    data: buildHierarchy(categories)
  });
});

// Rutas de productos
app.get('/api/products', authenticateToken, (req, res) => {
  res.json({
    status: 'success',
    data: products
  });
});

app.get('/api/products/type/:type', authenticateToken, (req, res) => {
  const { type } = req.params;
  
  const filteredProducts = products.filter(p => p.type === type);
  
  res.json({
    status: 'success',
    data: filteredProducts
  });
});

// Rutas de activos
app.get('/api/assets', authenticateToken, (req, res) => {
  const assetsWithDetails = assetDetails.map(asset => {
    const product = products.find(p => p.id === asset.productId);
    return {
      ...asset,
      productName: product.name,
      model: product.model,
      categoryId: product.categoryId
    };
  });
  
  res.json({
    status: 'success',
    data: assetsWithDetails
  });
});

// Rutas de inventario
app.get('/api/inventory/movements', authenticateToken, (req, res) => {
  res.json({
    status: 'success',
    data: inventoryMovements
  });
});

// Rutas de notificaciones
app.get('/api/notifications/unread', authenticateToken, (req, res) => {
  const unreadNotifications = notifications.filter(n => !n.read);
  
  res.json({
    status: 'success',
    data: unreadNotifications
  });
});

app.get('/api/notifications/my', authenticateToken, (req, res) => {
  res.json({
    status: 'success',
    data: notifications
  });
});

app.patch('/api/notifications/:id/read', authenticateToken, (req, res) => {
  const { id } = req.params;
  const notificationIndex = notifications.findIndex(n => n.id === parseInt(id));
  
  if (notificationIndex !== -1) {
    notifications[notificationIndex].read = true;
    
    res.json({
      status: 'success',
      message: 'Notificación marcada como leída',
      data: notifications[notificationIndex]
    });
  } else {
    res.status(404).json({
      status: 'error',
      message: 'Notificación no encontrada'
    });
  }
});

app.patch('/api/notifications/read-all', authenticateToken, (req, res) => {
  notifications.forEach(n => {
    n.read = true;
  });
  
  res.json({
    status: 'success',
    message: 'Todas las notificaciones marcadas como leídas'
  });
});

// Rutas para reparaciones
app.get('/api/repairs', authenticateToken, isAdmin, (req, res) => {
  res.json({
    status: 'success',
    data: repairs
  });
});

app.get('/api/repairs/status/pending', authenticateToken, isAdmin, (req, res) => {
  const pendingRepairs = repairs.filter(r => r.repairStatus === 'pending');
  
  res.json({
    status: 'success',
    data: pendingRepairs
  });
});

// Rutas para reportes
app.get('/api/reports/current-inventory', authenticateToken, (req, res) => {
  const inventory = products.map(product => {
    const category = categories.find(c => c.id === product.categoryId);
    const assets = product.type === 'asset' 
      ? assetDetails.filter(a => a.productId === product.id)
      : [];
    
    return {
      ...product,
      categoryName: category.name,
      availableCount: product.type === 'asset' 
        ? assets.filter(a => a.status === 'available').length
        : product.currentStock,
      assignedCount: product.type === 'asset'
        ? assets.filter(a => a.status === 'assigned').length
        : 0,
      inRepairCount: product.type === 'asset'
        ? assets.filter(a => a.status === 'in_repair').length
        : 0
    };
  });
  
  res.json({
    status: 'success',
    data: inventory
  });
});

app.get('/api/reports/assigned-assets', authenticateToken, isAdmin, (req, res) => {
  const assignedAssets = assetDetails
    .filter(a => a.status === 'assigned')
    .map(asset => {
      const product = products.find(p => p.id === asset.productId);
      return {
        ...asset,
        productName: product.name,
        model: product.model
      };
    });
  
  res.json({
    status: 'success',
    data: assignedAssets
  });
});

app.get('/api/reports/low-stock', authenticateToken, isAdmin, (req, res) => {
  const lowStockItems = products
    .filter(p => p.minStockThreshold !== null && p.currentStock <= p.minStockThreshold)
    .map(product => {
      const category = categories.find(c => c.id === product.categoryId);
      return {
        ...product,
        categoryName: category.name,
        belowThreshold: product.currentStock < product.minStockThreshold
      };
    });
  
  res.json({
    status: 'success',
    data: lowStockItems
  });
});

// Endpoints específicos para formularios
app.get('/api/forms/assign', authenticateToken, (req, res) => {
  // Obtener activos disponibles (notebooks y celulares)
  const availableAssets = assetDetails
    .filter(a => a.status === 'available')
    .map(asset => {
      const product = products.find(p => p.id === asset.productId);
      // Solo notebooks y celulares
      if (product.categoryId === 2 || product.categoryId === 4) {
        return {
          id: asset.id,
          name: `${product.name} ${product.model} (${asset.serialNumber})`,
          type: product.categoryId === 2 ? 'notebook' : 'celular'
        };
      }
      return null;
    })
    .filter(Boolean);
  
  res.json({
    status: 'success',
    message: 'Formulario de asignación para notebooks y celulares',
    data: {
      assets: availableAssets,
      users: users.map(u => ({ id: u.id, name: u.name })),
      formFields: [
        { id: 'assetDetailId', label: 'Activo', type: 'select', required: true, options: availableAssets },
        { id: 'assignedUserId', label: 'Usuario Asignado', type: 'select', required: true, options: users.map(u => ({ id: u.id, name: u.name })) },
        { id: 'encryptionPass', label: 'Contraseña de Encriptación', type: 'text', required: true },
        { id: 'notes', label: 'Notas', type: 'textarea', required: false }
      ]
    }
  });
});

app.get('/api/forms/inventory-out', authenticateToken, (req, res) => {
  // Todos los productos excepto notebooks y celulares
  const availableProducts = products
    .filter(p => {
      // Excluir notebooks y celulares
      return !(p.categoryId === 2 || p.categoryId === 4);
    })
    .map(product => ({
      id: product.id,
      name: `${product.name} ${product.model}`,
      currentStock: product.currentStock
    }));
  
  res.json({
    status: 'success',
    message: 'Formulario de salida para todos los ítems excepto notebooks y celulares',
    data: {
      products: availableProducts,
      departments: departments,
      branches: branches,
      formFields: [
        { id: 'productId', label: 'Producto', type: 'select', required: true, options: availableProducts },
        { id: 'quantity', label: 'Cantidad', type: 'number', required: true, min: 1 },
        { id: 'destinationType', label: 'Tipo de Destino', type: 'select', required: true,
          options: [
            { id: 'department', name: 'Departamento' },
            { id: 'branch', name: 'Sucursal' }
          ] 
        },
        { id: 'destinationDepartmentId', label: 'Departamento', type: 'select', required: false, options: departments },
        { id: 'destinationBranchId', label: 'Sucursal', type: 'select', required: false, options: branches },
        { id: 'notes', label: 'Notas', type: 'textarea', required: false }
      ]
    }
  });
});

// Puerto
const PORT = 3001;

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`Servidor DEMO ejecutándose en http://localhost:${PORT}`);
  console.log('Usuarios disponibles para login:');
  console.log('- Admin: admin@example.com / admin');
  console.log('- Usuario: user@example.com / user');
});
