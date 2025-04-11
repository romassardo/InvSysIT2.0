import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import FeatherIcon from 'feather-icons-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { productService, categoryService } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

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
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
  
  // Cargar datos de categorías y consumibles desde la API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Cargar categorías
        const categoriesResponse = await categoryService.getAll();
        
        // Filtrar solo categorías de consumibles y componentes
        const relevantCategories = categoriesResponse.data.filter(cat => 
          ['Consumibles', 'Componentes'].includes(cat.name));
        
        // Transformar las categorías al formato necesario para el formulario
        const formattedCategories = relevantCategories.map(category => {
          // Extraer subcategorías - en la API podrían estar como hijos o como un array
          let subcategories = [];
          if (category.children && Array.isArray(category.children)) {
            subcategories = category.children.map(child => child.name);
          } else if (category.subcategories && Array.isArray(category.subcategories)) {
            subcategories = category.subcategories;
          }
          
          return {
            id: category.id,
            name: category.name,
            subcategories: subcategories
          };
        });
        
        setCategories(formattedCategories);
        
        // Establecer subcategorías iniciales (de la categoría 'Consumibles')
        const consumablesCategory = formattedCategories.find(c => c.name === 'Consumibles');
        if (consumablesCategory) {
          setSubcategories(consumablesCategory.subcategories);
        }
        
        // Si hay un ID, cargar datos del consumible
        if (id) {
          const response = await productService.getById(id);
          const productData = response.data;
          
          // Calcular valores para el slider basado en los datos del producto
          const maxStockValue = Math.max(
            productData.currentStock || 0,
            productData.minimumStock || 0,
            productData.idealStock || 0,
            30 // Valor mínimo predeterminado para el slider
          ) * 1.5; // Agregar un 50% extra para el slider
          
          setMaxQuantity(Math.ceil(maxStockValue));
          
          // Extraer categoría y subcategoría del categoryPath
          let category = '';
          let subcategory = '';
          
          if (productData.categoryPath) {
            const parts = productData.categoryPath.split('/');
            category = parts[0];
            subcategory = parts.slice(1).join('/');
          }
          
          // Formatear los datos del consumible para el formulario
          const formattedConsumable = {
            id: productData.id,
            name: productData.name,
            category: category,
            subcategory: subcategory,
            sku: productData.sku || '',
            currentStock: productData.currentStock || 0,
            minimumStock: productData.minimumThreshold || 0,
            idealStock: productData.idealStock || 0,
            location: productData.location || 'Depósito Central',
            unitPrice: productData.unitPrice || '',
            supplier: productData.supplier || '',
            compatibleWith: productData.compatibleWith || '',
            description: productData.description || '',
            alertEnabled: productData.alertEnabled !== false, // Default to true
            isPriority: productData.isPriority || false
          };
          
          setConsumable(formattedConsumable);
          
          // Actualizar subcategorías basadas en la categoría del consumible
          if (category) {
            const productCategory = formattedCategories.find(c => c.name === category);
            if (productCategory) {
              setSubcategories(productCategory.subcategories);
            }
          }
        }
        
        setLoading(false);
      } catch (error) {
        console.error('Error al cargar datos:', error);
        setError('Error al cargar los datos. Por favor, intente nuevamente.');
        showNotification('Error al cargar datos del consumible', 'error');
        setLoading(false);
      }
    };
    
    loadData();
  }, [id, showNotification]);
  
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
  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      // Preparar los datos para enviar a la API
      const productData = {
        name: values.name,
        categoryPath: values.subcategory 
          ? `${values.category}/${values.subcategory}` 
          : values.category,
        sku: values.sku,
        currentStock: values.currentStock,
        minimumThreshold: values.minimumStock,
        idealStock: values.idealStock,
        location: values.location,
        unitPrice: values.unitPrice,
        supplier: values.supplier,
        compatibleWith: values.compatibleWith,
        description: values.description,
        alertEnabled: values.alertEnabled,
        isPriority: values.isPriority,
        // Marcar como consumible (no asset)
        type: 'consumable',
        // Los consumibles no requieren seguimiento de números de serie
        trackSerial: false
      };
      
      let response;
      if (id) {
        // Actualizar consumible existente
        response = await productService.update(id, productData);
        showNotification('Consumible actualizado correctamente', 'success');
      } else {
        // Crear nuevo consumible
        response = await productService.create(productData);
        showNotification('Consumible creado correctamente', 'success');
      }
      
      // Redirigir a la página de listado
      navigate('/inventory/low-stock');
    } catch (error) {
      console.error('Error al guardar consumible:', error);
      showNotification('Error al guardar el consumible. Por favor, intente nuevamente.', 'error');
    } finally {
      setSubmitting(false);
    }
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
  
  if (error) {
    return (
      <div>
        <PageHeader>
          <PageTitle>
            <FeatherIcon icon="alert-triangle" size={24} color="var(--danger)" />
            Error
          </PageTitle>
        </PageHeader>
        
        <Card>
          <div style={{ padding: 'var(--spacing-lg)' }}>
            <p>{error}</p>
            <Button 
              variant="primary" 
              onClick={() => window.location.reload()}
              style={{ marginTop: 'var(--spacing-md)' }}
            >
              Reintentar
            </Button>
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
