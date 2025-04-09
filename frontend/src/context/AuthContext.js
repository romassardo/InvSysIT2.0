import React, { createContext, useState, useContext, useCallback } from 'react';
import axios from 'axios';

// Creación del contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para acceder al contexto desde cualquier componente
export const useAuth = () => useContext(AuthContext);

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // Verificar si el usuario ya está autenticado (por ejemplo, al recargar la página)
  const checkAuth = useCallback(async () => {
    try {
      // En una implementación real, aquí verificaríamos el token JWT almacenado
      const token = localStorage.getItem('invsysit_token');
      
      if (token) {
        // Configurar el token en los headers de axios
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        
        // Obtener información del perfil del usuario
        // Esto sería una llamada real a la API en la implementación final
        // const response = await axios.get('/api/auth/profile');
        
        // Para el desarrollo inicial, simularemos un usuario
        const mockUser = {
          id: 1,
          username: 'admin',
          name: 'Administrador',
          role: 'admin'
        };
        
        setCurrentUser(mockUser);
        setIsAuthenticated(true);
      } else {
        // Si no hay token, resetear estado
        setCurrentUser(null);
        setIsAuthenticated(false);
        delete axios.defaults.headers.common['Authorization'];
      }
    } catch (error) {
      console.error('Error al verificar autenticación:', error);
      // Si hay un error, limpiar autenticación
      localStorage.removeItem('invsysit_token');
      setCurrentUser(null);
      setIsAuthenticated(false);
      delete axios.defaults.headers.common['Authorization'];
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Función para iniciar sesión
  const login = async (username, password) => {
    try {
      setLoading(true);
      
      // En la implementación real, esto sería una llamada a la API
      // const response = await axios.post('/api/auth/login', { username, password });
      
      // Para desarrollo, simulamos una respuesta exitosa
      const mockResponse = {
        data: {
          status: 'success',
          data: {
            user: {
              id: 1,
              username: username,
              name: username === 'admin' ? 'Administrador' : 'Usuario Estándar',
              role: username === 'admin' ? 'admin' : 'user'
            },
            token: 'mock-jwt-token-123456789'
          }
        }
      };
      
      // Guardar token en localStorage
      localStorage.setItem('invsysit_token', mockResponse.data.data.token);
      
      // Configurar axios para incluir el token en futuros requests
      axios.defaults.headers.common['Authorization'] = `Bearer ${mockResponse.data.data.token}`;
      
      // Actualizar estado
      setCurrentUser(mockResponse.data.data.user);
      setIsAuthenticated(true);
      
      return {
        success: true,
        user: mockResponse.data.data.user
      };
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      return {
        success: false,
        message: error.response?.data?.message || 'Error al iniciar sesión'
      };
    } finally {
      setLoading(false);
    }
  };
  
  // Función para cerrar sesión
  const logout = () => {
    // Limpiar token de localStorage
    localStorage.removeItem('invsysit_token');
    
    // Limpiar estado
    setCurrentUser(null);
    setIsAuthenticated(false);
    
    // Limpiar headers de axios
    delete axios.defaults.headers.common['Authorization'];
  };
  
  // Función para actualizar datos del usuario
  const updateUserData = (userData) => {
    setCurrentUser(prev => ({ ...prev, ...userData }));
  };
  
  // Valor del contexto que estará disponible para los componentes
  const value = {
    currentUser,
    isAuthenticated,
    loading,
    checkAuth,
    login,
    logout,
    updateUserData
  };
  
  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
