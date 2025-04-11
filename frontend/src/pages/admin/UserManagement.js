import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FeatherIcon from 'feather-icons-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { userService } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const UserTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  
  th, td {
    padding: var(--spacing-sm) var(--spacing-md);
    text-align: left;
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
  
  th {
    font-weight: 600;
    color: var(--text-secondary);
    background-color: rgba(0, 0, 0, 0.02);
  }
  
  tr:hover td {
    background-color: rgba(0, 0, 0, 0.01);
  }
`;

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();
  
  // Cargar usuarios desde la API
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await userService.getAll();
        
        // Transformar datos si es necesario
        const formattedUsers = response.data.map(user => ({
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role === 'admin' ? 'Administrador' : 
               user.role === 'technician' ? 'Técnico' : 'Usuario',
          department: user.department || 'No asignado',
          status: user.active ? 'Activo' : 'Inactivo',
          lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleString() : 'Nunca'
        }));
        
        setUsers(formattedUsers);
        setError(null);
      } catch (error) {
        console.error('Error al cargar usuarios:', error);
        setError('No se pudieron cargar los usuarios');
        showNotification('Error al cargar los usuarios', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchUsers();
  }, [showNotification]);

  // Función para activar/desactivar usuario
  const handleToggleStatus = async (userId, currentStatus) => {
    try {
      if (window.confirm(`¿Está seguro que desea ${currentStatus === 'Activo' ? 'desactivar' : 'activar'} este usuario?`)) {
        await userService[currentStatus === 'Activo' ? 'deactivate' : 'activate'](userId);
        
        // Actualizar usuario en la lista local
        const updatedUsers = users.map(user => {
          if (user.id === userId) {
            return {
              ...user,
              status: currentStatus === 'Activo' ? 'Inactivo' : 'Activo'
            };
          }
          return user;
        });
        
        setUsers(updatedUsers);
        showNotification(`Usuario ${currentStatus === 'Activo' ? 'desactivado' : 'activado'} correctamente`, 'success');
      }
    } catch (error) {
      console.error('Error al actualizar estado del usuario:', error);
      showNotification('Error al actualizar el estado del usuario', 'error');
    }
  };
  
  // Función para editar usuario (redirige a página de edición)
  const handleEditUser = (userId) => {
    window.location.href = `/admin/users/edit/${userId}`;
  };
  
  // Función para crear nuevo usuario (redirige a página de creación)
  const handleAddUser = () => {
    window.location.href = '/admin/users/new';
  };

  return (
    <div>
      <PageHeader>
        <PageTitle>
          <FeatherIcon icon="users" size={24} color="var(--primary)" />
          Gestión de Usuarios
        </PageTitle>
        
        <Button variant="primary" icon="user-plus" onClick={handleAddUser}>
          Nuevo Usuario
        </Button>
      </PageHeader>
      
      <Card>
        {loading ? (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 'var(--spacing-lg)' }}>
            <FeatherIcon icon="loader" size={32} className="spin" />
          </div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: 'var(--spacing-lg)', color: 'var(--danger)' }}>
            <FeatherIcon icon="alert-triangle" size={24} />
            <p>{error}</p>
            <Button variant="primary" onClick={() => window.location.reload()}>
              Reintentar
            </Button>
          </div>
        ) : (
          <UserTable>
            <thead>
            <tr>
              <th>Usuario</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Departamento</th>
              <th>Estado</th>
              <th>Último Acceso</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>
                  <span style={{ 
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: 'var(--border-radius-sm)',
                    fontSize: '0.85rem',
                    backgroundColor: user.role === 'Administrador' ? 'var(--primary-light)' : 'var(--gray-light)',
                    color: user.role === 'Administrador' ? 'var(--primary)' : 'var(--text-secondary)'
                  }}>
                    {user.role}
                  </span>
                </td>
                <td>{user.department}</td>
                <td>
                  <span style={{ 
                    display: 'inline-block',
                    padding: '2px 8px',
                    borderRadius: 'var(--border-radius-sm)',
                    fontSize: '0.85rem',
                    backgroundColor: user.status === 'Activo' ? 'var(--success-light)' : 'var(--danger-light)',
                    color: user.status === 'Activo' ? 'var(--success)' : 'var(--danger)'
                  }}>
                    {user.status}
                  </span>
                </td>
                <td>{user.lastLogin}</td>
                <td>
                  <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                    <Button 
                      variant="icon" 
                      title="Editar usuario"
                    >
                      <FeatherIcon icon="edit-2" size={16} />
                    </Button>
                    
                    <Button 
                      variant="icon" 
                      title="Cambiar contraseña"
                    >
                      <FeatherIcon icon="key" size={16} />
                    </Button>
                    
                    {user.status === 'Activo' ? (
                      <Button 
                        variant="icon" 
                        title="Desactivar usuario"
                      >
                        <FeatherIcon icon="user-x" size={16} />
                      </Button>
                    ) : (
                      <Button 
                        variant="icon" 
                        title="Activar usuario"
                      >
                        <FeatherIcon icon="user-check" size={16} />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </UserTable>
        )}
      </Card>
    </div>
  );
};

export default UserManagement;
