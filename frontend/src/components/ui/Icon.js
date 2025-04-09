import React from 'react';
import * as FeatherIcons from 'react-feather';

/**
 * Convierte un nombre de icono de cualquier formato (kebab-case, snake_case) a PascalCase
 * @param {string} name - Nombre del icono en cualquier formato
 * @returns {string} - Nombre del icono en PascalCase
 */
const formatIconName = (name) => {
  // Si el nombre ya está en PascalCase, devolverlo tal cual
  if (/^[A-Z][a-zA-Z0-9]*$/.test(name)) {
    return name;
  }
  
  // Convierte kebab-case o snake_case a PascalCase
  return name
    .split(/[-_]/) // Dividir por guiones o guiones bajos
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join('');
};

/**
 * Componente de icono que utiliza react-feather para renderizar iconos Feather
 * @param {string} name - Nombre del icono de Feather
 * @param {number} size - Tamaño del icono en píxeles
 * @param {string} color - Color del icono (puede ser nombre de color, hex, rgb, etc.)
 * @param {object} props - Propiedades adicionales para el SVG
 */
const Icon = ({ name, size = 24, color = 'currentColor', ...props }) => {
  // Formatear el nombre del icono a PascalCase
  const formattedName = formatIconName(name);
  const FeatherIcon = FeatherIcons[formattedName];
  
  if (!FeatherIcon) {
    console.warn(`Icon "${name}" (formatted as "${formattedName}") not found in Feather icons`);
    return null;
  }
  
  return <FeatherIcon size={size} color={color} {...props} />;
};

export default Icon;
