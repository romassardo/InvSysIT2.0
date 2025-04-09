// Rutas para la gestión de activos
const express = require('express');
const router = express.Router();
// En futuras implementaciones, importaremos los controladores reales
// const assetController = require('../controllers/asset.controller');

// Obtener todos los activos (con filtros opcionales)
router.get('/', (req, res) => {
  // Implementación simulada hasta desarrollar el controlador
  // Tomamos los posibles filtros de query params
  const { category, status, assigned_to, search } = req.query;
  
  // Enviamos una respuesta simulada
  res.json({
    status: 'success',
    message: 'Activos recuperados exitosamente',
    data: {
      assets: [
        {
          id: 1,
          name: 'Notebook Dell Latitude 7400',
          category: 'Computadoras',
          subcategory: 'Notebooks',
          serialNumber: 'DL7400-123456',
          status: 'Asignado',
          assignedTo: 'Juan Pérez',
          location: 'Oficina Central',
          createdAt: '2025-01-15T10:30:45Z',
          lastUpdated: '2025-03-20T14:22:10Z'
        },
        {
          id: 2,
          name: 'Monitor Samsung 24"',
          category: 'Periféricos',
          subcategory: 'Monitores',
          serialNumber: 'SM24-987654',
          status: 'En Stock',
          assignedTo: null,
          location: 'Almacén IT',
          createdAt: '2025-02-05T09:15:30Z',
          lastUpdated: '2025-02-05T09:15:30Z'
        }
      ],
      total: 2,
      page: 1,
      limit: 10
    }
  });
});

// Obtener un activo por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  // Verificar que el ID es un número
  if (isNaN(parseInt(id))) {
    return res.status(400).json({
      status: 'error',
      message: 'ID de activo inválido'
    });
  }
  
  // Simulamos encontrar el activo
  res.json({
    status: 'success',
    message: 'Activo recuperado exitosamente',
    data: {
      id: parseInt(id),
      name: 'Notebook Dell Latitude 7400',
      category: 'Computadoras',
      subcategory: 'Notebooks',
      serialNumber: 'DL7400-123456',
      status: 'Asignado',
      assignedTo: 'Juan Pérez',
      location: 'Oficina Central',
      specifications: {
        processor: 'Intel Core i7',
        ram: '16GB',
        storage: '512GB SSD',
        os: 'Windows 11 Pro'
      },
      // Para notebooks, incluimos la contraseña de encriptación
      encryptionPassword: 'BitLocker-Secret-123',
      purchaseDate: '2024-12-10',
      warrantyUntil: '2026-12-10',
      notes: 'Equipo en perfecto estado',
      history: [
        {
          date: '2025-01-15T10:30:45Z',
          action: 'Entrada de Stock',
          user: 'Admin',
          details: 'Recepción inicial del equipo'
        },
        {
          date: '2025-03-20T14:22:10Z',
          action: 'Asignación',
          user: 'Admin',
          details: 'Asignado a Juan Pérez'
        }
      ],
      createdAt: '2025-01-15T10:30:45Z',
      lastUpdated: '2025-03-20T14:22:10Z'
    }
  });
});

// Crear un nuevo activo
router.post('/', (req, res) => {
  const { name, category, subcategory, serialNumber, specifications } = req.body;
  
  // Validación básica
  if (!name || !category || !serialNumber) {
    return res.status(400).json({
      status: 'error',
      message: 'Nombre, categoría y número de serie son obligatorios'
    });
  }
  
  // Simulamos la creación exitosa
  res.status(201).json({
    status: 'success',
    message: 'Activo creado exitosamente',
    data: {
      id: 3,
      name,
      category,
      subcategory,
      serialNumber,
      status: 'En Stock',
      specifications,
      createdAt: new Date().toISOString(),
      lastUpdated: new Date().toISOString()
    }
  });
});

// Actualizar un activo existente
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const updateData = req.body;
  
  // Respuesta simulada
  res.json({
    status: 'success',
    message: 'Activo actualizado exitosamente',
    data: {
      id: parseInt(id),
      ...updateData,
      lastUpdated: new Date().toISOString()
    }
  });
});

// Asignar un activo
router.post('/:id/assign', (req, res) => {
  const { id } = req.params;
  const { assignedTo, location, notes } = req.body;
  
  if (!assignedTo) {
    return res.status(400).json({
      status: 'error',
      message: 'Se requiere especificar a quién se asigna el activo'
    });
  }
  
  res.json({
    status: 'success',
    message: 'Activo asignado exitosamente',
    data: {
      id: parseInt(id),
      assignedTo,
      location,
      status: 'Asignado',
      notes,
      lastUpdated: new Date().toISOString()
    }
  });
});

// Enviar a reparación
router.post('/:id/repair', (req, res) => {
  const { id } = req.params;
  const { provider, issueDescription } = req.body;
  
  if (!provider || !issueDescription) {
    return res.status(400).json({
      status: 'error',
      message: 'Proveedor y descripción del problema son obligatorios'
    });
  }
  
  res.json({
    status: 'success',
    message: 'Activo enviado a reparación exitosamente',
    data: {
      id: parseInt(id),
      status: 'En Reparación',
      repairInfo: {
        provider,
        issueDescription,
        sentDate: new Date().toISOString()
      },
      lastUpdated: new Date().toISOString()
    }
  });
});

module.exports = router;
