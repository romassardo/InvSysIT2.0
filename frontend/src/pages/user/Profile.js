import React, { useState } from 'react';
import styled from 'styled-components';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import FeatherIcon from 'feather-icons-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
`;

const ProfileGrid = styled.div`
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: var(--spacing-lg);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const ProfileSidebar = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
`;

const ProfilePicture = styled.div`
  width: 100%;
  aspect-ratio: 1;
  border-radius: var(--border-radius-md);
  background-color: rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  
  img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .upload-overlay {
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    background-color: rgba(0, 0, 0, 0.6);
    color: white;
    padding: var(--spacing-sm) var(--spacing-md);
    font-size: 0.9rem;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: var(--spacing-xs);
    cursor: pointer;
    opacity: 0;
    transition: opacity 0.2s ease;
  }
  
  &:hover .upload-overlay {
    opacity: 1;
  }
`;

const ProfileInfo = styled.div`
  h3 {
    font-size: 1.2rem;
    margin-bottom: var(--spacing-sm);
  }
  
  p {
    margin: 0;
    margin-bottom: var(--spacing-xs);
    font-size: 0.95rem;
    color: var(--text-secondary);
    
    strong {
      color: var(--text-primary);
      font-weight: 600;
    }
  }
`;

const FormGroup = styled.div`
  margin-bottom: var(--spacing-md);
  
  label {
    display: block;
    font-weight: 600;
    margin-bottom: var(--spacing-xs);
    font-size: 0.95rem;
  }
  
  input, select {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    border-radius: var(--border-radius-sm);
    border: 1px solid rgba(0, 0, 0, 0.1);
    font-family: 'Nunito', sans-serif;
    font-size: 0.95rem;
    
    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-light);
    }
  }
`;

const ErrorText = styled.div`
  color: var(--danger);
  font-size: 0.85rem;
  margin-top: var(--spacing-xs);
`;

const FormActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-md);
  margin-top: var(--spacing-lg);
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin-bottom: var(--spacing-lg);
`;

const Tab = styled.div`
  padding: var(--spacing-sm) var(--spacing-md);
  cursor: pointer;
  font-weight: ${props => props.active ? '600' : '400'};
  color: ${props => props.active ? 'var(--primary)' : 'var(--text-secondary)'};
  border-bottom: 2px solid ${props => props.active ? 'var(--primary)' : 'transparent'};
  transition: all 0.2s ease;
  
  &:hover {
    color: var(--primary);
  }
`;

const PasswordStrengthMeter = styled.div`
  height: 4px;
  background-color: var(--gray-light);
  border-radius: var(--border-radius-full);
  margin-top: var(--spacing-xs);
  overflow: hidden;
  
  .strength-bar {
    height: 100%;
    transition: width 0.3s ease;
  }
  
  .strength-text {
    font-size: 0.85rem;
    margin-top: var(--spacing-xs);
  }
`;

