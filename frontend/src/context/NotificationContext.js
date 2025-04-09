import React, { createContext, useState, useContext, useCallback } from 'react';
import Notification from '../components/ui/Notification';

// Crear el contexto
const NotificationContext = createContext();

/**
 * Proveedor del contexto de notificaciones
 * Permite mostrar notificaciones en cualquier parte de la aplicación
 */
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState([]);
  const [lastAction, setLastAction] = useState(null);

  // Generar ID único para las notificaciones
  const generateId = () => `notification-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

  // Mostrar una notificación
  const showNotification = useCallback((message, type = 'info', undoAction = null, undoData = null) => {
    const id = generateId();
    
    const newNotification = {
      id,
      message,
      type,
      hasUndo: !!undoAction,
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    if (undoAction && undoData) {
      setLastAction({
        type: undoAction,
        data: undoData
      });
    }
    
    // Auto-cerrar notificación después de 5 segundos si no hay opción de deshacer
    if (!undoAction) {
      setTimeout(() => {
        closeNotification(id);
      }, 5000);
    }
    
    return id;
  }, []);

  // Cerrar una notificación específica
  const closeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(notification => notification.id !== id));
    setLastAction(null);
  }, []);

  // Deshacer la última acción
  const undoLastAction = useCallback(() => {
    if (lastAction && lastAction.type && typeof lastAction.type === 'function') {
      // Ejecutar la función de deshacer con los datos guardados
      lastAction.type(lastAction.data);
      
      // Mostrar notificación informativa sobre la acción deshecha
      showNotification('Acción deshecha correctamente', 'info');
    }
    
    // Limpiar la última acción
    setLastAction(null);
    
    // Cerrar todas las notificaciones
    setNotifications([]);
  }, [lastAction, showNotification]);

  // Renderizar las notificaciones
  const renderNotifications = () => {
    return notifications.map(notification => (
      <Notification
        key={notification.id}
        type={notification.type}
        message={notification.message}
        showUndo={notification.hasUndo && lastAction}
        onUndo={undoLastAction}
        onClose={() => closeNotification(notification.id)}
      />
    ));
  };

  return (
    <NotificationContext.Provider
      value={{
        showNotification,
        closeNotification,
        undoLastAction,
      }}
    >
      {children}
      {renderNotifications()}
    </NotificationContext.Provider>
  );
};

// Hook personalizado para usar el contexto de notificaciones
export const useNotification = () => {
  const context = useContext(NotificationContext);
  
  if (!context) {
    throw new Error('useNotification debe usarse dentro de un NotificationProvider');
  }
  
  return context;
};
