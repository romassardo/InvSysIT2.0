import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import Icon from '../../components/ui/Icon';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
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
`;

const PageDescription = styled.p`
  color: var(--text-muted);
  margin: var(--spacing-xs) auto var(--spacing-lg);
  font-size: 0.95rem;
  max-width: 800px;
  text-align: center;
  line-height: 1.5;
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

const ProductCard = styled.div`
  display: flex;
  gap: var(--spacing-md);
  background-color: var(--primary-light);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  margin-bottom: var(--spacing-md);
  align-items: center;
`;

const ProductIcon = styled.div`
  background-color: var(--primary);
  width: 48px;
  height: 48px;
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const ProductInfo = styled.div`
  flex: 1;
  
  h4 {
    margin: 0 0 var(--spacing-xs);
    font-weight: 700;
  }
  
  p {
    margin: 0;
    font-size: 0.85rem;
    color: var(--text-muted);
  }
`;

const SerialEntryContainer = styled.div`
  margin-top: var(--spacing-md);
  background-color: rgba(0, 0, 0, 0.02);
  padding: var(--spacing-md);
  border-radius: var(--border-radius-md);
  border: 1px solid rgba(0, 0, 0, 0.05);
`;

const SerialNumberList = styled.div`
  margin-top: var(--spacing-md);
`;

const SerialNumberRow = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-sm);
  align-items: center;
  
  input {
    flex: 1;
  }
`;

const ScanButton = styled(Button)`
  padding: var(--spacing-sm);
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const RemoveButton = styled(Button)`
  padding: var(--spacing-sm);
  height: 40px;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
