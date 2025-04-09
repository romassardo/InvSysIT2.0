import React from 'react';
import styled from 'styled-components';
import Icon from './Icon';

const CardContainer = styled.div`
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  padding: 1.5rem;
  position: relative;
  overflow: hidden;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-lg);
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background-color: ${props => {
      switch (props.variant) {
        case 'primary': return 'var(--primary)';
        case 'secondary': return 'var(--secondary)';
        case 'warning': return 'var(--warning)';
        case 'danger': return 'var(--danger)';
        default: return 'var(--primary)';
      }
    }};
  }
`;

const CardHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
`;

const IconContainer = styled.div`
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: ${props => {
    switch (props.variant) {
      case 'primary': return 'var(--primary-light)';
      case 'secondary': return 'var(--secondary-light)';
      case 'warning': return 'var(--warning-light)';
      case 'danger': return 'var(--danger-light)';
      default: return 'var(--primary-light)';
    }
  }};
  color: ${props => {
    switch (props.variant) {
      case 'primary': return 'var(--primary)';
      case 'secondary': return 'var(--secondary)';
      case 'warning': return 'var(--warning)';
      case 'danger': return 'var(--danger)';
      default: return 'var(--primary)';
    }
  }};
`;

const TrendContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 4px 8px;
  border-radius: var(--border-radius-sm);
  font-size: 0.85rem;
  font-weight: 600;
  background-color: ${props => props.trend === 'up' ? 'var(--secondary-light)' : 'var(--danger-light)'};
  color: ${props => props.trend === 'up' ? 'var(--secondary)' : 'var(--danger)'};
`;

const TrendIcon = styled.span`
  margin-right: 4px;
  display: flex;
  align-items: center;
`;

const StatValue = styled.div`
  font-size: 2rem;
  font-weight: 800;
  color: var(--text-primary);
  margin-bottom: var(--spacing-xs);
`;

const StatLabel = styled.div`
  font-size: 0.95rem;
  color: var(--text-secondary);
  font-weight: 400;
`;

/**
 * Componente StatCard para mostrar estadísticas con valor y tendencia
 * @param {string} variant - Variante de color (primary, secondary, warning, danger)
 * @param {React.ReactNode} icon - Icono para mostrar
 * @param {string} value - Valor numérico a mostrar
 * @param {string} label - Etiqueta descriptiva
 * @param {string} trend - Tendencia (up, down)
 * @param {string} change - Porcentaje o valor de cambio
 */
const StatCard = ({
  variant = 'primary',
  icon,
  value,
  label,
  trend,
  change,
  className = ''
}) => {
  // Función para renderizar el icono
  const renderIcon = () => {
    if (!icon) return <Icon name="Box" size={24} />;
    
    if (typeof icon === 'string') {
      // Primera letra en mayúscula para react-feather
      const iconName = icon.charAt(0).toUpperCase() + icon.slice(1);
      return <Icon name={iconName} size={24} />;
    }
    
    return icon;
  };
  
  return (
    <CardContainer variant={variant} className={className}>
      <CardHeader>
        <IconContainer variant={variant}>
          {renderIcon()}
        </IconContainer>
        
        {trend && change && (
          <TrendContainer trend={trend}>
            <TrendIcon>
              <Icon name={trend === 'up' ? 'TrendingUp' : 'TrendingDown'} size={14} />
            </TrendIcon>
            {change}
          </TrendContainer>
        )}
      </CardHeader>
      
      <StatValue>{value}</StatValue>
      <StatLabel>{label}</StatLabel>
    </CardContainer>
  );
};

export default StatCard;
