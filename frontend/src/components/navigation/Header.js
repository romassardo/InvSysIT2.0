import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import { useTheme } from '../../context/ThemeContext';
import Icon from '../ui/Icon';

// Estilos según la guía de diseño UI
const HeaderContainer = styled.header`
  height: 70px;
  background-color: var(--card-bg);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 var(--spacing-xl);
  box-shadow: var(--shadow-sm);
`;

const SearchBar = styled.div`
  position: relative;
  width: 400px;
  
  input {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    padding-left: calc(var(--spacing-md) * 2.5);
    border-radius: var(--border-radius-full);
    border: 1px solid rgba(0, 0, 0, 0.1);
    background-color: var(--background);
    font-family: 'Nunito', sans-serif;
    font-size: 0.9rem;
    transition: all 0.2s;
    
    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-light);
    }
  }
  
  svg {
    position: absolute;
    left: var(--spacing-sm);
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
  }
`;

const HeaderActions = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const ActionButton = styled.button`
  position: relative;
  background: none;
  border: none;
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--text-secondary);
  transition: all 0.2s;
  
  &:hover {
    background-color: var(--primary-light);
    color: var(--primary);
  }
`;

const NotificationBadge = styled.span`
  position: absolute;
  top: -5px;
  right: -5px;
  background-color: var(--accent);
  color: white;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: var(--border-radius-full);
  min-width: 18px;
  height: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserProfile = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-xs) var(--spacing-sm);
  border-radius: var(--border-radius-md);
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: var(--primary-light);
  }
`;

const UserAvatar = styled.div`
  width: 40px;
  height: 40px;
  border-radius: var(--border-radius-full);
  background-color: var(--primary);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
`;

const UserInfo = styled.div`
  display: flex;
  flex-direction: column;
  
  span:first-child {
    font-weight: 600;
    color: var(--text-primary);
  }
  
  span:last-child {
    font-size: 0.8rem;
    color: var(--text-muted);
  }
`;

const DropdownMenu = styled.div`
  position: absolute;
  top: 55px;
  right: var(--spacing-xl);
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  min-width: 200px;
  z-index: 100;
  overflow: hidden;
  transition: all 0.3s;
`;

const DropdownItem = styled(Link)`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  padding: var(--spacing-sm) var(--spacing-md);
  color: var(--text-primary);
  text-decoration: none;
  transition: all 0.2s;
  
  &:hover {
    background-color: var(--primary-light);
    color: var(--primary);
    text-decoration: none;
  }
  
  svg {
    color: var(--text-muted);
  }
  
  &:hover svg {
    color: var(--primary);
  }
`;

// Estilos para los resultados de búsqueda
const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  max-height: 350px;
  overflow-y: auto;
  background-color: var(--card-bg);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  margin-top: var(--spacing-xs);
  z-index: 1000;
`;

const SearchResultItem = styled.div`
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s;
  
  &:hover {
    background-color: var(--primary-light);
  }
  
  &:last-child {
    border-bottom: none;
  }
`;

const ResultIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--border-radius-sm);
  background-color: var(--primary-light);
  color: var(--primary);
  margin-right: var(--spacing-sm);
`;

const ResultContent = styled.div`
  flex: 1;
`;

const ResultTitle = styled.div`
  font-weight: 600;
  font-size: 0.9rem;
  color: var(--text-primary);
`;

const ResultDescription = styled.div`
  font-size: 0.8rem;
  color: var(--text-muted);
`;

const NoResultsMessage = styled.div`
  padding: var(--spacing-md);
  text-align: center;
  color: var(--text-muted);
  font-size: 0.9rem;
`;

// Estilos para el panel de notificaciones
const NotificationsPanel = styled.div`
  position: absolute;
  top: 55px;
  right: var(--spacing-lg);
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  width: 350px;
  max-height: 400px;
  overflow-y: auto;
  z-index: 100;
`;

const NotificationHeader = styled.div`
  padding: var(--spacing-sm) var(--spacing-md);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  display: flex;
  justify-content: space-between;
  align-items: center;
  
  h3 {
    font-size: 1rem;
    font-weight: 700;
    margin: 0;
  }
  
  button {
    background: none;
    border: none;
    color: var(--primary);
    cursor: pointer;
    font-size: 0.8rem;
    padding: 0;
    
    &:hover {
      text-decoration: underline;
    }
  }
`;