const Profile = () => {
  const [activeTab, setActiveTab] = useState('info');
  const [loading, setLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({
    score: 0,
    text: 'No ingresado',
    color: 'var(--gray-light)'
  });
  
  // Usuario simulado para la demostración
  const user = {
    id: 1,
    name: 'Rodrigo Pérez',
    email: 'rodrigo.perez@empresa.com',
    role: 'Administrador',
    department: 'IT',
    position: 'Jefe de Soporte',
    joinDate: '2022-01-15',
    lastLogin: '2025-04-04 15:30',
    phone: '11-5555-5555' // Añadido valor por defecto para el teléfono
  };
  
  // Valores iniciales para los formularios
  const profileInitialValues = {
    name: user.name || '',
    email: user.email || '',
    department: user.department || '',
    position: user.position || '',
    phone: user.phone || ''
  };
  
  const passwordInitialValues = {
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };
  
  // Validación del formulario de perfil
  const profileValidationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    email: Yup.string().email('Correo electrónico inválido').required('El correo es obligatorio'),
    department: Yup.string().required('El departamento es obligatorio'),
    position: Yup.string().required('El cargo es obligatorio'),
    phone: Yup.string().nullable()
  });
  
  // Validación del formulario de cambio de contraseña
  const passwordValidationSchema = Yup.object().shape({
    currentPassword: Yup.string().required('La contraseña actual es obligatoria'),
    newPassword: Yup.string()
      .min(8, 'La contraseña debe tener al menos 8 caracteres')
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
        'La contraseña debe contener al menos una letra mayúscula, una minúscula, un número y un carácter especial'
      )
      .required('La nueva contraseña es obligatoria'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('newPassword'), null], 'Las contraseñas deben coincidir')
      .required('La confirmación de contraseña es obligatoria')
  });
  
  // Manejar el envío del formulario de perfil
  const handleProfileSubmit = (values, { setSubmitting }) => {
    setLoading(true);
    
    // En una implementación real, aquí enviaríamos los datos a la API
    console.log('Actualizando perfil:', values);
    
    setTimeout(() => {
      setLoading(false);
      setSubmitting(false);
      alert('Perfil actualizado correctamente');
    }, 1000);
  };
  
  // Manejar el envío del formulario de cambio de contraseña
  const handlePasswordSubmit = (values, { setSubmitting, resetForm }) => {
    setLoading(true);
    
    // En una implementación real, aquí enviaríamos los datos a la API
    console.log('Cambiando contraseña:', values);
    
    setTimeout(() => {
      setLoading(false);
      setSubmitting(false);
      resetForm();
      setPasswordStrength({
        score: 0,
        text: 'No ingresado',
        color: 'var(--gray-light)'
      });
      alert('Contraseña actualizada correctamente');
    }, 1000);
  };
  
  // Evaluar la fortaleza de la contraseña
  const evaluatePasswordStrength = (password) => {
    if (!password) {
      return {
        score: 0,
        text: 'No ingresado',
        color: 'var(--gray-light)'
      };
    }
    
    let score = 0;
    
    // Longitud
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    
    // Complejidad
    if (/[A-Z]/.test(password)) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Asignar categoría según puntuación
    let result = {
      score: Math.min(score, 5)
    };
    
    switch (result.score) {
      case 0:
      case 1:
        result.text = 'Muy débil';
        result.color = 'var(--danger)';
        break;
      case 2:
        result.text = 'Débil';
        result.color = 'var(--warning)';
        break;
      case 3:
        result.text = 'Media';
        result.color = 'var(--warning)';
        break;
      case 4:
        result.text = 'Fuerte';
        result.color = 'var(--success)';
        break;
      case 5:
        result.text = 'Muy fuerte';
        result.color = 'var(--success)';
        break;
      default:
        result.text = 'No evaluado';
        result.color = 'var(--gray-light)';
    }
    
    return result;
  };
  
  // Renderizar el contenido según la tab activa
  const renderContent = () => {
    switch (activeTab) {
      case 'info':
        return (
          <Formik
            initialValues={profileInitialValues}
            validationSchema={profileValidationSchema}
            onSubmit={handleProfileSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <FormGroup>
                  <label htmlFor="name">Nombre Completo</label>
                  <Field type="text" id="name" name="name" placeholder="Nombre completo" />
                  <ErrorMessage name="name" component={ErrorText} />
                </FormGroup>
                
                <FormGroup>
                  <label htmlFor="email">Correo Electrónico</label>
                  <Field type="email" id="email" name="email" placeholder="correo@ejemplo.com" />
                  <ErrorMessage name="email" component={ErrorText} />
                </FormGroup>
                
                <FormGroup>
                  <label htmlFor="department">Departamento</label>
                  <Field as="select" id="department" name="department">
                    <option value="">Seleccionar Departamento</option>
                    <option value="IT">IT</option>
                    <option value="Soporte">Soporte</option>
                    <option value="Administración">Administración</option>
                    <option value="Finanzas">Finanzas</option>
                    <option value="RRHH">RRHH</option>
                  </Field>
                  <ErrorMessage name="department" component={ErrorText} />
                </FormGroup>
                
                <FormGroup>
                  <label htmlFor="position">Cargo</label>
                  <Field type="text" id="position" name="position" placeholder="Tu cargo" />
                  <ErrorMessage name="position" component={ErrorText} />
                </FormGroup>
                
                <FormGroup>
                  <label htmlFor="phone">Teléfono</label>
                  <Field type="text" id="phone" name="phone" placeholder="Teléfono de contacto" />
                  <ErrorMessage name="phone" component={ErrorText} />
                </FormGroup>
                
                <FormActions>
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={isSubmitting || loading}
                  >
                    {loading ? (
                      <>
                        <FeatherIcon icon="loader" size={16} style={{ marginRight: 'var(--spacing-xs)' }} />
                        Guardando...
                      </>
                    ) : (
                      'Guardar Cambios'
                    )}
                  </Button>
                </FormActions>
              </Form>
            )}
          </Formik>
        );
      
      case 'password':
        return (
          <Formik
            initialValues={passwordInitialValues}
            validationSchema={passwordValidationSchema}
            onSubmit={handlePasswordSubmit}
          >
            {({ values, isSubmitting, handleChange }) => {
              // Evaluar la fortaleza de la contraseña cuando cambia
              const handlePasswordChange = (e) => {
                handleChange(e);
                setPasswordStrength(evaluatePasswordStrength(e.target.value || ''));
              };
              
              return (
                <Form>
                  <FormGroup>
                    <label htmlFor="currentPassword">Contraseña Actual</label>
                    <Field 
                      type="password" 
                      id="currentPassword" 
                      name="currentPassword" 
                      placeholder="Ingresa tu contraseña actual" 
                    />
                    <ErrorMessage name="currentPassword" component={ErrorText} />
                  </FormGroup>
                  
                  <FormGroup>
                    <label htmlFor="newPassword">Nueva Contraseña</label>
                    <Field 
                      type="password" 
                      id="newPassword" 
                      name="newPassword" 
                      onChange={handlePasswordChange}
                      placeholder="Ingresa tu nueva contraseña"
                    />
                    
                    <PasswordStrengthMeter>
                      <div 
                        className="strength-bar" 
                        style={{ 
                          width: `${(passwordStrength.score / 5) * 100}%`,
                          backgroundColor: passwordStrength.color
                        }}
                      ></div>
                      
                      <div className="strength-text" style={{ color: passwordStrength.color }}>
                        Fortaleza: {passwordStrength.text}
                      </div>
                    </PasswordStrengthMeter>
                    
                    <ErrorMessage name="newPassword" component={ErrorText} />
                  </FormGroup>
                  
                  <FormGroup>
                    <label htmlFor="confirmPassword">Confirmar Nueva Contraseña</label>
                    <Field 
                      type="password" 
                      id="confirmPassword" 
                      name="confirmPassword" 
                      placeholder="Confirma tu nueva contraseña"
                    />
                    <ErrorMessage name="confirmPassword" component={ErrorText} />
                  </FormGroup>
                  
                  <div style={{ 
                    backgroundColor: 'var(--info-light)', 
                    padding: 'var(--spacing-sm) var(--spacing-md)',
                    borderRadius: 'var(--border-radius-sm)',
                    marginBottom: 'var(--spacing-md)',
                    fontSize: '0.9rem'
                  }}>
                    <strong>Recomendaciones para una contraseña segura:</strong>
                    <ul style={{ marginTop: 'var(--spacing-xs)', paddingLeft: 'var(--spacing-lg)' }}>
                      <li>Al menos 8 caracteres de longitud</li>
                      <li>Al menos una letra mayúscula</li>
                      <li>Al menos una letra minúscula</li>
                      <li>Al menos un número</li>
                      <li>Al menos un carácter especial (@, $, !, %, *, etc.)</li>
                    </ul>
                  </div>
                  
                  <FormActions>
                    <Button 
                      type="submit" 
                      variant="primary" 
                      disabled={isSubmitting || loading}
                    >
                      {loading ? (
                        <>
                          <FeatherIcon icon="loader" size={16} style={{ marginRight: 'var(--spacing-xs)' }} />
                          Actualizando...
                        </>
                      ) : (
                        'Cambiar Contraseña'
                      )}
                    </Button>
                  </FormActions>
                </Form>
              );
            }}
          </Formik>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div>
      <PageHeader>
        <PageTitle>
          <FeatherIcon icon="user" size={24} color="var(--primary)" />
          Mi Perfil
        </PageTitle>
      </PageHeader>
      
      <ProfileGrid>
        <ProfileSidebar>
          <Card>
            <ProfilePicture>
              <FeatherIcon icon="user" size={64} color="var(--text-muted)" />
              <div className="upload-overlay">
                <FeatherIcon icon="camera" size={16} />
                Cambiar foto
              </div>
            </ProfilePicture>
            
            <ProfileInfo style={{ marginTop: 'var(--spacing-md)' }}>
              <h3>{user.name}</h3>
              <p><strong>Rol:</strong> {user.role}</p>
              <p><strong>Departamento:</strong> {user.department}</p>
              <p><strong>Cargo:</strong> {user.position}</p>
              <p><strong>Correo:</strong> {user.email}</p>
              <p><strong>Último acceso:</strong> {user.lastLogin}</p>
            </ProfileInfo>
          </Card>
        </ProfileSidebar>
        
        <div>
          <Card>
            <TabsContainer>
              <Tab 
                active={activeTab === 'info'} 
                onClick={() => setActiveTab('info')}
              >
                Información Personal
              </Tab>
              <Tab 
                active={activeTab === 'password'} 
                onClick={() => setActiveTab('password')}
              >
                Cambiar Contraseña
              </Tab>
            </TabsContainer>
            
            {renderContent()}
          </Card>
        </div>
      </ProfileGrid>
    </div>
  );
};

export default Profile;
