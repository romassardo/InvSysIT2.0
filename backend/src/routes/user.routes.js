// Rutas para la gestión de usuarios
const express = require('express');
const router = express.Router();

// Obtener todos los usuarios (solo disponible para administradores)
router.get('/', (req, res) => {
  // En una implementación real, aquí verificaríamos permisos
  
  // Respuesta simulada
  res.json({
    status: 'success',
    message: 'Usuarios recuperados exitosamente',
    data: {
      users: [
        {
          id: 1,
          username: 'admin',
          name: 'Administrador',
          role: 'admin',
          email: 'admin@example.com',
          lastLogin: '2025-04-04T14:30:45Z'
        },
        {
          id: 2,
          username: 'soporte1',
          name: 'Técnico de Soporte 1',
          role: 'user',
          email: 'soporte1@example.com',
          lastLogin: '2025-04-03T09:15:22Z'
        }
      ]
    }
  });
});

// Obtener perfil de usuario actual
router.get('/profile', (req, res) => {
  // En implementación real, obtendríamos el ID del usuario desde el token JWT
  
  // Respuesta simulada del perfil del usuario actual
  res.json({
    status: 'success',
    message: 'Perfil recuperado exitosamente',
    data: {
      id: 1,
      username: 'admin',
      name: 'Administrador',
      role: 'admin',
      email: 'admin@example.com',
      settings: {
        theme: 'light',
        notifications: true
      },
      pendingTasks: [
        {
          id: 1,
          description: 'Revisar niveles de stock de toners',
          dueDate: '2025-04-10T00:00:00Z'
        }
      ]
    }
  });
});

// Obtener un usuario específico por ID (solo para administradores)
router.get('/:id', (req, res) => {
  const { id } = req.params;
  
  // Verificar que el ID es un número
  if (isNaN(parseInt(id))) {
    return res.status(400).json({
      status: 'error',
      message: 'ID de usuario inválido'
    });
  }
  
  // Respuesta simulada
  res.json({
    status: 'success',
    message: 'Usuario recuperado exitosamente',
    data: {
      id: parseInt(id),
      username: 'soporte1',
      name: 'Técnico de Soporte 1',
      role: 'user',
      email: 'soporte1@example.com',
      lastLogin: '2025-04-03T09:15:22Z',
      createdAt: '2024-10-15T10:00:00Z',
      createdBy: 'admin'
    }
  });
});

// Actualizar un usuario (para administradores, o el propio usuario para sus datos)
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  
  // Validación básica
  if (!name) {
    return res.status(400).json({
      status: 'error',
      message: 'El nombre es obligatorio'
    });
  }
  
  // Respuesta simulada
  res.json({
    status: 'success',
    message: 'Usuario actualizado exitosamente',
    data: {
      id: parseInt(id),
      name,
      email,
      lastUpdated: new Date().toISOString()
    }
  });
});

// Cambiar rol de usuario (solo para administradores)
router.put('/:id/role', (req, res) => {
  const { id } = req.params;
  const { role } = req.body;
  
  if (!role || !['admin', 'user'].includes(role)) {
    return res.status(400).json({
      status: 'error',
      message: 'Rol inválido. Los roles permitidos son: admin, user'
    });
  }
  
  res.json({
    status: 'success',
    message: 'Rol de usuario actualizado exitosamente',
    data: {
      id: parseInt(id),
      role,
      lastUpdated: new Date().toISOString()
    }
  });
});

// Eliminar usuario (solo para administradores)
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  
  // En una implementación real, verificaríamos que no se elimine el último administrador
  
  res.json({
    status: 'success',
    message: 'Usuario eliminado exitosamente'
  });
});

module.exports = router;