const NotificationItem = styled.div`
  padding: var(--spacing-md);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  cursor: pointer;
  transition: background-color 0.2s;
  position: relative;
  ${props => !props.read && `
    &::before {
      content: '';
      position: absolute;
      left: 0;
      top: 0;
      bottom: 0;
      width: 3px;
      background-color: var(--${props.type === 'warning' ? 'warning' : props.type === 'success' ? 'success' : 'primary'});
    }
  `}
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
  
  &:last-child {
    border-bottom: none;
  }
  
  h4 {
    font-size: 0.95rem;
    margin: 0 0 var(--spacing-xs) 0;
    color: var(--text-primary);
  }
  
  p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-secondary);
  }
  
  .time {
    font-size: 0.75rem;
    color: var(--text-muted);
    margin-top: var(--spacing-xs);
  }
`;

const Header = ({ user }) => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  const searchRef = useRef(null);
  const notificationsRef = useRef(null);
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  
  // Datos simulados para la búsqueda
  const mockData = [
    { id: 1, title: 'Notebook Dell Latitude 7400', description: 'Activo - Computadoras/Notebooks', type: 'asset', category: 'Computadoras' },
    { id: 2, title: 'iPhone 13 Pro', description: 'Activo - Celulares', type: 'asset', category: 'Celulares' },
    { id: 3, title: 'Teclado Logitech MX Keys', description: 'Activo - Periféricos/Teclados', type: 'asset', category: 'Periféricos' },
    { id: 4, title: 'Juan Pérez', description: 'Empleado - Sistemas', type: 'employee', department: 'Sistemas' },
    { id: 5, title: 'María González', description: 'Empleado - Administración', type: 'employee', department: 'Administración' },
    { id: 6, title: 'Sucursal Central', description: 'Sucursal - Buenos Aires', type: 'branch', location: 'Buenos Aires' },
    { id: 7, title: 'Sucursal Norte', description: 'Sucursal - Córdoba', type: 'branch', location: 'Córdoba' }
  ];
  
  // Manejador de cambio en el campo de búsqueda
  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    // Filtrar resultados según el término de búsqueda
    const filtered = mockData.filter(item => 
      item.title.toLowerCase().includes(term.toLowerCase()) ||
      item.description.toLowerCase().includes(term.toLowerCase())
    );
    
    setSearchResults(filtered);
  };
  
  // Limpiar la búsqueda
  const clearSearch = () => {
    setSearchTerm('');
    setSearchResults([]);
    setShowResults(false);
  };
  
  // Manejar clic en un resultado
  const handleResultClick = (result) => {
    switch(result.type) {
      case 'asset':
        navigate(`/inventory/asset/${result.id}`);
        break;
      case 'employee':
        navigate(`/inventory/assigned?employee=${result.id}`);
        break;
      case 'branch':
        navigate(`/inventory/assigned?branch=${result.id}`);
        break;
      default:
        navigate('/inventory');
    }
    
    clearSearch();
  };
  
  // Obtener icono según el tipo de resultado
  const getIconForResult = (result) => {
    switch(result.type) {
      case 'asset':
        if (result.category === 'Computadoras') return 'Laptop';
        if (result.category === 'Celulares') return 'Smartphone';
        if (result.category === 'Periféricos') return 'Monitor';
        return 'Box';
      case 'employee':
        return 'User';
      case 'branch':
        return 'MapPin';
      default:
        return 'Search';
    }
  };
  
  // Cerrar resultados al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowResults(false);
      }
      if (notificationsRef.current && !notificationsRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  
  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
    setShowNotifications(false);
  };
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    setShowDropdown(false);
  };
  
  // Notificaciones de ejemplo
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: 'Notebook Dell asignada',
      message: 'Se ha asignado una notebook a Juan Pérez',
      time: '10 minutos',
      read: false,
      type: 'info'
    },
    {
      id: 2,
      title: 'Stock bajo',
      message: 'Toners HP 85A están por debajo del stock mínimo',
      time: '1 hora',
      read: false,
      type: 'warning'
    },
    {
      id: 3,
      title: 'Reparación completada',
      message: 'La reparación de la impresora HP LaserJet ha sido completada',
      time: '3 horas',
      read: false,
      type: 'success'
    }
  ]);
  
  // Función para marcar todas las notificaciones como leídas
  const markAllAsRead = () => {
    const updatedNotifications = notifications.map(notification => ({
      ...notification,
      read: true
    }));
    setNotifications(updatedNotifications);
    setNotificationCount(0);
  };
  
  // Función para marcar una notificación como leída
  const markAsRead = (id) => {
    const updatedNotifications = notifications.map(notification =>
      notification.id === id ? { ...notification, read: true } : notification
    );
    setNotifications(updatedNotifications);
    
    // Actualizar el contador de notificaciones
    const unreadCount = updatedNotifications.filter(n => !n.read).length;
    setNotificationCount(unreadCount);
  };
  
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };
  
  return (
    <HeaderContainer>
      <SearchBar>
        <FeatherIcon icon="search" size={16} />
        <input 
          type="text" 
          placeholder="Buscar activos, empleados, sucursales..." 
          value={searchTerm}
          onChange={handleSearchChange}
          onFocus={() => setShowResults(true)}
        />
        {searchTerm && (
          <button 
            type="button" 
            onClick={clearSearch}
            style={{ 
              position: 'absolute', 
              right: '10px', 
              top: '50%',
              transform: 'translateY(-50%)',
              background: 'none', 
              border: 'none', 
              cursor: 'pointer',
              display: 'flex', 
              alignItems: 'center'
            }}
          >
            <Icon name="X" size={16} />
          </button>
        )}
        
        {/* Resultados de búsqueda */}
        {showResults && searchTerm.trim() !== '' && (
          <SearchResults>
            {searchResults.length > 0 ? (
              <>
                {searchResults.map((result, index) => (
                  <SearchResultItem 
                    key={`${result.type}-${index}`}
                    onClick={() => handleResultClick(result)}
                  >
                    <ResultIcon>
                      <Icon name={getIconForResult(result)} size={16} />
                    </ResultIcon>
                    <ResultContent>
                      <ResultTitle>{result.title}</ResultTitle>
                      <ResultDescription>{result.description}</ResultDescription>
                    </ResultContent>
                  </SearchResultItem>
                ))}
              </>
            ) : (
              <NoResultsMessage>
                No se encontraron resultados para "{searchTerm}"
              </NoResultsMessage>
            )}
          </SearchResults>
        )}
      </SearchBar>
      
      <HeaderActions>
        <div ref={notificationsRef} style={{ position: 'relative' }}>
          <ActionButton 
            title="Notificaciones" 
            onClick={toggleNotifications}
          >
            <FeatherIcon icon="bell" size={20} />
            {notificationCount > 0 && (
              <NotificationBadge>{notificationCount}</NotificationBadge>
            )}
          </ActionButton>
          
          {showNotifications && (
            <NotificationsPanel>
              <NotificationHeader>
                <h3>Notificaciones</h3>
                <button onClick={markAllAsRead}>Marcar todas como leídas</button>
              </NotificationHeader>
              
              {notifications.filter(notification => !notification.read).length > 0 ? (
                notifications
                  .filter(notification => !notification.read)
                  .map(notification => (
                    <NotificationItem 
                      key={notification.id} 
                      read={notification.read}
                      type={notification.type}
                      onClick={() => markAsRead(notification.id)}
                    >
                      <h4>{notification.title}</h4>
                      <p>{notification.message}</p>
                      <div className="time">Hace {notification.time}</div>
                    </NotificationItem>
                  ))
              ) : (
                <div style={{ 
                  padding: 'var(--spacing-md)', 
                  color: 'var(--text-muted)',
                  textAlign: 'center',
                  fontSize: '0.9rem'
                }}>
                  No tienes notificaciones nuevas
                </div>
              )}
            </NotificationsPanel>
          )}
        </div>
        
        <ActionButton title="Cambiar tema" onClick={toggleTheme}>
          <FeatherIcon icon={theme === 'light' ? 'moon' : 'sun'} size={20} />
        </ActionButton>
        
        <UserProfile onClick={toggleDropdown}>
          <UserAvatar>
            {getInitials(user?.name)}
          </UserAvatar>
          
          <UserInfo>
            <span>{user?.name || 'Usuario'}</span>
            <span>{user?.role === 'admin' ? 'Administrador' : 'Usuario'}</span>
          </UserInfo>
        </UserProfile>
      </HeaderActions>
      
      {showDropdown && (
        <DropdownMenu>
          <DropdownItem to="/profile">
            <FeatherIcon icon="user" size={16} />
            Mi Perfil
          </DropdownItem>
          
          <DropdownItem to="/settings">
            <FeatherIcon icon="settings" size={16} />
            Configuración
          </DropdownItem>
          
          <DropdownItem to="/login" onClick={(e) => {
            e.preventDefault();
            // Aquí manejaríamos el logout
            window.location.href = '/login';
          }}>
            <FeatherIcon icon="log-out" size={16} />
            Cerrar Sesión
          </DropdownItem>
        </DropdownMenu>
      )}
    </HeaderContainer>
  );
};

export default Header;
