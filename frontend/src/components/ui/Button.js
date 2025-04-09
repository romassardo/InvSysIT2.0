import React from 'react';
import styled, { css } from 'styled-components';
import Icon from './Icon';

// Estilos base para todos los botones
const ButtonBase = css`
  font-family: 'Nunito', sans-serif;
  font-weight: 600;
  font-size: 0.95rem;
  border-radius: var(--border-radius-sm);
  transition: all 0.2s ease;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-xs);
  border: none;
  
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
  
  &:focus {
    outline: none;
  }
`;

// Estilos para variante primaria
const PrimaryButton = styled.button`
  ${ButtonBase}
  background-color: var(--primary);
  color: white;
  padding: 0.75rem 1.25rem;
  box-shadow: var(--shadow-sm);
  
  &:hover:not(:disabled) {
    background-color: #5200d7;
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: var(--shadow-sm);
  }
`;

// Estilos para variante outline
const OutlineButton = styled.button`
  ${ButtonBase}
  background-color: transparent;
  color: var(--primary);
  padding: 0.75rem 1.25rem;
  border: 1px solid var(--primary);
  
  &:hover:not(:disabled) {
    background-color: var(--primary-light);
  }
  
  &:active:not(:disabled) {
    background-color: rgba(98, 0, 234, 0.2);
  }
`;

// Estilos para variante de icono
const IconButton = styled.button`
  ${ButtonBase}
  background-color: transparent;
  color: var(--text-secondary);
  padding: 0.75rem;
  min-width: 42px;
  min-height: 42px;
  
  &:hover:not(:disabled) {
    background-color: var(--primary-light);
    color: var(--primary);
  }
  
  &:active:not(:disabled) {
    background-color: rgba(98, 0, 234, 0.2);
  }
`;

// Estilos para variante secundaria
const SecondaryButton = styled.button`
  ${ButtonBase}
  background-color: var(--secondary);
  color: white;
  padding: 0.75rem 1.25rem;
  box-shadow: var(--shadow-sm);
  
  &:hover:not(:disabled) {
    background-color: #00b248;
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: var(--shadow-sm);
  }
`;

// Estilos para variante danger
const DangerButton = styled.button`
  ${ButtonBase}
  background-color: var(--danger);
  color: white;
  padding: 0.75rem 1.25rem;
  box-shadow: var(--shadow-sm);
  
  &:hover:not(:disabled) {
    background-color: #e53935;
    box-shadow: var(--shadow-md);
    transform: translateY(-1px);
  }
  
  &:active:not(:disabled) {
    transform: translateY(0);
    box-shadow: var(--shadow-sm);
  }
`;

// Componente Button principal
const Button = ({ 
  children, 
  variant = 'primary', 
  icon, 
  iconPosition = 'left',
  onClick,
  disabled = false,
  type = 'button',
  fullWidth = false,
  ...props 
}) => {
  // Función para renderizar el icono si existe
  const renderIcon = () => {
    if (!icon) return null;
    
    if (typeof icon === 'string') {
      return <Icon name={icon} size={18} />;
    }
    
    return icon;
  };
  
  // Contenido del botón con icono posicionado correctamente
  const buttonContent = (
    <>
      {icon && iconPosition === 'left' && renderIcon()}
      {children}
      {icon && iconPosition === 'right' && renderIcon()}
    </>
  );
  
  // Estilo para ancho completo
  const fullWidthStyle = fullWidth ? { width: '100%' } : {};
  
  // Seleccionar la variante correcta del botón
  switch (variant) {
    case 'outline':
      return (
        <OutlineButton 
          onClick={onClick} 
          disabled={disabled} 
          type={type}
          style={fullWidthStyle}
          {...props}
        >
          {buttonContent}
        </OutlineButton>
      );
    case 'icon':
      return (
        <IconButton 
          onClick={onClick} 
          disabled={disabled} 
          type={type}
          {...props}
        >
          {renderIcon() || children}
        </IconButton>
      );
    case 'secondary':
      return (
        <SecondaryButton 
          onClick={onClick} 
          disabled={disabled} 
          type={type}
          style={fullWidthStyle}
          {...props}
        >
          {buttonContent}
        </SecondaryButton>
      );
    case 'danger':
      return (
        <DangerButton 
          onClick={onClick} 
          disabled={disabled} 
          type={type}
          style={fullWidthStyle}
          {...props}
        >
          {buttonContent}
        </DangerButton>
      );
    case 'primary':
    default:
      return (
        <PrimaryButton 
          onClick={onClick} 
          disabled={disabled} 
          type={type}
          style={fullWidthStyle}
          {...props}
        >
          {buttonContent}
        </PrimaryButton>
      );
  }
};

export default Button;
