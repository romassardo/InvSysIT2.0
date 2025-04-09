import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import Icon from '../../components/ui/Icon';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { useAuth } from '../../context/AuthContext';

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
`;

const PageDescription = styled.p`
  color: var(--text-muted);
  margin-top: var(--spacing-xs);
  font-size: 0.95rem;
`;

const FormContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--spacing-lg);
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

const AssetForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser, isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [initialValues, setInitialValues] = useState({
    // Información básica del producto en catálogo
    name: '',
    productCode: '',
    category: '',
    subcategory: '',
    manufacturer: '',
    model: '',
    supplier: '',
    minStock: 1,
    notes: '',
    // Campos específicos según categoría
    specifications: {
      processor: '',
      ram: '',
      storage: '',
      os: ''
    }
  });

  // Verificar si el usuario es administrador
  useEffect(() => {
    if (isAuthenticated && currentUser) {
      if (currentUser.role !== 'admin') {
        // Redireccionar si no es administrador
        navigate('/inventory');
        return;
      }
    }
  }, [isAuthenticated, currentUser, navigate]);

  // Simular carga de categorías y catálogo de productos
  useEffect(() => {
    // En una implementación real, estos datos vendrían de la API
    const mockCategories = [
      { id: 1, name: 'Computadoras', subcategories: ['Desktops', 'Notebooks', 'Raspberry Pi'] },
      { id: 2, name: 'Celulares', subcategories: [] },
      { id: 3, name: 'Periféricos', subcategories: ['Teclados', 'Mouse', 'Kit Teclado/Mouse', 'Auriculares', 'Webcams', 'Monitores', 'Televisores'] },
      { id: 4, name: 'Consumibles', subcategories: ['Cables', 'Pilas', 'Toner', 'Drum', 'Cargadores'] },
      { id: 5, name: 'Componentes', subcategories: ['Memorias RAM', 'Discos Externos', 'Discos SSD/NVMe', 'Placas Sending', 'Placas de Video', 'Motherboards', 'Adaptadores USB Varios'] }
    ];
    
    setCategories(mockCategories);
    
    // Simular carga de productos del catálogo
    const mockCatalog = [
      { id: 1, name: 'Notebook Dell Latitude 7400', category: 'Computadoras', subcategory: 'Notebooks', specs: { processor: 'Intel Core i7 10th Gen', ram: '16GB', storage: '512GB SSD', os: 'Windows 11 Pro' } },
      { id: 2, name: 'iPhone 13 Pro', category: 'Celulares', specs: { storage: '256GB' } },
      { id: 3, name: 'Monitor Samsung 24"', category: 'Periféricos', subcategory: 'Monitores' },
      { id: 4, name: 'Teclado Logitech MX Keys', category: 'Periféricos', subcategory: 'Teclados' },
      { id: 5, name: 'Cable HDMI 1.5m', category: 'Consumibles', subcategory: 'Cables' },
      { id: 6, name: 'Toner HP 85A', category: 'Consumibles', subcategory: 'Toner' },
      { id: 7, name: 'Desktop HP ProDesk 600', category: 'Computadoras', subcategory: 'Desktops', specs: { processor: 'Intel Core i5 9th Gen', ram: '8GB', storage: '256GB SSD', os: 'Windows 10 Pro' } },
      { id: 8, name: 'Memoria RAM Kingston 8GB DDR4', category: 'Componentes', subcategory: 'Memorias RAM' }
    ];
    
    setCatalogProducts(mockCatalog);
    
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
          manufacturer: 'Dell',
          model: 'Latitude 7400',
          purchaseDate: '2024-12-10',
          warrantyUntil: '2026-12-10',
          supplier: 'Dell Argentina',
          purchasePrice: '1500',
          currentValue: '1200',
          notes: 'Equipo nuevo para reemplazo de equipos obsoletos',
          specifications: {
            processor: 'Intel Core i7 10th Gen',
            ram: '16GB',
            storage: '512GB SSD',
            os: 'Windows 11 Pro'
          },
          encryptionPassword: 'DLBit-9876#43@1',
          macAddress: '00:1A:2B:3C:4D:5E',
          ipAddress: ''
        };
        
        setInitialValues(mockAsset);
        
        // Actualizar subcategorías
        const category = mockCategories.find(c => c.name === mockAsset.category);
        if (category) {
          setSubcategories(category.subcategories);
        }
        
        setLoading(false);
      }, 1000);
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
    // Campos obligatorios para la definición del producto
    name: Yup.string().required('El nombre del producto es obligatorio'),
    category: Yup.string().required('La categoría es obligatoria'),
    
    // Campos opcionales
    subcategory: Yup.string(),
    manufacturer: Yup.string(),
    model: Yup.string(),
    productCode: Yup.string(),
    supplier: Yup.string(),
    minStock: Yup.number().min(0, 'El stock mínimo no puede ser negativo'),
    notes: Yup.string()
  });
  
  // Enviar formulario
  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Valores del formulario:', values);
    
    // En una implementación real, aquí enviaríamos los datos a la API
    setTimeout(() => {
      setSubmitting(false);
      
      // Redirigir a la página de detalle o listado
      navigate(id ? `/inventory/asset/${id}` : '/inventory');
    }, 1000);
  };
  
  // Verificar autenticación y permisos
  if (!isAuthenticated || (currentUser && currentUser.role !== 'admin')) {
    return (
      <div>
        <PageHeader>
          <PageTitle>Acceso Restringido</PageTitle>
        </PageHeader>
        
        <Card>
          <div style={{ padding: 'var(--spacing-lg)', textAlign: 'center' }}>
            <p>Solo los administradores pueden acceder a esta página.</p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/inventory')}
              style={{ marginTop: 'var(--spacing-md)' }}
            >
              Volver al Inventario
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div>
        <PageHeader>
          <PageTitle>{id ? 'Editar Activo' : 'Crear Nuevo Activo'}</PageTitle>
        </PageHeader>
        
        <Card>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            padding: 'var(--spacing-xl)' 
          }}>
            <Icon name="Loader" size={36} />
          </div>
        </Card>
      </div>
    );
  }
  
  return (
    <div>
      <PageHeader>
        <PageTitle>{id ? 'Editar Producto en Catálogo' : 'Añadir Producto al Catálogo'}</PageTitle>
        <PageDescription>
          Define los productos que podrán ser ingresados al inventario. Solo los administradores pueden gestionar este catálogo.
        </PageDescription>
      </PageHeader>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
          <Form>
            <FormContainer>
              <Card>
                <FormSection>
                  <h3>Información Básica</h3>

                  <FieldGrid>
                    <FormGroup>
                      <label htmlFor="name">Nombre del Producto*</label>
                      <Field type="text" id="name" name="name" placeholder="Ej: Notebook Dell Latitude 7400" />
                      <ErrorMessage name="name" component={ErrorText} />
                    </FormGroup>
                    
                    <FormGroup>
                      <label htmlFor="productCode">Código del Producto</label>
                      <Field type="text" id="productCode" name="productCode" placeholder="Código interno o referencia" />
                      <ErrorMessage name="productCode" component={ErrorText} />
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
                    

                  </FieldGrid>
                </FormSection>
                
                <FormSection>
                  <h3>Detalles del Producto</h3>
                  <FieldGrid>
                    <FormGroup>
                      <label htmlFor="manufacturer">Fabricante</label>
                      <Field type="text" id="manufacturer" name="manufacturer" placeholder="Ej: Dell, HP, Samsung" />
                    </FormGroup>
                    
                    <FormGroup>
                      <label htmlFor="model">Modelo</label>
                      <Field type="text" id="model" name="model" placeholder="Ej: Latitude 7400, ProDesk 600" />
                    </FormGroup>
                    
                    <FormGroup>
                      <label htmlFor="supplier">Proveedor Habitual</label>
                      <Field type="text" id="supplier" name="supplier" placeholder="Ej: Proveedor Tecnológico S.A." />
                    </FormGroup>
                    
                    <FormGroup>
                      <label htmlFor="minStock">Stock Mínimo</label>
                      <Field type="number" id="minStock" name="minStock" min="0" />
                      <ErrorMessage name="minStock" component={ErrorText} />
                    </FormGroup>
                  </FieldGrid>
                </FormSection>
                
                {/* Campos específicos por categoría */}
                {values.category === 'Computadoras' && (
                  <FormSection>
                    <h3>Especificaciones Técnicas</h3>
                    <FieldGrid>
                      <FormGroup>
                        <label htmlFor="specifications.processor">Procesador</label>
                        <Field type="text" id="specifications.processor" name="specifications.processor" />
                      </FormGroup>
                      
                      <FormGroup>
                        <label htmlFor="specifications.ram">Memoria RAM</label>
                        <Field type="text" id="specifications.ram" name="specifications.ram" />
                      </FormGroup>
                      
                      <FormGroup>
                        <label htmlFor="specifications.storage">Almacenamiento</label>
                        <Field type="text" id="specifications.storage" name="specifications.storage" />
                      </FormGroup>
                      
                      <FormGroup>
                        <label htmlFor="specifications.os">Sistema Operativo</label>
                        <Field type="text" id="specifications.os" name="specifications.os" />
                      </FormGroup>
                      
                      <FormGroup>
                        <label htmlFor="macAddress">Dirección MAC</label>
                        <Field type="text" id="macAddress" name="macAddress" />
                      </FormGroup>
                      
                      <FormGroup>
                        <label htmlFor="ipAddress">Dirección IP</label>
                        <Field type="text" id="ipAddress" name="ipAddress" />
                      </FormGroup>
                      
                      {values.subcategory === 'Notebooks' && (
                        <FormGroup>
                          <label htmlFor="encryptionPassword">Contraseña de Encriptación*</label>
                          <Field type="text" id="encryptionPassword" name="encryptionPassword" />
                          <ErrorMessage name="encryptionPassword" component={ErrorText} />
                        </FormGroup>
                      )}
                    </FieldGrid>
                  </FormSection>
                )}
                
                {values.category === 'Celulares' && (
                  <FormSection>
                    <h3>Información Específica del Celular</h3>
                    <FieldGrid>
                      <FormGroup>
                        <label htmlFor="specifications.storage">Almacenamiento</label>
                        <Field type="text" id="specifications.storage" name="specifications.storage" />
                      </FormGroup>
                      
                      <FormGroup>
                        <label htmlFor="accountInfo">Información de Cuenta*</label>
                        <Field type="text" id="accountInfo" name="accountInfo" />
                        <ErrorMessage name="accountInfo" component={ErrorText} />
                      </FormGroup>
                    </FieldGrid>
                  </FormSection>
                )}
                
                <FormSection>
                  <h3>Notas Adicionales</h3>
                  <FormGroup>
                    <label htmlFor="notes">Notas</label>
                    <Field as="textarea" id="notes" name="notes" />
                  </FormGroup>
                </FormSection>
                
                <FormActions>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => navigate('/inventory')}
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
                        <Icon name="Loader" size={16} style={{ marginRight: 'var(--spacing-xs)' }} />
                        Guardando...
                      </>
                    ) : (
                      id ? 'Actualizar Producto en Catálogo' : 'Agregar Producto al Catálogo'
                    )}
                  </Button>
                </FormActions>
              </Card>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default AssetForm;
