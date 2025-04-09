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

const ThresholdSlider = styled.div`
  margin-top: var(--spacing-md);
  padding: var(--spacing-md);
  background-color: rgba(0, 0, 0, 0.02);
  border-radius: var(--border-radius-md);
`;

const SliderContainer = styled.div`
  position: relative;
  height: 8px;
  background-color: var(--gray-light);
  border-radius: var(--border-radius-full);
  margin: var(--spacing-md) 0;
`;

const SliderTrack = styled.div`
  position: absolute;
  height: 100%;
  background-color: var(--primary);
  border-radius: var(--border-radius-full);
  left: 0;
  width: ${props => props.percentage}%;
`;

const SliderMarker = styled.div`
  position: absolute;
  top: -8px;
  width: 24px;
  height: 24px;
  background-color: white;
  border: 2px solid ${props => props.color};
  border-radius: 50%;
  transform: translateX(-50%);
  left: ${props => props.position}%;
  cursor: pointer;
  z-index: 2;
  
  &::after {
    content: '${props => props.value}';
    position: absolute;
    top: -25px;
    left: 50%;
    transform: translateX(-50%);
    background-color: ${props => props.color};
    color: white;
    padding: 2px 8px;
    border-radius: var(--border-radius-sm);
    font-size: 0.8rem;
    white-space: nowrap;
  }
`;

const SliderLabels = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  color: var(--text-muted);
`;

const LegendItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  font-size: 0.9rem;
  color: var(--text-secondary);
  
  span {
    display: inline-block;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background-color: ${props => props.color};
  }
`;

const Legend = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-md);
`;

const InfoMessage = styled.div`
  margin-top: var(--spacing-md);
  padding: var(--spacing-sm) var(--spacing-md);
  background-color: var(--info-light);
  border-left: 3px solid var(--info);
  border-radius: var(--border-radius-sm);
  color: var(--text-secondary);
  font-size: 0.9rem;
