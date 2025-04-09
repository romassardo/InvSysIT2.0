import React from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';

const AuthContainer = styled.div`
  display: flex;
  min-height: 100vh;
  background-color: var(--background);
  background-image: linear-gradient(135deg, var(--primary) 0%, #4527A0 100%);
`;

const AuthWrapper = styled.div`
  margin: auto;
  width: 100%;
  max-width: 450px;
  padding: var(--spacing-xl);
`;

const AuthCard = styled.div`
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  padding: var(--spacing-xl);
`;

const LogoWrapper = styled.div`
  margin-bottom: var(--spacing-lg);
  text-align: center;
`;

const Logo = styled.h1`
  color: white;
  font-weight: 800;
  font-size: 2rem;
  margin-bottom: var(--spacing-md);
`;

const AuthLayout = ({ children }) => {
  return (
    <AuthContainer>
      <AuthWrapper>
        <LogoWrapper>
          <Logo>InvSysIT</Logo>
          <p style={{ color: 'white', opacity: 0.8 }}>Sistema de Inventario IT</p>
        </LogoWrapper>
        
        <AuthCard>
          {children}
        </AuthCard>
      </AuthWrapper>
    </AuthContainer>
  );
};

export default AuthLayout;
