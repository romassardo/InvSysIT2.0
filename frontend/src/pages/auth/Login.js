import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { useAuth } from '../../context/AuthContext';
import FeatherIcon from 'feather-icons-react';
import Button from '../../components/ui/Button';

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const LoginTitle = styled.h1`
  font-size: 1.5rem;
  font-weight: 800;
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
  text-align: center;
`;

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const InputLabel = styled.label`
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--text-secondary);
`;

const InputWrapper = styled.div`
  position: relative;
`;

const StyledInput = styled.input`
  width: 100%;
  padding: 0.75rem;
  padding-left: ${props => props.hasIcon ? '2.5rem' : '0.75rem'};
  border-radius: var(--border-radius-md);
  border: 1px solid rgba(0, 0, 0, 0.1);
  font-family: 'Nunito', sans-serif;
  font-size: 0.95rem;
  transition: all 0.2s;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-light);
  }
  
  &.error {
    border-color: var(--danger);
    box-shadow: 0 0 0 3px var(--danger-light);
  }
`;

const InputIcon = styled.div`
  position: absolute;
  left: 0.75rem;
  top: 50%;
  transform: translateY(-50%);
  color: var(--text-muted);
`;

const ErrorMessage = styled.div`
  color: var(--danger);
  font-size: 0.8rem;
  margin-top: 0.25rem;
`;

const FormFooter = styled.div`
  margin-top: var(--spacing-md);
  text-align: center;
  font-size: 0.9rem;
  color: var(--text-muted);
`;

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const navigate = useNavigate();
  const { login } = useAuth();
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores al cambiar el input
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) {
      newErrors.username = 'El nombre de usuario es obligatorio';
    }
    
    if (!formData.password) {
      newErrors.password = 'La contraseña es obligatoria';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    setLoginError('');
    
    try {
      const result = await login(formData.username, formData.password);
      
      if (result.success) {
        navigate('/');
      } else {
        setLoginError(result.message || 'Error al iniciar sesión. Verifica tus credenciales.');
      }
    } catch (error) {
      console.error('Error en inicio de sesión:', error);
      setLoginError('Error al intentar iniciar sesión. Intenta de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <>
      <LoginTitle>Bienvenido a InvSysIT</LoginTitle>
      
      {loginError && (
        <div style={{ 
          backgroundColor: 'var(--danger-light)', 
          color: 'var(--danger)',
          padding: 'var(--spacing-sm)',
          borderRadius: 'var(--border-radius-sm)',
          marginBottom: 'var(--spacing-md)',
          display: 'flex',
          alignItems: 'center',
          gap: 'var(--spacing-xs)'
        }}>
          <FeatherIcon icon="alert-circle" size={16} />
          {loginError}
        </div>
      )}
      
      <LoginForm onSubmit={handleSubmit}>
        <InputGroup>
          <InputLabel htmlFor="username">Nombre de Usuario</InputLabel>
          <InputWrapper>
            <InputIcon>
              <FeatherIcon icon="user" size={16} />
            </InputIcon>
            <StyledInput
              id="username"
              name="username"
              type="text"
              value={formData.username}
              onChange={handleChange}
              hasIcon
              className={errors.username ? 'error' : ''}
              placeholder="Ingresa tu nombre de usuario"
            />
          </InputWrapper>
          {errors.username && <ErrorMessage>{errors.username}</ErrorMessage>}
        </InputGroup>
        
        <InputGroup>
          <InputLabel htmlFor="password">Contraseña</InputLabel>
          <InputWrapper>
            <InputIcon>
              <FeatherIcon icon="lock" size={16} />
            </InputIcon>
            <StyledInput
              id="password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              hasIcon
              className={errors.password ? 'error' : ''}
              placeholder="Ingresa tu contraseña"
            />
          </InputWrapper>
          {errors.password && <ErrorMessage>{errors.password}</ErrorMessage>}
        </InputGroup>
        
        <Button 
          type="submit" 
          variant="primary" 
          fullWidth 
          disabled={isLoading}
          icon={isLoading ? "loader" : "log-in"}
        >
          {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
        </Button>
      </LoginForm>
      
      <FormFooter>
        <p>* Durante esta fase de desarrollo, cualquier usuario/contraseña será aceptado.</p>
        <p>Usuarios de prueba: admin/admin, usuario/usuario</p>
      </FormFooter>
    </>
  );
};

export default Login;
