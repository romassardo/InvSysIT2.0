// Configuración de API para el frontend
import axios from 'axios';

// URL base del servidor (ajustar según entorno)
const API_URL = '/api';

// Crear instancia de axios con configuración base
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para agregar el token a todas las peticiones
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
api.interceptors.response.use(
  response => {
    return response;
  },
  error => {
    // Manejo centralizado de errores
    if (error.response && error.response.status === 401) {
      // Redireccionar a login si hay error de autenticación
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Servicios de autenticación
export const authService = {
  login: (credentials) => api.post('/auth/login', credentials),
  verifyToken: () => api.get('/auth/verify'),
  changePassword: (data) => api.post('/auth/change-password', data)
};

// Servicios de usuarios
export const userService = {
  getProfile: () => api.get('/users/profile'),
  getAll: () => api.get('/users'),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  deactivate: (id) => api.delete(`/users/${id}`)
};

// Servicios de categorías
export const categoryService = {
  getAll: () => api.get('/categories'),
  getById: (id) => api.get(`/categories/${id}`),
  getMainCategories: () => api.get('/categories/main/list'),
  getSubcategories: (parentId) => api.get(`/categories/sub/${parentId}`),
  getHierarchy: () => api.get('/categories/hierarchy/all'),
  create: (categoryData) => api.post('/categories', categoryData),
  update: (id, categoryData) => api.put(`/categories/${id}`, categoryData),
  deactivate: (id) => api.delete(`/categories/${id}`)
};

// Servicios de productos
export const productService = {
  getAll: () => api.get('/products'),
  getById: (id) => api.get(`/products/${id}`),
  getByType: (type) => api.get(`/products/type/${type}`),
  getByCategory: (categoryId) => api.get(`/products/category/${categoryId}`),
  search: (term) => api.get(`/products/search?term=${term}`),
  create: (productData) => api.post('/products', productData),
  update: (id, productData) => api.put(`/products/${id}`, productData),
  updateStock: (id, stockData) => api.patch(`/products/${id}/stock`, stockData)
};

// Servicios de inventario
export const inventoryService = {
  getAllMovements: () => api.get('/inventory/movements'),
  getMovementsByType: (type) => api.get(`/inventory/movements/type/${type}`),
  getMovementsByProduct: (productId) => api.get(`/inventory/movements/product/${productId}`),
  getMovementsByAsset: (assetDetailId) => api.get(`/inventory/movements/asset/${assetDetailId}`),
  getMovementsByAssignedUser: (userId) => api.get(`/inventory/movements/assigned-to/${userId}`),
  getAssignedAssetsByUser: (userId) => api.get(`/inventory/assets/assigned-to/${userId}`),
  getMyAssignedAssets: () => api.get('/inventory/my-assets'),
  registerEntry: (entryData) => api.post('/inventory/entry', entryData),
  registerOut: (outData) => api.post('/inventory/out', outData),
  registerAssetAssignment: (assignmentData) => api.post('/inventory/assign', assignmentData)
};

// Servicios de notificaciones
export const notificationService = {
  getAll: () => api.get('/notifications/my'),
  getUnread: () => api.get('/notifications/unread'),
  countUnread: () => api.get('/notifications/count'),
  markAsRead: (id) => api.patch(`/notifications/${id}/read`),
  markAllAsRead: () => api.patch('/notifications/read-all'),
  create: (notificationData) => api.post('/notifications', notificationData)
};

// Servicios de reparaciones
export const repairService = {
  getAll: () => api.get('/repairs'),
  getByStatus: (status) => api.get(`/repairs/status/${status}`),
  getHistoryByAsset: (assetDetailId) => api.get(`/repairs/asset/${assetDetailId}/history`),
  sendToRepair: (repairData) => api.post('/repairs/send', repairData),
  registerReturn: (returnData) => api.post('/repairs/return', returnData)
};

// Servicios de reportes
export const reportService = {
  // Obtener reportes disponibles
  getAvailableReports: () => api.get('/reports'),
  getPredefinedReports: () => api.get('/reports/predefined'),
  getCustomReports: () => api.get('/reports/custom/list'),
  
  // Generar reportes
  generateReport: (params) => api.post('/reports/generate', params),
  currentInventory: (filters) => api.get('/reports/current-inventory', { params: filters }),
  myAssignedAssets: () => api.get('/reports/my-assets'),
  assetHistory: (assetId) => api.get(`/reports/asset-history/${assetId}`),
  assignedAssets: (filters) => api.get('/reports/assigned-assets', { params: filters }),
  inventoryMovements: (filters) => api.get('/reports/inventory-movements', { params: filters }),
  lowStock: () => api.get('/reports/low-stock'),
  repairsAndMaintenance: (filters) => api.get('/reports/repairs-maintenance', { params: filters }),
  
  // Gestión de reportes personalizados
  customReport: (reportConfig) => api.post('/reports/custom', reportConfig),
  createCustomReport: (reportData) => api.post('/reports/custom/create', reportData),
  updateCustomReport: (id, reportData) => api.put(`/reports/custom/${id}`, reportData),
  deleteCustomReport: (id) => api.delete(`/reports/custom/${id}`)
};

// Servicios de formularios específicos
export const formService = {
  getAssignForm: () => api.get('/forms/assign'),
  getInventoryOutForm: () => api.get('/forms/inventory-out')
};

export default api;