`;

const ConsumableForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [consumable, setConsumable] = useState(null);
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [maxQuantity, setMaxQuantity] = useState(100);
  
  const initialValues = {
    name: '',
    category: 'Consumibles',
    subcategory: '',
    sku: '',
    currentStock: 0,
    minimumStock: 0,
    idealStock: 0,
    location: '',
    unitPrice: '',
    supplier: '',
    compatibleWith: '',
    description: '',
    alertEnabled: true,
    isPriority: false
  };
  
  // Simular carga de datos
  useEffect(() => {
    // En una implementación real, estos datos vendrían de la API
    const mockCategories = [
      { id: 1, name: 'Consumibles', subcategories: ['Cables', 'Pilas', 'Toner', 'Drum', 'Cargadores'] },
      { id: 2, name: 'Componentes', subcategories: ['Memorias RAM', 'Discos Externos', 'Discos SSD/NVMe', 'Placas Sending', 'Placas de Video', 'Motherboards', 'Adaptadores USB Varios'] }
    ];
    
    setCategories(mockCategories);
    setSubcategories(mockCategories[0].subcategories);
    
    // Si hay un ID, cargar datos del consumible
    if (id) {
      // En una implementación real, estos datos vendrían de la API
      setTimeout(() => {
        // Datos simulados para un consumible
        const mockConsumable = {
          id: parseInt(id),
          name: 'Tóner HP CF380X Negro',
          category: 'Consumibles',
          subcategory: 'Toner',
          sku: 'TON-HP-CF380X',
          currentStock: 5,
          minimumStock: 8,
          idealStock: 15,
          location: 'Depósito Central',
          unitPrice: '120',
          supplier: 'HP Argentina',
          compatibleWith: 'HP Color LaserJet Pro M476',
          description: 'Tóner original HP de alto rendimiento. Rendimiento aproximado: 4,400 páginas.',
          alertEnabled: true,
          isPriority: true
        };
        
        setConsumable(mockConsumable);
        setMaxQuantity(30); // Establecer un valor máximo razonable para el slider
        setLoading(false);
      }, 800);
    } else {
      setLoading(false);
    }
  }, [id]);
  
  // Manejar cambio de categoría
  const handleCategoryChange = (e, setFieldValue) => {
    const categoryName = e.target.value;
    setFieldValue('category', categoryName);
    setFieldValue('subcategory', '');
    
    const category = categories.find(c => c.name === categoryName);
    if (category) {
      setSubcategories(category.subcategories);
    } else {
      setSubcategories([]);
    }
  };
  
  // Validación del formulario
  const validationSchema = Yup.object().shape({
    name: Yup.string().required('El nombre es obligatorio'),
    category: Yup.string().required('La categoría es obligatoria'),
    subcategory: Yup.string(),
    sku: Yup.string(),
    currentStock: Yup.number()
      .min(0, 'El stock actual no puede ser negativo')
      .required('El stock actual es obligatorio'),
    minimumStock: Yup.number()
      .min(0, 'El stock mínimo no puede ser negativo')
      .required('El stock mínimo es obligatorio'),
    idealStock: Yup.number()
      .min(0, 'El stock ideal no puede ser negativo')
      .test(
        'ideal-greater-than-min',
        'El stock ideal debe ser mayor o igual al stock mínimo',
        function(value) {
          return value >= this.parent.minimumStock;
        }
      )
      .required('El stock ideal es obligatorio'),
    location: Yup.string().required('La ubicación es obligatoria'),
    unitPrice: Yup.number().min(0, 'El precio unitario no puede ser negativo'),
    supplier: Yup.string(),
    compatibleWith: Yup.string(),
    description: Yup.string(),
    alertEnabled: Yup.boolean(),
    isPriority: Yup.boolean()
  });
  
  // Enviar formulario
  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Valores del formulario:', values);
    
    // En una implementación real, aquí enviaríamos los datos a la API
    setTimeout(() => {
      setSubmitting(false);
      
      // Redirigir a la página de detalle o listado
      navigate('/inventory/low-stock');
    }, 1000);
  };
  
  // Calcular porcentajes para el slider
  const calculatePercentage = (value) => {
    return (value / maxQuantity) * 100;
  };
  
  if (loading) {
    return (
      <div>
        <PageHeader>
          <PageTitle>
            <FeatherIcon icon="box" size={24} color="var(--primary)" />
            {id ? 'Editar Consumible' : 'Nuevo Consumible'}
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
          <FeatherIcon icon="box" size={24} color="var(--primary)" />
          {id ? 'Editar Consumible' : 'Nuevo Consumible'}
        </PageTitle>
      </PageHeader>
      
      <FormContainer>
        <Card>
          <Formik
            initialValues={consumable || initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ values, errors, touched, isSubmitting, setFieldValue }) => (
              <Form>
                <FormSection>
                  <h3>Información Básica</h3>
                  <FieldGrid>
                    <FormGroup>
                      <label htmlFor="name">Nombre del Consumible*</label>
                      <Field type="text" id="name" name="name" />
                      <ErrorMessage name="name" component={ErrorText} />
                    </FormGroup>
                    
                    <FormGroup>
                      <label htmlFor="sku">SKU / Código</label>
                      <Field type="text" id="sku" name="sku" />
                      <ErrorMessage name="sku" component={ErrorText} />
                    </FormGroup>
                    
                    <FormGroup>
                      <label htmlFor="category">Categoría*</label>
                      <Field 
                        as="select" 
                        id="category" 
                        name="category"
                        onChange={(e) => handleCategoryChange(e, setFieldValue)}
                      >
                        <option value="">Seleccionar Categoría</option>
                        {categories.map(category => (
                          <option key={category.id} value={category.name}>
                            {category.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="category" component={ErrorText} />
                    </FormGroup>
                    
                    <FormGroup>
                      <label htmlFor="subcategory">Subcategoría</label>
                      <Field as="select" id="subcategory" name="subcategory">
                        <option value="">Seleccionar Subcategoría</option>
                        {subcategories.map((subcategory, index) => (
                          <option key={index} value={subcategory}>
                            {subcategory}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="subcategory" component={ErrorText} />
                    </FormGroup>
                    
                    <FormGroup>
                      <label htmlFor="location">Ubicación*</label>
                      <Field as="select" id="location" name="location">
                        <option value="">Seleccionar Ubicación</option>
                        <option value="Oficina Central">Oficina Central</option>
                        <option value="Sucursal Norte">Sucursal Norte</option>
                        <option value="Sucursal Sur">Sucursal Sur</option>
                        <option value="Depósito Central">Depósito Central</option>
                      </Field>
                      <ErrorMessage name="location" component={ErrorText} />
                    </FormGroup>
                    
                    <FormGroup>
                      <label htmlFor="unitPrice">Precio Unitario ($)</label>
                      <Field type="number" id="unitPrice" name="unitPrice" />
                      <ErrorMessage name="unitPrice" component={ErrorText} />
                    </FormGroup>
                  </FieldGrid>
                </FormSection>
                
                <FormSection>
                  <h3>Configuración de Stock</h3>
                  
                  <FieldGrid>
                    <FormGroup>
                      <label htmlFor="currentStock">Stock Actual*</label>
                      <Field 
                        type="number" 
                        id="currentStock" 
                        name="currentStock"
                        min="0"
                        onChange={(e) => {
                          const value = parseInt(e.target.value, 10) || 0;
                          setFieldValue('currentStock', value);
                          // Sugerir un stock ideal si es un elemento nuevo
                          if (!id && value > values.idealStock) {
                            setFieldValue('idealStock', value);
                            // Y un stock mínimo si no se ha establecido
                            if (values.minimumStock === 0) {
                              setFieldValue('minimumStock', Math.max(1, Math.floor(value * 0.3)));
                            }
                          }
                        }}
                      />
                      <ErrorMessage name="currentStock" component={ErrorText} />
                    </FormGroup>
                    
                    <FormGroup>
                      <label htmlFor="supplier">Proveedor</label>
                      <Field type="text" id="supplier" name="supplier" />
                      <ErrorMessage name="supplier" component={ErrorText} />
                    </FormGroup>
                  </FieldGrid>
                  
                  <ThresholdSlider>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <h4 style={{ margin: 0 }}>Umbrales de Alerta</h4>
                      <FormGroup style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                        <Field type="checkbox" id="alertEnabled" name="alertEnabled" style={{ width: 'auto' }} />
                        <label htmlFor="alertEnabled" style={{ display: 'inline-block', margin: 0, fontWeight: 'normal' }}>
                          Habilitar alertas
                        </label>
                      </FormGroup>
                    </div>
                    
                    <InfoMessage>
                      <strong>Ajusta los umbrales de stock</strong> para recibir alertas cuando sea necesario reponer este consumible. 
                      El stock mínimo marca cuando el sistema mostrará una alerta. El stock ideal es el nivel óptimo que se debería mantener.
                    </InfoMessage>
                    
                    <SliderContainer>
                      <SliderTrack percentage={calculatePercentage(values.currentStock)} />
                      <SliderMarker 
                        position={calculatePercentage(values.minimumStock)} 
                        value={values.minimumStock}
                        color="var(--warning)"
                      />
                      <SliderMarker 
                        position={calculatePercentage(values.idealStock)} 
                        value={values.idealStock}
                        color="var(--success)"
                      />
                    </SliderContainer>
                    
                    <SliderLabels>
                      <span>0</span>
                      <span>{maxQuantity}</span>
                    </SliderLabels>
                    
                    <Legend>
                      <LegendItem color="var(--primary)">
                        <span></span>
                        Stock Actual: {values.currentStock}
                      </LegendItem>
                      <LegendItem color="var(--warning)">
                        <span></span>
                        Stock Mínimo: 
                        <Field 
                          type="number" 
                          id="minimumStock" 
                          name="minimumStock" 
                          min="0"
                          style={{ 
                            width: '70px', 
                            display: 'inline-block', 
                            marginLeft: 'var(--spacing-xs)',
                            padding: '4px 8px'
                          }}
                        />
                      </LegendItem>
                      <LegendItem color="var(--success)">
                        <span></span>
                        Stock Ideal: 
                        <Field 
                          type="number" 
                          id="idealStock" 
                          name="idealStock" 
                          min="0"
                          style={{ 
                            width: '70px', 
                            display: 'inline-block', 
                            marginLeft: 'var(--spacing-xs)',
                            padding: '4px 8px'
                          }}
                        />
                      </LegendItem>
                    </Legend>
                    
                    <div style={{ marginTop: 'var(--spacing-md)' }}>
                      <FormGroup style={{ margin: 0, display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                        <Field type="checkbox" id="isPriority" name="isPriority" style={{ width: 'auto' }} />
                        <label htmlFor="isPriority" style={{ display: 'inline-block', margin: 0, fontWeight: 'normal' }}>
                          Marcar como consumible prioritario
                        </label>
                      </FormGroup>
                      {values.isPriority && (
                        <div style={{ 
                          fontSize: '0.85rem', 
                          color: 'var(--text-muted)',
                          marginTop: 'var(--spacing-xs)',
                          marginLeft: '24px'
                        }}>
                          Los consumibles prioritarios se destacan en la vista de stock bajo y pueden generar notificaciones adicionales.
                        </div>
                      )}
                    </div>
                  </ThresholdSlider>
                </FormSection>
                
                <FormSection>
                  <h3>Información Adicional</h3>
                  
                  <FormGroup>
                    <label htmlFor="compatibleWith">Compatible Con</label>
                    <Field type="text" id="compatibleWith" name="compatibleWith" placeholder="Equipos o modelos compatibles" />
                    <ErrorMessage name="compatibleWith" component={ErrorText} />
                  </FormGroup>
                  
                  <FormGroup>
                    <label htmlFor="description">Descripción</label>
                    <Field 
                      as="textarea" 
                      id="description" 
                      name="description" 
                      placeholder="Detalles adicionales, especificaciones, etc."
                    />
                    <ErrorMessage name="description" component={ErrorText} />
                  </FormGroup>
                </FormSection>
                
                <FormActions>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/inventory/low-stock')}
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
                        Guardando...
                      </>
                    ) : (
                      id ? 'Actualizar Consumible' : 'Crear Consumible'
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

export default ConsumableForm;
