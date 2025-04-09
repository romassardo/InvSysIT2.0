import React from 'react';
import styled from 'styled-components';
import Sidebar from '../navigation/Sidebar';
import Header from '../navigation/Header';
import { useAuth } from '../../context/AuthContext';

const LayoutContainer = styled.div`
  display: flex;
  min-height: 100vh;
`;

const MainContent = styled.main`
  flex: 1;
  display: flex;
  flex-direction: column;
  background-color: var(--background);
  transition: background-color 0.3s ease;
`;

const ContentWrapper = styled.div`
  padding: var(--spacing-xl);
  flex: 1;
  overflow-y: auto;
`;

const MainLayout = ({ children }) => {
  const { currentUser } = useAuth();

  // Nota: Ya no necesitamos usar theme directamente aquí porque MainContent
  // utiliza las variables CSS que cambian automáticamente con data-theme
  return (
    <LayoutContainer>
      {/* Barra lateral de navegación */}
      <Sidebar />
      
      {/* Área principal de contenido */}
      <MainContent>
        {/* Encabezado con búsqueda y perfil */}
        <Header user={currentUser} />
        
        {/* Contenido de la página */}
        <ContentWrapper>
          {children}
        </ContentWrapper>
      </MainContent>
    </LayoutContainer>
  );
};

export default MainLayout;
