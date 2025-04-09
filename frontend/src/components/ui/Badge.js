import React from 'react';
import styled from 'styled-components';

const BadgeContainer = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  border-radius: var(--border-radius-full);
  font-size: 0.85rem;
  font-weight: 600;
  max-width: 100%;
  white-space: nowrap;
  
  /* Variante de color */
  background-color: ${props => {
    switch (props.variant) {
      case 'success': return 'var(--secondary-light)';
      case 'warning': return 'var(--warning-light)';
      case 'danger': return 'var(--danger-light)';
      case 'info': return 'rgba(3, 169, 244, 0.1)';
      default: return 'var(--primary-light)';
    }
  }};
  
  color: ${props => {
    switch (props.variant) {
      case 'success': return 'var(--secondary)';
      case 'warning': return 'var(--warning)';
      case 'danger': return 'var(--danger)';
      case 'info': return '#0288D1';
      default: return 'var(--primary)';
    }
  }};
`;

const BadgeIcon = styled.span`
  margin-right: 6px;
  display: flex;
  align-items: center;
`;

/**
 * Componente Badge para mostrar estados o etiquetas
 * @param {string} variant - Variante de color (default, success, warning, danger, info)
 * @param {React.ReactNode} icon - Icono opcional para mostrar antes del texto
 * @param {React.ReactNode} children - Texto del badge
 */
const Badge = ({ 
  variant = 'default', 
  icon = null, 
  children,
  className = ''
}) => {
  return (
    <BadgeContainer variant={variant} className={className}>
      {icon && <BadgeIcon>{icon}</BadgeIcon>}
      {children}
    </BadgeContainer>
  );
};

export default Badge;