`;

// Componente principal
const InventoryEntryForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [showProductResults, setShowProductResults] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [lastSubmittedData, setLastSubmittedData] = useState(null);
  
  // Usar el contexto de notificaciones
  const { showNotification } = useNotification();
  
  // Valores iniciales del formulario
  const initialValues = {
    productId: '',
    quantity: 1,
    receiptDate: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
    notes: '',
    serialNumbers: [''], // Al menos un número de serie si es requerido
    additionalInfo: {
      // Información adicional dependiendo del tipo de producto
    }
  };
  
  // Cargar productos del catálogo
  useEffect(() => {
    // En una implementación real, estos datos vendrían de la API
    const mockCatalogProducts = [
      { 
        id: 1, 
        name: 'Notebook Dell Latitude 7400', 
        category: 'Computadoras', 
        subcategory: 'Notebooks', 
        icon: 'Package', 
        requiresSerial: true,
        defaultLocation: 'Almacén IT',
        minStock: 2
      },
      { 
        id: 2, 
        name: 'iPhone 13 Pro', 
        category: 'Celulares', 
        icon: 'Smartphone', 
        requiresSerial: true,
        defaultLocation: 'Almacén IT',
        minStock: 1
      },
      { 
        id: 3, 
        name: 'Monitor Samsung 24"', 
        category: 'Periféricos', 
        subcategory: 'Monitores', 
        icon: 'Monitor', 
        requiresSerial: true,
        defaultLocation: 'Almacén IT',
        minStock: 0
      },
      { 
        id: 4, 
        name: 'Teclado Logitech MX Keys', 
        category: 'Periféricos', 
        subcategory: 'Teclados', 
        icon: 'Type', 
        requiresSerial: false, 
        defaultLocation: 'Almacén IT',
        minStock: 3
      },
      { 
        id: 5, 
        name: 'Cable HDMI 1.5m', 
        category: 'Consumibles', 
        subcategory: 'Cables', 
        icon: 'Paperclip', 
        requiresSerial: false,
        defaultLocation: 'Almacén IT',
        minStock: 5
      },
      { 
        id: 6, 
        name: 'Toner HP 85A', 
        category: 'Consumibles', 
        subcategory: 'Toner', 
        icon: 'Box', 
        requiresSerial: false,
        defaultLocation: 'Almacén IT',
        minStock: 2
      }
    ];
    
    setCatalogProducts(mockCatalogProducts);
    setLoading(false);
  }, []);
  
  // Manejar búsqueda de productos
  const handleProductSearch = (e, setFieldValue) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredProducts([]);
      setShowProductResults(false);
      return;
    }
    
    // Filtrar productos que coincidan con el término de búsqueda
    const filtered = catalogProducts.filter(product => 
      product.name.toLowerCase().includes(term.toLowerCase()) ||
      product.category.toLowerCase().includes(term.toLowerCase()) ||
      (product.subcategory && product.subcategory.toLowerCase().includes(term.toLowerCase()))
    );
    
    setFilteredProducts(filtered);
    setShowProductResults(true);
  };
  
  // Manejar selección de producto desde los resultados de búsqueda
  const handleProductSelect = (product, setFieldValue, values) => {
    setSelectedProduct(product);
    setFieldValue('productId', product.id);
    setSearchTerm(product.name);
    setShowProductResults(false);
    
    // Ajustar campos del formulario basados en el producto seleccionado
    if (product.requiresSerial) {
      // Si requiere número de serie, aseguramos que haya tantos campos como cantidad
      const quantity = values ? values.quantity || 1 : 1;
      const newSerialNumbers = Array(quantity).fill('').map((_, index) => {
        return (values && values.serialNumbers && values.serialNumbers[index]) ? values.serialNumbers[index] : '';
      });
      setFieldValue('serialNumbers', newSerialNumbers);
    } else {
      // Si no requiere serial, vaciamos el array
      setFieldValue('serialNumbers', []);
    }
  };
  
  // Limpiar selección de producto
  const clearProductSelection = (setFieldValue) => {
    setSelectedProduct(null);
    setFieldValue('productId', '');
    setSearchTerm('');
    setFilteredProducts([]);
    setShowProductResults(false);
    setFieldValue('serialNumbers', ['']);
  };
  
  // Generar número de serie aleatorio para pruebas
  const handleGenerateSerial = (index, setFieldValue, serialNumbers) => {
    // Generamos un número de serie aleatorio para facilitar pruebas
    const randomSerial = 'SN-' + Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
    
    // Actualizamos el valor del campo correspondiente
    const updatedSerialNumbers = [...serialNumbers];
    updatedSerialNumbers[index] = randomSerial;
    setFieldValue('serialNumbers', updatedSerialNumbers);
  };
  
  // Validación del formulario
  const validationSchema = Yup.object().shape({
    productId: Yup.number().required('Debe seleccionar un producto del catálogo'),
    quantity: Yup.number()
      .required('La cantidad es obligatoria')
      .min(1, 'La cantidad debe ser al menos 1'),
    receiptDate: Yup.date().required('La fecha de recepción es obligatoria'),
    serialNumbers: Yup.array().when(['productId'], (productId, schema) => {
      const product = productId ? catalogProducts.find(p => p.id === productId[0]) : null;
      return product && product.requiresSerial
        ? schema
            .min(1, 'Debe ingresar al menos un número de serie')
            .of(
              Yup.string().required('El número de serie es obligatorio')
            )
        : schema;
    })
  });
  
  // Función para deshacer la última entrada de inventario
  const undoEntrySubmission = (data) => {
    if (!data) return;
    
    // En una implementación real, aquí se realizaría la llamada a la API
    // para eliminar la entrada que acabamos de crear
    console.log('Eliminando entrada de inventario:', data);
    
    // Mostrar notificación informativa
    showNotification(
      `Entrada de inventario revertida: ${data.quantity} ${data.productName}`,
      'info'
    );
  };
  
  // Enviar formulario
  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Valores del formulario:', values);
    
    // Guardar el producto seleccionado para la notificación
    const productName = selectedProduct ? selectedProduct.name : 'producto';
    
    // En una implementación real, aquí enviaríamos los datos a la API
    setTimeout(() => {
      setSubmitting(false);
      
      // Guardar los datos enviados para poder deshacer la acción si es necesario
      const submittedData = {
        ...values,
        id: 'inventory-entry-' + Date.now(), // Simulando un ID generado por el servidor
        productName: productName
      };
      
      // Mostrar notificación con opción de deshacer
      showNotification(
        `Entrada registrada: ${values.quantity} ${productName}`,
        'success',
        undoEntrySubmission,
        submittedData
      );
      
      // Redireccionar
      navigate('/inventory');
    }, 1000);
  };
  
  if (loading) {
    return (
      <div>
        <PageHeader>
          <PageTitle>Entrada de Inventario</PageTitle>
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
        <PageTitle>
          <Icon name="Package" size={24} style={{ marginRight: 'var(--spacing-sm)' }} />
          Entrada de Inventario
        </PageTitle>
        <Button
          icon="ArrowLeft"
          variant="outline"
          onClick={() => navigate('/inventory')}
        >
          Volver a Inventario
        </Button>
      </PageHeader>
      
      <PageDescription>
        Registre nuevos productos que ingresan al inventario.<br/>
        Seleccione del catálogo y complete los detalles requeridos.
      </PageDescription>
      
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ values, errors, touched, isSubmitting, setFieldValue }) => (
          <Form>
            <FormContainer>
              <Card>
                <FormSection data-component-name="P">
                  <h3 data-component-name="Formik">Información Básica</h3>
                  
                  <FormGroup className="sc-gplwa-d ifzSon" data-component-name="P">
                    <label htmlFor="productSearch" data-component-name="Formik">Producto*</label>
                    <div style={{ position: 'relative' }}>
                      <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
                        <Icon 
                          name="Search" 
                          size={16} 
                          style={{ 
                            position: 'absolute', 
                            left: '10px', 
                            pointerEvents: 'none',
                            color: '#b0b3b8'
                          }}
                        />
                        <input 
                          type="text" 
                          id="productSearch" 
                          placeholder="Buscar producto por nombre, categoría..." 
                          value={searchTerm}
                          onChange={(e) => handleProductSearch(e, setFieldValue)}
                          style={{ 
                            width: '100%', 
                            paddingLeft: '34px', 
                            paddingRight: '34px',
                            borderRadius: 'var(--border-radius-sm)',
                            border: '1px solid rgba(0, 0, 0, 0.1)',
                            padding: 'var(--spacing-sm) var(--spacing-md)',
                            fontSize: '1rem',
                            lineHeight: '1.5',
                            transition: 'border-color 0.2s'
                          }}
                        />
                        {searchTerm && (
                          <button 
                            type="button" 
                            onClick={() => clearProductSelection(setFieldValue)}
                            style={{ 
                              position: 'absolute', 
                              right: '10px', 
                              background: 'none', 
                              border: 'none', 
                              cursor: 'pointer',
                              display: 'flex', 
                              alignItems: 'center'
                            }}
                          >
                            <Icon name="X" size={16} />
                          </button>
                        )}
                      </div>

                      {/* Resultados de la búsqueda */}
                      {showProductResults && filteredProducts.length > 0 && (
                        <div style={{ 
                          position: 'absolute', 
                          top: '100%', 
                          left: '0', 
                          width: '100%', 
                          maxHeight: '250px',
                          overflowY: 'auto',
                          backgroundColor: '#242526',
                          border: '1px solid rgba(0, 0, 0, 0.1)',
                          borderRadius: 'var(--border-radius-sm)',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          zIndex: '10'
                        }}>
                          {filteredProducts.map(product => (
                            <div 
                              key={product.id} 
                              onClick={() => handleProductSelect(product, setFieldValue, values)}
                              style={{
                                padding: 'var(--spacing-sm) var(--spacing-md)',
                                borderBottom: '1px solid rgba(0, 0, 0, 0.1)',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 'var(--spacing-sm)',
                                transition: 'background-color 0.2s',
                                backgroundColor: '#242526',
                                color: '#ffffff'
                              }}
                              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#3a3b3c'}
                              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#242526'}
                            >
                              <div style={{ 
                                marginRight: '8px',
                                color: '#e4e6eb' 
                              }}>
                                <Icon name={product.icon || 'Package'} size={20} />
                              </div>
                              <div>
                                <div style={{ fontWeight: '500' }}>{product.name}</div>
                                <div style={{ fontSize: '0.85rem', color: '#b0b3b8' }}>
                                  {product.category} {product.subcategory ? `/ ${product.subcategory}` : ''}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {showProductResults && searchTerm.trim() !== '' && filteredProducts.length === 0 && (
                        <div style={{ 
                          position: 'absolute', 
                          top: '100%', 
                          left: '0', 
                          width: '100%',
                          padding: 'var(--spacing-md)',
                          backgroundColor: '#242526',
                          border: '1px solid rgba(0, 0, 0, 0.1)',
                          borderRadius: 'var(--border-radius-sm)',
                          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
                          textAlign: 'center',
                          color: '#e4e6eb',
                          zIndex: '10'
                        }}>
                          No se encontraron productos con ese criterio de búsqueda
                        </div>
                      )}
                    </div>
                    
                    {/* Campo oculto para mantener la compatibilidad con Formik */}
                    <Field type="hidden" name="productId" />
                    <ErrorMessage name="productId" component={ErrorText} />
                  </FormGroup>
                  
                  {selectedProduct && (
                    <ProductCard>
                      <ProductIcon>
                        <Icon name={selectedProduct.icon} size={24} color="white" />
                      </ProductIcon>
                      <ProductInfo>
                        <h4>{selectedProduct.name}</h4>
                        <p>
                          {selectedProduct.category} {selectedProduct.subcategory ? `/ ${selectedProduct.subcategory}` : ''} &nbsp;•&nbsp; 
                          Stock Mínimo: <Badge variant={selectedProduct.minStock > 0 ? "warning" : "default"}>{selectedProduct.minStock}</Badge>
                        </p>
                      </ProductInfo>
                    </ProductCard>
                  )}
                  
                  <FieldGrid className="sc-cTTdyq ffrRSM">
                    <FormGroup className="sc-gplwa-d ifzSon">
                      <label htmlFor="quantity" data-component-name="Formik">Cantidad*</label>
                      <Field 
                        type="number" 
                        id="quantity" 
                        name="quantity" 
                        min="1"
                        data-component-name="Field"
                      />
                      <ErrorMessage name="quantity" component={ErrorText} />
                    </FormGroup>
                    
                    <FormGroup className="sc-gplwa-d ifzSon" data-component-name="P">
                      <label htmlFor="receiptDate">Fecha de Recepción*</label>
                      <Field type="date" id="receiptDate" name="receiptDate" />
                      <ErrorMessage name="receiptDate" component={ErrorText} />
                    </FormGroup>
                    
                  </FieldGrid>
                </FormSection>
                
                {/* Números de serie para productos que lo requieren */}
                {selectedProduct && selectedProduct.requiresSerial && (
                  <FormSection data-component-name="P">
                    <h3 data-component-name="Formik">Números de Serie</h3>
                    <p style={{ fontSize: '0.95rem', color: 'var(--text-muted)' }}>
                      Este producto requiere registro de números de serie individuales.
                      {values.quantity > 1 && ' Por favor, registre los números de serie para todas las unidades.'}
                    </p>
                    
                    <SerialEntryContainer>
                      <FieldArray name="serialNumbers">
                        {({ remove, push }) => (
                          <>
                            <SerialNumberList>
                              {values.serialNumbers.map((serial, index) => (
                                <SerialNumberRow key={index}>
                                  <Field
                                    name={`serialNumbers.${index}`}
                                    placeholder={`Número de serie #${index+1}`}
                                    data-component-name="Field"
                                  />
                                  <ScanButton
                                    type="button"
                                    variant="icon"
                                    title="Generar serial"
                                    onClick={() => handleGenerateSerial(index, setFieldValue, values.serialNumbers)}
                                  >
                                    <Icon name="RefreshCw" size={16} />
                                  </ScanButton>
                                  {index > 0 && (
                                    <RemoveButton
                                      type="button"
                                      variant="icon"
                                      title="Eliminar"
                                      onClick={() => remove(index)}
                                    >
                                      <Icon name="X" size={16} />
                                    </RemoveButton>
                                  )}
                                </SerialNumberRow>
                              ))}
                            </SerialNumberList>
                            
                            {values.serialNumbers.length < values.quantity && (
                              <Button 
                                type="button" 
                                variant="outline"
                                onClick={() => push('')}
                                style={{ marginTop: 'var(--spacing-sm)' }}
                              >
                                <Icon name="Plus" size={16} style={{ marginRight: 'var(--spacing-xs)' }} />
                                Agregar Número de Serie
                              </Button>
                            )}
                          </>
                        )}
                      </FieldArray>
                    </SerialEntryContainer>
                    
                    {errors.serialNumbers && typeof errors.serialNumbers === 'string' && (
                      <ErrorText>{errors.serialNumbers}</ErrorText>
                    )}
                  </FormSection>
                )}
                
                <FormSection data-component-name="P">
                  <h3>Notas Adicionales</h3>
                  <FormGroup className="sc-gplwa-d ifzSon">
                    <label htmlFor="notes" data-component-name="Formik">Notas</label>
                    <Field 
                      as="textarea" 
                      id="notes" 
                      name="notes" 
                      placeholder="Cualquier información adicional relevante sobre esta entrada de inventario"
                      data-component-name="Field"
                    />
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
                      'Registrar Entrada'
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

export default InventoryEntryForm;
