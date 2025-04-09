import React, { useState } from 'react';
import styled from 'styled-components';
import FeatherIcon from 'feather-icons-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

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
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Rodrigo Pérez',
      email: 'rodrigo.perez@empresa.com',
      role: 'Administrador',
      department: 'IT',
      status: 'Activo',
      lastLogin: '2025-04-04 15:30'
    },
    {
      id: 2,
      name: 'María González',
      email: 'maria.gonzalez@empresa.com',
      role: 'Técnico',
      department: 'Soporte',
      status: 'Activo',
      lastLogin: '2025-04-04 14:15'
    },
    {
      id: 3,
      name: 'Juan Rodríguez',
      email: 'juan.rodriguez@empresa.com',
      role: 'Técnico',
      department: 'Soporte',
      status: 'Activo',
      lastLogin: '2025-04-03 09:45'
    },
    {
      id: 4,
      name: 'Ana Martínez',
      email: 'ana.martinez@empresa.com',
      role: 'Usuario',
      department: 'Administración',
      status: 'Inactivo',
      lastLogin: '2025-03-28 11:20'
    }
  ]);

  return (
    <div>
      <PageHeader>
        <PageTitle>
          <FeatherIcon icon="users" size={24} color="var(--primary)" />
          Gestión de Usuarios
        </PageTitle>
        
        <Button variant="primary" icon="user-plus">
          Nuevo Usuario
        </Button>
      </PageHeader>
      
      <Card>
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
      </Card>
    </div>
  );
};

export default UserManagement;
