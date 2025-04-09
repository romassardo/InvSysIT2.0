import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
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

const FormContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const FormGroup = styled.div`
  margin-bottom: var(--spacing-md);
  
  label {
    display: block;
    font-weight: 600;
    margin-bottom: var(--spacing-xs);
    font-size: 0.95rem;
  }
  
  input, select, textarea {
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
  
  textarea {
    min-height: 100px;
    resize: vertical;
  }
`;

const FieldGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-md);
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
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

const FormSection = styled.div`
  margin-bottom: var(--spacing-lg);
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: var(--spacing-md);
    padding-bottom: var(--spacing-xs);
    border-bottom: 1px solid rgba(0, 0, 0, 0.05);
  }
`;

const AssetInfo = styled.div`
  background-color: var(--primary-light);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-lg);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const AssetIcon = styled.div`
  width: 60px;
  height: 60px;
  background-color: var(--primary);
  color: white;
  border-radius: var(--border-radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AssetDetails = styled.div`
  flex: 1;
`;

const AssetName = styled.h3`
  font-size: 1.2rem;
  margin: 0;
  margin-bottom: var(--spacing-xs);
`;

const AssetMeta = styled.div`
  display: flex;
  gap: var(--spacing-md);
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const Checkbox = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  
  input {
    width: auto;
  }
`;

const RepairForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [asset, setAsset] = useState(null);
  const [providers, setProviders] = useState([]);
  
  const initialValues = {
    assetId: id || '',
    problem: '',
    problemDetails: '',
    provider: '',
    providerReference: '',
    estimatedReturnDate: '',
    inWarranty: false,
    notes: '',
    priority: 'Normal'
  };
  
  // Simular carga de datos
  useEffect(() => {
    // En una implementación real, estos datos vendrían de la API
    const mockProviders = [
      { id: 1, name: 'Servicio Técnico Dell' },
      { id: 2, name: 'Servicio Técnico HP' },
      { id: 3, name: 'Servicio Técnico Lenovo' },
      { id: 4, name: 'iService' },
      { id: 5, name: 'TecnoService' },
      { id: 6, name: 'Reparaciones Internas' }
    ];
    
    setProviders(mockProviders);
    
    // Si hay un ID, cargar datos del activo
    if (id) {
      // En una implementación real, estos datos vendrían de la API
      setTimeout(() => {
        // Datos simulados para una notebook
        const mockAsset = {
          id: parseInt(id),
          name: 'Notebook Dell Latitude 7400',
          serialNumber: 'DL7400-123456',
          category: 'Computadoras',
          subcategory: 'Notebooks',
          status: 'En Stock',
          location: 'Oficina Central',
          warrantyUntil: '2026-12-10',
          icon: 'laptop'
        };
        
        setAsset(mockAsset);
        setLoading(false);
      }, 800);
    } else {
      setLoading(false);
    }
  }, [id]);
  
  // Validación del formulario
  const validationSchema = Yup.object().shape({
    assetId: Yup.string().required('El activo es obligatorio'),
    problem: Yup.string().required('El problema es obligatorio'),
    problemDetails: Yup.string(),
    provider: Yup.string().required('El proveedor es obligatorio'),
    providerReference: Yup.string(),
    estimatedReturnDate: Yup.date().min(
      new Date(), 
      'La fecha estimada de retorno debe ser una fecha futura'
    ),
    inWarranty: Yup.boolean(),
    notes: Yup.string(),
    priority: Yup.string().required('La prioridad es obligatoria')
  });
  
  // Enviar formulario
  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Valores del formulario:', values);
    
    // En una implementación real, aquí enviaríamos los datos a la API
    setTimeout(() => {
      setSubmitting(false);
      
      // Redirigir a la página de activos en reparación
      navigate('/inventory/in-repair');
    }, 1000);
  };
  
  // Determinar si el activo está en garantía
  const isInWarranty = (warrantyDate) => {
    if (!warrantyDate) return false;
    
    const today = new Date();
    const warranty = new Date(warrantyDate);
    
    return today <= warranty;
  };
  
  // Obtener icono según categoría
  const getCategoryIcon = (category, subcategory) => {
    switch (category) {
      case 'Computadoras':
        return subcategory === 'Notebooks' ? 'laptop' : 'cpu';
      case 'Celulares':
        return 'smartphone';
      case 'Periféricos':
        return 'monitor';
      case 'Consumibles':
        return 'box';
      case 'Componentes':
        return 'hard-drive';
      default:
        return 'box';
    }
  };
  
  if (loading) {
    return (
      <div>
        <PageHeader>
          <PageTitle>
            <FeatherIcon icon="tool" size={24} color="var(--warning)" />
            Enviar a Reparación
          </PageTitle>
        </PageHeader>
        
        <Card>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            padding: 'var(--spacing-xl)' 
          }}>
            <FeatherIcon icon="loader" size={36} />
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div>
      <PageHeader>
        <PageTitle>
          <FeatherIcon icon="tool" size={24} color="var(--warning)" />
          Enviar a Reparación
        </PageTitle>
      </PageHeader>
      
      <FormContainer>
        <Card>
          {asset && (
            <AssetInfo>
              <AssetIcon>
                <FeatherIcon 
                  icon={getCategoryIcon(asset.category, asset.subcategory)} 
                  size={24} 
                />
              </AssetIcon>
              
              <AssetDetails>
                <AssetName>{asset.name}</AssetName>
                <AssetMeta>
                  <span>{asset.category} {asset.subcategory && `- ${asset.subcategory}`}</span>
                  <span>•</span>
                  <span>S/N: {asset.serialNumber}</span>
                  <span>•</span>
                  <span>Ubicación: {asset.location}</span>
                </AssetMeta>
              </AssetDetails>
            </AssetInfo>
          )}
          
          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, isSubmitting, setFieldValue }) => (
              <Form>
                {!asset && (
                  <FormSection>
                    <h3>Seleccionar Activo</h3>
                    <FormGroup>
                      <label htmlFor="assetId">Activo*</label>
                      <Field as="select" id="assetId" name="assetId">
                        <option value="">Seleccionar Activo</option>
                        {/* En una implementación real, cargamos los activos de la API */}
                        <option value="101">Notebook Dell Latitude 7400</option>
                        <option value="102">iPhone 13 Pro</option>
                        <option value="103">Monitor LG 27"</option>
                      </Field>
                      <ErrorMessage name="assetId" component={ErrorText} />
                    </FormGroup>
                  </FormSection>
                )}
                
                <FormSection>
                  <h3>Información del Problema</h3>
                  <FormGroup>
                    <label htmlFor="problem">Problema*</label>
                    <Field type="text" id="problem" name="problem" placeholder="Descripción breve del problema" />
                    <ErrorMessage name="problem" component={ErrorText} />
                  </FormGroup>
                  
                  <FormGroup>
                    <label htmlFor="problemDetails">Detalles del Problema</label>
                    <Field 
                      as="textarea" 
                      id="problemDetails" 
                      name="problemDetails" 
                      placeholder="Proporcione detalles adicionales sobre el problema, reproducción, etc."
                    />
                    <ErrorMessage name="problemDetails" component={ErrorText} />
                  </FormGroup>
                  
                  <FieldGrid>
                    <FormGroup>
                      <label htmlFor="priority">Prioridad*</label>
                      <Field as="select" id="priority" name="priority">
                        <option value="Baja">Baja</option>
                        <option value="Normal">Normal</option>
                        <option value="Alta">Alta</option>
                        <option value="Crítica">Crítica</option>
                      </Field>
                      <ErrorMessage name="priority" component={ErrorText} />
                    </FormGroup>
                    
                    <FormGroup>
                      <label htmlFor="inWarranty">Garantía</label>
                      <Checkbox>
                        <Field 
                          type="checkbox" 
                          id="inWarranty" 
                          name="inWarranty" 
                          checked={asset ? isInWarranty(asset.warrantyUntil) : values.inWarranty}
                          onChange={(e) => {
                            setFieldValue('inWarranty', asset ? isInWarranty(asset.warrantyUntil) : e.target.checked);
                          }}
                          disabled={asset && isInWarranty(asset.warrantyUntil)}
                        />
                        <span>Cubierto por garantía</span>
                      </Checkbox>
                      {asset && isInWarranty(asset.warrantyUntil) && (
                        <div style={{ 
                          fontSize: '0.85rem', 
                          color: 'var(--success)',
                          marginTop: 'var(--spacing-xs)'
                        }}>
                          En garantía hasta: {new Date(asset.warrantyUntil).toLocaleDateString()}
                        </div>
                      )}
                    </FormGroup>
                  </FieldGrid>
                </FormSection>
                
                <FormSection>
                  <h3>Información del Servicio Técnico</h3>
                  <FieldGrid>
                    <FormGroup>
                      <label htmlFor="provider">Proveedor de Servicio*</label>
                      <Field as="select" id="provider" name="provider">
                        <option value="">Seleccionar Proveedor</option>
                        {providers.map(provider => (
                          <option key={provider.id} value={provider.name}>
                            {provider.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="provider" component={ErrorText} />
                    </FormGroup>
                    
                    <FormGroup>
                      <label htmlFor="providerReference">Referencia del Proveedor</label>
                      <Field 
                        type="text" 
                        id="providerReference" 
                        name="providerReference" 
                        placeholder="Número de ticket, referencia, etc."
                      />
                      <ErrorMessage name="providerReference" component={ErrorText} />
                    </FormGroup>
                    
                    <FormGroup>
                      <label htmlFor="estimatedReturnDate">Fecha Estimada de Retorno</label>
                      <Field type="date" id="estimatedReturnDate" name="estimatedReturnDate" />
                      <ErrorMessage name="estimatedReturnDate" component={ErrorText} />
                    </FormGroup>
                  </FieldGrid>
                </FormSection>
                
                <FormSection>
                  <h3>Notas Adicionales</h3>
                  <FormGroup>
                    <label htmlFor="notes">Notas</label>
                    <Field 
                      as="textarea" 
                      id="notes" 
                      name="notes" 
                      placeholder="Información adicional relevante para el proceso de reparación"
                    />
                    <ErrorMessage name="notes" component={ErrorText} />
                  </FormGroup>
                </FormSection>
                
                <FormActions>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate(id ? `/inventory/asset/${id}` : '/inventory')}
                  >
                    Cancelar
                  </Button>
                  
                  <Button 
                    type="submit" 
                    variant="primary" 
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <FeatherIcon icon="loader" size={16} style={{ marginRight: 'var(--spacing-xs)' }} />
                        Procesando...
                      </>
                    ) : (
                      <>
                        <FeatherIcon icon="tool" size={16} style={{ marginRight: 'var(--spacing-xs)' }} />
                        Enviar a Reparación
                      </>
                    )}
                  </Button>
                </FormActions>
              </Form>
            )}
          </Formik>
        </Card>
      </FormContainer>
    </div>
  );
};

export default RepairForm;
