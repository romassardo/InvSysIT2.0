import React from 'react';
import styled from 'styled-components';
import { useTheme } from '../../context/ThemeContext';

const CardContainer = styled.div`
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  height: 100%;
`;

const CardHeader = styled.div`
  padding: 1.25rem 1.5rem;
  border-bottom: ${props => props.hasDivider ? '1px solid var(--border-color)' : 'none'};
  display: flex;
  align-items: center;
  justify-content: space-between;
  transition: border-color 0.3s ease;
`;

const CardTitle = styled.h2`
  margin: 0;
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--text-primary);
`;

const CardActions = styled.div`
  display: flex;
  gap: var(--spacing-xs);
`;

const CardContent = styled.div`
  padding: 1.5rem;
  flex: 1;
`;

const CardFooter = styled.div`
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border-color);
  background-color: ${props => props.theme === 'light' ? 'rgba(0, 0, 0, 0.01)' : 'rgba(255, 255, 255, 0.02)'};
  transition: border-color 0.3s ease, background-color 0.3s ease;
`;

/**
 * Componente Card para mostrar información en un contenedor con estilo
 * @param {string} title - Título de la tarjeta
 * @param {React.ReactNode} actions - Botones o acciones en la esquina superior derecha
 * @param {React.ReactNode} children - Contenido principal de la tarjeta
 * @param {React.ReactNode} footer - Contenido opcional para el pie de la tarjeta
 * @param {boolean} headerDivider - Si debe mostrarse una línea divisoria bajo el encabezado
 */
const Card = ({ 
  title, 
  actions, 
  children, 
  footer,
  headerDivider = true,
  className = '' 
}) => {
  const { theme } = useTheme();
  return (
    <CardContainer className={className}>
      {(title || actions) && (
        <CardHeader hasDivider={headerDivider}>
          {title && <CardTitle>{title}</CardTitle>}
          {actions && <CardActions>{actions}</CardActions>}
        </CardHeader>
      )}
      
      <CardContent>{children}</CardContent>
      
      {footer && <CardFooter theme={theme}>{footer}</CardFooter>}
    </CardContainer>
  );
};

export default Card;
