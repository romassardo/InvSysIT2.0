import React from 'react';
import styled from 'styled-components';
import Icon from './Icon';

const NotificationContainer = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: ${props => 
    props.type === 'success' ? '#28a745' : 
    props.type === 'error' ? '#dc3545' : 
    props.type === 'info' ? '#17a2b8' : 
    '#ffc107'
  };
  color: ${props => props.type === 'warning' ? '#212529' : 'white'};
  border-radius: var(--border-radius-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  z-index: 1000;
  animation: slideIn 0.3s ease-out forwards;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .close {
    margin-left: var(--spacing-md);
    cursor: pointer;
    opacity: 0.8;
    
    &:hover {
      opacity: 1;
    }
  }
  
  .undo {
    margin-left: var(--spacing-md);
    text-decoration: underline;
    cursor: pointer;
    font-weight: 600;
    
    &:hover {
      opacity: 0.9;
    }
  }
`;

/**
 * Componente de notificación reutilizable
 * @param {string} type - Tipo de notificación: 'success', 'error', 'warning', 'info'
 * @param {string} message - Mensaje a mostrar
 * @param {boolean} showUndo - Si debe mostrar la opción de deshacer
 * @param {function} onUndo - Función a ejecutar cuando se hace clic en deshacer
 * @param {function} onClose - Función para cerrar la notificación
 */
const Notification = ({ 
  type = 'info', 
  message, 
  showUndo = false, 
  onUndo, 
  onClose 
}) => {
  // Determinar el icono según el tipo de notificación
  const getIcon = () => {
    switch (type) {
      case 'success':
        return 'check-circle';
      case 'error':
        return 'alert-circle';
      case 'warning':
        return 'alert-triangle';
      case 'info':
      default:
        return 'info';
    }
  };

  return (
    <NotificationContainer type={type}>
      <Icon name={getIcon()} size={20} />
      <span>{message}</span>
      
      {showUndo && (
        <span className="undo" onClick={onUndo}>
          Deshacer
        </span>
      )}
      
      <span className="close" onClick={onClose}>
        <Icon name="x" size={16} />
      </span>
    </NotificationContainer>
  );
};

export default Notification;
