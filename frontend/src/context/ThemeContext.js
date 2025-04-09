import React, { createContext, useState, useContext, useEffect } from 'react';

// Creación del contexto del tema
const ThemeContext = createContext();

// Hook personalizado para acceder al contexto desde cualquier componente
export const useTheme = () => useContext(ThemeContext);

// Proveedor del contexto de tema
export const ThemeProvider = ({ children }) => {
  // Verificar si ya hay un tema guardado en localStorage
  const savedTheme = localStorage.getItem('invsysit_theme');
  const [theme, setTheme] = useState(savedTheme || 'light');
  
  // Función para cambiar el tema
  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('invsysit_theme', newTheme);
  };
  
  // Aplicar el tema al elemento html cuando cambie
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);
  
  // Valor del contexto que estará disponible para los componentes
  const value = {
    theme,
    toggleTheme
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export default ThemeContext;
