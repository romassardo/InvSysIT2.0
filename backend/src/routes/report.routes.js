// Rutas para generación de reportes
const express = require('express');
const router = express.Router();

// Obtener listado de reportes disponibles
router.get('/', (req, res) => {
  res.json({
    status: 'success',
    message: 'Reportes disponibles',
    data: {
      reports: [
        {
          id: 'inventory-summary',
          name: 'Resumen de Inventario',
          description: 'Muestra un resumen de todos los activos por categoría'
        },
        {
          id: 'assigned-assets',
          name: 'Activos Asignados',
          description: 'Lista de todos los activos asignados con detalles de asignación'
        },
        {
          id: 'repairs-history',
          name: 'Historial de Reparaciones',
          description: 'Historial de reparaciones para todos los activos'
        },
        {
          id: 'low-stock',
          name: 'Consumibles Bajo Mínimo',
          description: 'Lista de consumibles por debajo del umbral mínimo'
        },
        {
          id: 'asset-history',
          name: 'Historial de Activo',
          description: 'Historial completo de un activo específico'
        }
      ]
    }
  });
});

// Generar reporte específico
router.get('/:reportId', (req, res) => {
  const { reportId } = req.params;
  const { format, startDate, endDate, category, location } = req.query;
  
  // Verificar si es un reporte válido
  const validReports = ['inventory-summary', 'assigned-assets', 'repairs-history', 'low-stock', 'asset-history'];
  if (!validReports.includes(reportId)) {
    return res.status(404).json({
      status: 'error',
      message: 'Reporte no encontrado'
    });
  }
  
  // Verificar formato válido
  const validFormats = ['json', 'pdf', 'csv', 'excel'];
  if (format && !validFormats.includes(format)) {
    return res.status(400).json({
      status: 'error',
      message: 'Formato de reporte inválido. Formatos permitidos: json, pdf, csv, excel'
    });
  }
  
  // En una implementación real, generaríamos el reporte según los parámetros
  // Aquí solo enviamos datos simulados
  
  // Para el caso especial de historial de activo, necesitamos el ID del activo
  if (reportId === 'asset-history') {
    const { assetId } = req.query;
    if (!assetId) {
      return res.status(400).json({
        status: 'error',
        message: 'Se requiere el ID del activo para este reporte'
      });
    }
  }
  
  // Simulación de respuesta con datos de reporte
  const reportData = {
    'inventory-summary': {
      title: 'Resumen de Inventario',
      generatedAt: new Date().toISOString(),
      summary: {
        total: 250,
        byCategory: [
          { category: 'Computadoras', count: 85 },
          { category: 'Celulares', count: 30 },
          { category: 'Periféricos', count: 95 },
          { category: 'Consumibles', count: 25 },
          { category: 'Componentes', count: 15 }
        ],
        byStatus: [
          { status: 'En Stock', count: 120 },
          { status: 'Asignado', count: 110 },
          { status: 'En Reparación', count: 15 },
          { status: 'Baja', count: 5 }
        ]
      }
    },
    'assigned-assets': {
      title: 'Activos Asignados',
      generatedAt: new Date().toISOString(),
      filters: { startDate, endDate, category, location },
      assets: [
        {
          id: 1,
          name: 'Notebook Dell Latitude 7400',
          category: 'Computadoras',
          serialNumber: 'DL7400-123456',
          assignedTo: 'Juan Pérez',
          location: 'Oficina Central',
          assignedDate: '2025-03-20T14:22:10Z',
          assignedBy: 'Admin'
        },
        {
          id: 5,
          name: 'Celular Samsung Galaxy S22',
          category: 'Celulares',
          serialNumber: 'SG22-789012',
          assignedTo: 'María López',
          location: 'Sucursal Norte',
          assignedDate: '2025-02-15T11:30:00Z',
          assignedBy: 'Admin'
        }
      ]
    },
    'repairs-history': {
      title: 'Historial de Reparaciones',
      generatedAt: new Date().toISOString(),
      filters: { startDate, endDate },
      repairs: [
        {
          assetId: 3,
          assetName: 'Notebook HP ProBook 450',
          serialNumber: 'HP450-654321',
          sentDate: '2025-01-10T09:45:00Z',
          returnDate: '2025-01-25T14:30:00Z',
          provider: 'Servicio Técnico HP',
          issue: 'Falla en teclado',
          resolution: 'Reemplazo de teclado',
          status: 'Reparado',
          cost: '$150.00'
        }
      ]
    },
    'low-stock': {
      title: 'Consumibles Bajo Mínimo',
      generatedAt: new Date().toISOString(),
      consumables: [
        {
          id: 10,
          name: 'Toner HP 85A',
          category: 'Consumibles',
          subcategory: 'Toner',
          currentStock: 2,
          minimumThreshold: 5,
          lastRestock: '2025-02-01T10:00:00Z'
        },
        {
          id: 12,
          name: 'Cargador Notebook Dell',
          category: 'Consumibles',
          subcategory: 'Cargadores',
          currentStock: 1,
          minimumThreshold: 3,
          lastRestock: '2025-01-15T11:30:00Z'
        }
      ]
    },
    'asset-history': {
      title: 'Historial de Activo',
      generatedAt: new Date().toISOString(),
      assetId: req.query.assetId || '1',
      assetDetails: {
        name: 'Notebook Dell Latitude 7400',
        category: 'Computadoras',
        serialNumber: 'DL7400-123456',
        status: 'Asignado'
      },
      history: [
        {
          date: '2025-01-15T10:30:45Z',
          action: 'Entrada de Stock',
          user: 'Admin',
          details: 'Recepción inicial del equipo'
        },
        {
          date: '2025-02-10T09:15:00Z',
          action: 'Envío a Reparación',
          user: 'Soporte1',
          details: 'Falla en pantalla - enviado a Dell'
        },
        {
          date: '2025-02-25T14:30:00Z',
          action: 'Retorno de Reparación',
          user: 'Soporte2',
          details: 'Reemplazo de pantalla completo'
        },
        {
          date: '2025-03-20T14:22:10Z',
          action: 'Asignación',
          user: 'Admin',
          details: 'Asignado a Juan Pérez'
        }
      ]
    }
  };
  
  res.json({
    status: 'success',
    message: `Reporte ${reportId} generado exitosamente`,
    data: reportData[reportId],
    format: format || 'json'
  });
});

module.exports = router;
