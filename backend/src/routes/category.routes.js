 // Rutas para gestión de categorías y subcategorías
const express = require('express');
const router = express.Router();

// Obtener todas las categorías y subcategorías
router.get('/', (req, res) => {
  // Implementación simulada con la estructura definida en los requisitos
  res.json({
    status: 'success',
    message: 'Categorías recuperadas exitosamente',
    data: [
      {
        id: 1,
        name: 'Computadoras',
        subcategories: [
          { id: 101, name: 'Desktops' },
          { id: 102, name: 'Notebooks' },
          { id: 103, name: 'Raspberry Pi' }
        ]
      },
      {
        id: 2,
        name: 'Celulares',
        subcategories: []
      },
      {
        id: 3,
        name: 'Periféricos',
        subcategories: [
          { id: 301, name: 'Teclados' },
          { id: 302, name: 'Mouse' },
          { id: 303, name: 'Kit Teclado/Mouse' },
          { id: 304, name: 'Auriculares' },
          { id: 305, name: 'Webcams' },
          { id: 306, name: 'Monitores' },
          { id: 307, name: 'Televisores' }
        ]
      },
      {
        id: 4,
        name: 'Consumibles',
        subcategories: [
          { id: 401, name: 'Cables' },
          { id: 402, name: 'Pilas' },
          { id: 403, name: 'Toner' },
          { id: 404, name: 'Drum (Unidad de Imagen)' },
          { id: 405, name: 'Cargadores' }
        ]
      },
      {
        id: 5,
        name: 'Componentes',
        subcategories: [
          { id: 501, name: 'Memorias RAM' },
          { id: 502, name: 'Discos Externos' },
          { id: 503, name: 'Discos SSD/NVMe' },
          { id: 504, name: 'Placas Sending' },
          { id: 505, name: 'Placas de Video' },
          { id: 506, name: 'Motherboards' },
          { id: 507, name: 'Adaptadores USB Varios' }
        ]
      }
    ]
  });
});

// Crear nueva categoría
router.post('/', (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({
      status: 'error',
      message: 'El nombre de la categoría es obligatorio'
    });
  }
  
  res.status(201).json({
    status: 'success',
    message: 'Categoría creada exitosamente',
    data: {
      id: 6,
      name,
      subcategories: []
    }
  });
});

// Crear nueva subcategoría
router.post('/:categoryId/subcategories', (req, res) => {
  const { categoryId } = req.params;
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({
      status: 'error',
      message: 'El nombre de la subcategoría es obligatorio'
    });
  }
  
  res.status(201).json({
    status: 'success',
    message: 'Subcategoría creada exitosamente',
    data: {
      id: 601,
      categoryId: parseInt(categoryId),
      name
    }
  });
});

// Actualizar categoría
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({
      status: 'error',
      message: 'El nombre de la categoría es obligatorio'
    });
  }
  
  res.json({
    status: 'success',
    message: 'Categoría actualizada exitosamente',
    data: {
      id: parseInt(id),
      name,
      // Mantenemos las subcategorías existentes en una implementación real
      subcategories: []
    }
  });
});

// Actualizar subcategoría
router.put('/:categoryId/subcategories/:id', (req, res) => {
  const { categoryId, id } = req.params;
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({
      status: 'error',
      message: 'El nombre de la subcategoría es obligatorio'
    });
  }
  
  res.json({
    status: 'success',
    message: 'Subcategoría actualizada exitosamente',
    data: {
      id: parseInt(id),
      categoryId: parseInt(categoryId),
      name
    }
  });
});

// Eliminar categoría (solo si no tiene activos asociados)
router.delete('/:id', (req, res) => {
  res.json({
    status: 'success',
    message: 'Categoría eliminada exitosamente'
  });
});

// Eliminar subcategoría (solo si no tiene activos asociados)
router.delete('/:categoryId/subcategories/:id', (req, res) => {
  res.json({
    status: 'success',
    message: 'Subcategoría eliminada exitosamente'
  });
});

module.exports = router;
