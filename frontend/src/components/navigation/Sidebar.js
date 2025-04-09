import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import Icon from '../../components/ui/Icon';

// Estilos según la guía de diseño UI
const SidebarContainer = styled.aside`
  width: 260px;
  min-height: 100vh;
  background-image: ${props => props.theme === 'light' 
    ? 'linear-gradient(to bottom, var(--primary), #4527A0)' 
    : 'linear-gradient(to bottom, #9D4EDD, #3A0CA3)'};
  color: white;
  display: flex;
  flex-direction: column;
  box-shadow: var(--shadow-lg);
  z-index: 10;
  transition: background-image 0.3s ease;
`;

const Logo = styled.div`
  padding: var(--spacing-lg);
  display: flex;
  align-items: center;
  margin-bottom: var(--spacing-md);
  
  h1 {
    font-size: 1.5rem;
    font-weight: 800;
    margin: 0;
  }
`;

const NavSection = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const NavLabel = styled.div`
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: 700;
  opacity: 0.7;
  padding: 0 var(--spacing-lg);
  margin-bottom: var(--spacing-xs);
  letter-spacing: 0.5px;
`;

const NavMenu = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`;

const NavItem = styled.li`
  margin-bottom: 2px;
`;

const StyledNavLink = styled(Link)`
  display: flex;
  align-items: center;
  padding: var(--spacing-sm) var(--spacing-lg);
  color: white;
  text-decoration: none;
  transition: background-color 0.2s;
  border-radius: 0 var(--border-radius-sm) var(--border-radius-sm) 0;
  margin-right: var(--spacing-sm);
  
  &:hover {
    background-color: rgba(255, 255, 255, 0.1);
    text-decoration: none;
  }
  
  &.active {
    background-color: rgba(255, 255, 255, 0.2);
    font-weight: 700;
  }
  
  span {
    margin-left: var(--spacing-sm);
  }
`;

const NavIcon = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

const SidebarFooter = styled.div`
  margin-top: auto;
  padding: var(--spacing-lg);
  opacity: 0.7;
  font-size: 0.85rem;
  text-align: center;
`;

const Sidebar = () => {
  const { logout, currentUser } = useAuth();
  const { theme } = useTheme();
  const location = useLocation();
  
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };
  
  return (
    <SidebarContainer theme={theme}>
      <Logo>
        <h1>InvSysIT</h1>
      </Logo>
      
      <NavSection>
        <NavLabel>Principal</NavLabel>
        <NavMenu>
          <NavItem>
            <StyledNavLink to="/" className={isActive('/') ? 'active' : ''}>
              <NavIcon><Icon name="Grid" size={20} /></NavIcon>
              <span>Dashboard</span>
            </StyledNavLink>
          </NavItem>
          
          <NavItem>
            <StyledNavLink to="/inventory" className={isActive('/inventory') ? 'active' : ''}>
              <NavIcon><Icon name="Box" size={20} /></NavIcon>
              <span>Inventario</span>
            </StyledNavLink>
          </NavItem>
          
          <NavItem>
            <StyledNavLink to="/inventory/assigned" className={isActive('/inventory/assigned') ? 'active' : ''}>
              <NavIcon><Icon name="UserCheck" size={20} /></NavIcon>
              <span>Asignados</span>
            </StyledNavLink>
          </NavItem>
          
          <NavItem>
            <StyledNavLink to="/inventory/in-repair" className={isActive('/inventory/in-repair') ? 'active' : ''}>
              <NavIcon><Icon name="Tool" size={20} /></NavIcon>
              <span>En Reparación</span>
            </StyledNavLink>
          </NavItem>
          
          <NavItem>
            <StyledNavLink to="/inventory/low-stock" className={isActive('/inventory/low-stock') ? 'active' : ''}>
              <NavIcon><Icon name="AlertTriangle" size={20} /></NavIcon>
              <span>Stock Bajo</span>
            </StyledNavLink>
          </NavItem>
          
          <NavItem>
            <StyledNavLink to="/inventory/movements" className={isActive('/inventory/movements') ? 'active' : ''}>
              <NavIcon><Icon name="RefreshCw" size={20} /></NavIcon>
              <span>Movimientos</span>
            </StyledNavLink>
          </NavItem>
        </NavMenu>
      </NavSection>
      
      <NavSection>
        <NavLabel>Reportes</NavLabel>
        <NavMenu>
          <NavItem>
            <StyledNavLink to="/reports" className={isActive('/reports') ? 'active' : ''}>
              <NavIcon><Icon name="FileText" size={20} /></NavIcon>
              <span>Informes</span>
            </StyledNavLink>
          </NavItem>
        </NavMenu>
      </NavSection>
      
      {/* Sección de administración solo visible para administradores */}
      {currentUser && currentUser.role === 'admin' && (
        <NavSection>
          <NavLabel>Administración</NavLabel>
          <NavMenu>
            <NavItem>
              <StyledNavLink to="/admin/users" className={isActive('/admin/users') ? 'active' : ''}>
                <NavIcon><Icon name="Users" size={20} /></NavIcon>
                <span>Usuarios</span>
              </StyledNavLink>
            </NavItem>
            
            <NavItem>
              <StyledNavLink to="/admin/categories" className={isActive('/admin/categories') ? 'active' : ''}>
                <NavIcon><Icon name="List" size={20} /></NavIcon>
                <span>Categorías</span>
              </StyledNavLink>
            </NavItem>
          </NavMenu>
        </NavSection>
      )}
      
      <NavSection>
        <NavLabel>Usuario</NavLabel>
        <NavMenu>
          <NavItem>
            <StyledNavLink to="/profile" className={isActive('/profile') ? 'active' : ''}>
              <NavIcon><Icon name="User" size={20} /></NavIcon>
              <span>Mi Perfil</span>
            </StyledNavLink>
          </NavItem>
          
          <NavItem>
            <StyledNavLink to="/login" onClick={(e) => {
              e.preventDefault();
              logout();
            }}>
              <NavIcon><Icon name="LogOut" size={20} /></NavIcon>
              <span>Cerrar Sesión</span>
            </StyledNavLink>
          </NavItem>
        </NavMenu>
      </NavSection>
      
      <SidebarFooter>
        <p>InvSysIT v1.0.0</p>
        <small>© 2025 - Soporte IT</small>
      </SidebarFooter>
    </SidebarContainer>
  );
};

export default Sidebar;
