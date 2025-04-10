import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage as FormikErrorMessage, FieldArray } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import Icon from '../../components/ui/Icon';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

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



const SearchInput = styled.input`
  width: 100%;
  padding: var(--spacing-sm);
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius-sm);
  font-size: 1rem;
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 2px rgba(var(--primary-rgb), 0.1);
  }
`;

const SearchResults = styled.div`
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  z-index: 100;
  background-color: var(--card-bg, #fff);
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.1));
  border-radius: var(--border-radius-sm);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  max-height: 300px;
  overflow-y: auto;
`;

const SearchResultItem = styled.div`
  padding: var(--spacing-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--border-color, rgba(0, 0, 0, 0.05));
  
  &:last-child {
    border-bottom: none;
  }
  
  &:hover {
    background-color: var(--hover-bg, rgba(0, 0, 0, 0.03));
  }
`;

const ItemIcon = styled.div`
  margin-right: var(--spacing-sm);
  color: var(--primary);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ItemDetails = styled.div`
  flex-grow: 1;
`;

const ItemName = styled.div`
  font-weight: 600;
  color: var(--text-primary, #000);
`;

const ItemCategory = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary, #555);
`;

const SerialNumbersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: var(--spacing-sm);
  margin-top: var(--spacing-xs);
`;

const SerialNumberItem = styled.div`
  border: 1px solid rgba(0, 0, 0, 0.1);
  border-radius: var(--border-radius-sm);
  padding: var(--spacing-sm);
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: all 0.2s;
  
  &:hover {
    background-color: rgba(0, 0, 0, 0.03);
  }
  
  &.selected {
    border-color: var(--primary);
    background-color: var(--primary-light);
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

const InfoAlert = styled.div`
  background-color: var(--warning-light);
  border-left: 4px solid var(--warning);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  
  .alert-icon {
    color: var(--warning);
    flex-shrink: 0;
  }
  
  .alert-content {
    font-size: 0.95rem;
    color: var(--text-primary);
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

const StockInfo = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-top: var(--spacing-xs);
  align-items: center;
  
  .stock-label {
    font-size: 0.85rem;
    color: var(--text-muted);
  }
  
  .stock-value {
    font-weight: 600;
  }
`;

const DestinationTypeOptions = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  
  .option {
    flex: 1;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: var(--border-radius-sm);
    padding: var(--spacing-md);
    cursor: pointer;
    transition: all 0.2s;
    
    &.selected {
      border-color: var(--primary);
      background-color: var(--primary-light);
    }
    
    .option-header {
      display: flex;
      align-items: center;
      gap: var(--spacing-sm);
      margin-bottom: var(--spacing-sm);
      
      .option-icon {
        color: var(--primary);
      }
      
      .option-title {
        font-weight: 600;
      }
    }
    
    .option-description {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
  }
`;
// Componentes estilizados faltantes
const Section = styled.div`
  margin-bottom: var(--spacing-lg);
`;

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-xs);
  border-bottom: 1px solid rgba(0, 0, 0, 0.05);
`;

const FormLabel = styled.label`
  display: block;
  font-weight: 600;
  margin-bottom: var(--spacing-xs);
  font-size: 0.95rem;
`;

const FormInput = styled.input`
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
`;

const FormRow = styled.div`
  display: flex;
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-md);
  
  > * {
    flex: 1;
  }
`;
// Componente principal
const InventoryOutForm = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [inventoryItems, setInventoryItems] = useState([]);
  const [filteredItems, setFilteredItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [showItemResults, setShowItemResults] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [destinationType, setDestinationType] = useState('employee');
  
  // Valores iniciales del formulario
  const initialValues = {
    itemId: '',
    quantity: 1,
    outputDate: new Date().toISOString().split('T')[0], // Fecha actual en formato YYYY-MM-DD
    notes: '',
    serialNumbers: [], // Números de serie seleccionados
    destination: {
      type: 'employee', // 'employee', 'department', 'branch', 'project'
      id: '',
      name: '',
    },
    // Información adicional específica para notebooks y celulares
    additionalInfo: {}
  };
  
  // Cargar inventario disponible
  useEffect(() => {
    // En una implementación real, estos datos vendrían de la API
    const mockInventoryItems = [
      { 
        id: 1, 
        name: 'Notebook Dell Latitude 7400', 
        category: 'Computadoras', 
        subcategory: 'Notebooks', 
        icon: 'Laptop', 
        requiresSerial: true,
        currentStock: 3,
        serialNumbers: ['DL7400-123456', 'DL7400-123457', 'DL7400-123458'],
        isTrackable: true,
        requiresAdditionalInfo: true,
        additionalInfoFields: [
          { name: 'bitlockerPassword', label: 'Contraseña de Bitlocker', type: 'password' }
        ]
      },
      { 
        id: 2, 
        name: 'iPhone 13 Pro', 
        category: 'Celulares', 
        icon: 'Smartphone', 
        requiresSerial: true,
        currentStock: 2,
        serialNumbers: ['IP13-456789', 'IP13-456790'],
        isTrackable: true,
        requiresAdditionalInfo: true,
        additionalInfoFields: [
          { name: 'phoneNumber', label: 'Número de Teléfono', type: 'text' },
          { name: 'gmailAccount', label: 'Cuenta Gmail', type: 'email' },
          { name: 'gmailPassword', label: 'Contraseña Gmail', type: 'password' },
          { name: 'whatsappVerification', label: 'Código de Verificación WhatsApp', type: 'text' }
        ]
      },
      { 
        id: 3, 
        name: 'Monitor Samsung 24"', 
        category: 'Periféricos', 
        subcategory: 'Monitores', 
        icon: 'Monitor', 
        requiresSerial: true,
        currentStock: 5,
        serialNumbers: ['SM24-001', 'SM24-002', 'SM24-003', 'SM24-004', 'SM24-005'],
        isTrackable: false
      },
      { 
        id: 4, 
        name: 'Teclado Logitech MX Keys', 
        category: 'Periféricos', 
        subcategory: 'Teclados', 
        icon: 'Type', 
        requiresSerial: false, 
        currentStock: 10,
        isTrackable: false
      },
      { 
        id: 5, 
        name: 'Cable HDMI 1.5m', 
        category: 'Consumibles', 
        subcategory: 'Cables', 
        icon: 'Paperclip', 
        requiresSerial: false,
        currentStock: 15,
        isTrackable: false
      },
      { 
        id: 6, 
        name: 'Toner HP 85A', 
        category: 'Consumibles', 
        subcategory: 'Toner', 
        icon: 'Box', 
        requiresSerial: false,
        currentStock: 7,
        isTrackable: false
      }
    ];
    
    setInventoryItems(mockInventoryItems);
    setLoading(false);
  }, []);
  
  // Lista de empleados
  const employeesList = [
    { id: 1, name: 'Juan Pérez', department: 'Desarrollo' },
    { id: 2, name: 'María López', department: 'Marketing' },
    { id: 3, name: 'Carlos González', department: 'Administración' },
    { id: 4, name: 'Ana Martínez', department: 'Recursos Humanos' },
    { id: 5, name: 'Pedro Sánchez', department: 'Ventas' }
  ];
  
  // Lista de departamentos
  const departmentsList = [
    { id: 1, name: 'Desarrollo' },
    { id: 2, name: 'Marketing' },
    { id: 3, name: 'Administración' },
    { id: 4, name: 'Recursos Humanos' },
    { id: 5, name: 'Ventas' }
  ];
  
  // Lista de sucursales
  const branchesList = [
    { id: 1, name: 'Oficina Central', location: 'Buenos Aires' },
    { id: 2, name: 'Sucursal Norte', location: 'Córdoba' },
    { id: 3, name: 'Sucursal Sur', location: 'Mar del Plata' }
  ];
  
  // Lista de proyectos
  const projectsList = [
    { id: 1, name: 'Proyecto Alpha', status: 'Activo' },
    { id: 2, name: 'Proyecto Beta', status: 'Activo' },
    { id: 3, name: 'Obra Nueva Centro', status: 'En Progreso' }
  ];
  
  // Estado para mostrar alerta cuando se busca notebook o celular
  const [showRedirectAlert, setShowRedirectAlert] = useState(false);
  
  // Verificar si un ítem es notebook o celular
  const isNotebookOrCellphone = (item) => {
    return (item.category === 'Computadoras' && item.subcategory === 'Notebooks') || 
           (item.category === 'Celulares');
  };
  
  // Manejar búsqueda de productos
  const handleItemSearch = (e, setFieldValue) => {
    const term = e.target.value;
    setSearchTerm(term);
    
    if (term.trim() === '') {
      setFilteredItems([]);
      setShowItemResults(false);
      setShowRedirectAlert(false);
      return;
    }
    
    // Filtrar productos que coincidan con el término de búsqueda
    const filtered = inventoryItems.filter(item => 
      item.name.toLowerCase().includes(term.toLowerCase()) ||
      item.category.toLowerCase().includes(term.toLowerCase()) ||
      (item.subcategory && item.subcategory.toLowerCase().includes(term.toLowerCase()))
    );
    
    // Verificar si hay notebooks o celulares en los resultados
    const notebooksOrCellphones = filtered.filter(item => isNotebookOrCellphone(item));
    
    if (notebooksOrCellphones.length > 0) {
      // Mostrar alerta de redirección
      setShowRedirectAlert(true);
    } else {
      setShowRedirectAlert(false);
    }
    
    // Filtrar notebooks y celulares de los resultados
    const filteredNoNotebooksCell = filtered.filter(item => !isNotebookOrCellphone(item));
    
    // Filtrar solo elementos con stock disponible
    const itemsWithStock = filteredNoNotebooksCell.filter(item => item.currentStock > 0);
    
    setFilteredItems(itemsWithStock);
    setShowItemResults(true);
  };
  
  // Manejar selección de producto desde los resultados de búsqueda
  const handleItemSelect = (item, setFieldValue, values) => {
    setSelectedItem(item);
    setFieldValue('itemId', item.id);
    setSearchTerm(item.name);
    setShowItemResults(false);
    
    // Ajustar campos del formulario basados en el producto seleccionado
    if (item.requiresSerial) {
      setFieldValue('serialNumbers', []);
    } else {
      // Si no requiere número de serie, vaciamos el array
      setFieldValue('serialNumbers', []);
    }
    
    // Establecer cantidad máxima al stock disponible
    const maxQuantity = item.currentStock;
    setFieldValue('quantity', 1);
    
    // Reiniciar información adicional si cambia el producto
    setFieldValue('additionalInfo', {});
    
    // Establecer tipo de destino por defecto a departamento
    setDestinationType('department');
    setFieldValue('destination.type', 'department');
  };
  
  // Limpiar selección de producto
  const clearItemSelection = (setFieldValue) => {
    setSelectedItem(null);
    setFieldValue('itemId', '');
    setSearchTerm('');
    setFilteredItems([]);
    setShowItemResults(false);
    setFieldValue('serialNumbers', []);
    setFieldValue('additionalInfo', {});
  };
  
  // Manejar cambio de tipo de destino
  const handleDestinationTypeChange = (type, setFieldValue) => {
    setDestinationType(type);
    setFieldValue('destination.type', type);
    setFieldValue('destination.id', '');
    setFieldValue('destination.name', '');
  };
  
  // Manejar selección de destino
  const handleDestinationSelect = (id, name, setFieldValue) => {
    setFieldValue('destination.id', id);
    setFieldValue('destination.name', name);
  };
  
  // Obtener el listado adecuado según el tipo de destino
  const getDestinationList = () => {
    switch (destinationType) {
      case 'department':
        return departmentsList;
      case 'branch':
        return branchesList;
      default:
        return [];
    }
  };
  
  // Manejar selección de número de serie
  const handleSerialSelect = (selected, setFieldValue, values) => {
    const serialNumbers = [...values.serialNumbers];
    
    if (serialNumbers.includes(selected)) {
      // Si ya está seleccionado, lo quitamos
      const newSerials = serialNumbers.filter(sn => sn !== selected);
      setFieldValue('serialNumbers', newSerials);
      setFieldValue('quantity', newSerials.length);
    } else {
      // Si no está seleccionado, lo agregamos
      const newSerials = [...serialNumbers, selected];
      setFieldValue('serialNumbers', newSerials);
      setFieldValue('quantity', newSerials.length);
    }
  };
  
  // Validación del formulario - solo se activa cuando un producto es seleccionado
  const validationSchema = Yup.object().shape({
    itemId: Yup.number().nullable(),
    quantity: Yup.number()
      .min(1, 'La cantidad debe ser al menos 1')
      .test(
        'max-stock', 
        'La cantidad no puede superar el stock disponible', 
        function(value) {
          if (!this.parent.itemId) return true; // Skip validation if no item selected
          const item = inventoryItems.find(i => i.id === this.parent.itemId);
          return !item || !value || value <= item.currentStock;
        }
      ),
    outputDate: Yup.date().nullable(),
    serialNumbers: Yup.array().when(['itemId'], (itemId, schema) => {
      if (!itemId || !itemId[0]) return schema; // Skip validation if no item selected
      const item = inventoryItems.find(i => i.id === itemId[0]);
      return item && item.requiresSerial
        ? schema.min(1, 'Debe seleccionar al menos un número de serie')
        : schema;
    }),
    destination: Yup.object().shape({
      type: Yup.string().nullable(),
      id: Yup.string().nullable(),
      name: Yup.string().nullable()
    }),
    // Validación dinámica para información adicional
    additionalInfo: Yup.object().when(['itemId'], (itemId, schema) => {
      if (!itemId || !itemId[0]) return schema; // Skip validation if no item selected
      const item = inventoryItems.find(i => i.id === itemId[0]);
      
      if (item && item.requiresAdditionalInfo && item.additionalInfoFields) {
        const shapeObject = {};
        
        item.additionalInfoFields.forEach(field => {
          shapeObject[field.name] = Yup.string().required(`${field.label} es obligatorio`);
        });
        
        return schema.shape(shapeObject);
      }
      
      return schema;
    })
  });
  
  // Enviar formulario
  const handleSubmit = (values, { setSubmitting, setErrors }) => {
    // Verificar que se haya seleccionado un producto
    if (!values.itemId) {
      setErrors({ itemId: 'Debe seleccionar un producto del inventario' });
      setSubmitting(false);
      return;
    }
    
    // Verificar cantidad
    if (!values.quantity || values.quantity < 1) {
      setErrors({ quantity: 'La cantidad es obligatoria y debe ser al menos 1' });
      setSubmitting(false);
      return;
    }
    
    // Verificar fecha
    if (!values.outputDate) {
      setErrors({ outputDate: 'La fecha de salida es obligatoria' });
      setSubmitting(false);
      return;
    }
    
    // Verificar destino
    if (!values.destination.id) {
      setErrors({ 'destination.id': 'Debe seleccionar un destino' });
      setSubmitting(false);
      return;
    }
    
    console.log('Valores del formulario:', values);
    
    // En una implementación real, aquí enviaríamos los datos a la API
    setTimeout(() => {
      setSubmitting(false);
      
      // Mostrar un mensaje de éxito y redireccionar
      alert('Salida de inventario registrada correctamente');
      navigate('/inventory');
    }, 1000);
  };
  
  if (loading) {
    return (
      <div>
        <PageHeader>
          <PageTitle>Salida de Inventario</PageTitle>
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
          <Icon name="LogOut" size={24} color="var(--primary)" />
          Salida de Inventario
        </PageTitle>
        <Button variant="secondary" onClick={() => navigate('/inventory')}>
          <Icon name="ArrowLeft" size={16} style={{ marginRight: 'var(--spacing-xs)' }} />
          Volver al Inventario
        </Button>
      </PageHeader>
      
      <Card>
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ values, errors, touched, setFieldValue, isSubmitting }) => (
            <Form>
              <FormContainer>
                {/* Selector de Producto */}
                <Section>
                  <SectionTitle>Producto</SectionTitle>
                  
                  <div style={{ position: 'relative' }}>
                    <FormGroup>
                      <FormLabel htmlFor="itemSearch">Buscar Producto</FormLabel>
                      <SearchInput
                        id="itemSearch"
                        type="text"
                        placeholder="Buscar por nombre, categoría o subcategoría..."
                        value={searchTerm}
                        onChange={(e) => handleItemSearch(e, setFieldValue)}
                        autoComplete="off"
                      />
                      
                      {selectedItem && (
                        <div style={{ position: 'absolute', right: '10px', top: '39px', cursor: 'pointer' }}>
                          <Icon 
                            name="X" 
                            size={16} 
                            onClick={() => clearItemSelection(setFieldValue)} 
                            style={{ color: 'var(--text-muted)' }}
                          />
                        </div>
                      )}
                      
                      {/* Mensaje de alerta para redirigir a formulario de asignación */}
                      {showRedirectAlert && (
                        <div style={{ 
                          backgroundColor: 'var(--warning-light)',
                          borderLeft: '4px solid var(--warning)',
                          padding: 'var(--spacing-md)',
                          marginTop: 'var(--spacing-sm)',
                          marginBottom: 'var(--spacing-sm)',
                          borderRadius: '0 var(--border-radius-sm) var(--border-radius-sm) 0',
                          fontSize: '0.9rem'
                        }}>
                          <strong>Importante:</strong> Los notebooks y celulares deben ser gestionados a través del 
                          <a 
                            href="/inventory/assign/new" 
                            style={{ color: 'var(--primary)', fontWeight: 'bold', textDecoration: 'underline', marginLeft: '5px' }}
                            onClick={(e) => {
                              e.preventDefault();
                              navigate('/inventory/assign/new');
                            }}
                          >
                            formulario de asignación
                          </a>.
                        </div>
                      )}
                      
                      {showItemResults && filteredItems.length > 0 && (
                        <SearchResults>
                          {filteredItems.map(item => (
                            <SearchResultItem 
                              key={item.id} 
                              onClick={() => handleItemSelect(item, setFieldValue, values)}
                            >
                              <ItemIcon>
                                <Icon name={item.icon || 'Package'} size={18} />
                              </ItemIcon>
                              <ItemDetails>
                                <ItemName>{item.name}</ItemName>
                                <ItemCategory>
                                  {item.category} {item.subcategory ? `/ ${item.subcategory}` : ''}
                                </ItemCategory>
                              </ItemDetails>
                              <StockInfo>
                                <span className="stock-label">Stock:</span>
                                <span className="stock-value">{item.currentStock}</span>
                              </StockInfo>
                            </SearchResultItem>
                          ))}
                        </SearchResults>
                      )}
                      
                      {showItemResults && filteredItems.length === 0 && (
                        <SearchResults>
                          <div style={{ 
                            padding: 'var(--spacing-md)', 
                            textAlign: 'center', 
                            color: 'var(--text-muted)' 
                          }}>
                            No se encontraron productos con stock disponible
                          </div>
                        </SearchResults>
                      )}
                      
                      {errors.itemId && touched.itemId && (
                        <ErrorText>{errors.itemId}</ErrorText>
                      )}
                    </FormGroup>
                  </div>
                  
                  <FormRow>
                    <FormGroup>
                      <FormLabel htmlFor="outputDate">Fecha de Salida</FormLabel>
                      <FormInput
                        id="outputDate"
                        name="outputDate"
                        type="date"
                      />
                      <FormikErrorMessage component="div" name="outputDate" className="error-text" />
                    </FormGroup>
                    
                    <FormGroup>
                      <FormLabel htmlFor="quantity">Cantidad</FormLabel>
                      <FormInput
                        id="quantity"
                        name="quantity"
                        type="number"
                        min="1"
                        max={selectedItem ? selectedItem.currentStock : 999}
                      />
                      <FormikErrorMessage component="div" name="quantity" className="error-text" />
                    </FormGroup>
                  </FormRow>
                      
                      {/* Esta sección solo se muestra cuando hay un producto seleccionado con números de serie */}
                      {selectedItem && selectedItem.requiresSerial && selectedItem.serialNumbers && selectedItem.serialNumbers.length > 0 ? (
                        <div style={{ marginTop: 'var(--spacing-md)' }}>
                          <FormGroup>
                            <FormLabel>Números de Serie Disponibles</FormLabel>
                            <SerialNumbersGrid>
                              {selectedItem.serialNumbers.map(serial => (
                                <SerialNumberItem 
                                  key={serial}
                                  className={values.serialNumbers.includes(serial) ? 'selected' : ''}
                                  onClick={() => handleSerialSelect(serial, setFieldValue, values)}
                                >
                                  {serial}
                                  {values.serialNumbers.includes(serial) && (
                                    <Icon name="Check" size={14} style={{ marginLeft: '5px' }} />
                                  )}
                                </SerialNumberItem>
                              ))}
                            </SerialNumbersGrid>
                            {errors.serialNumbers && touched.serialNumbers && (
                              <ErrorText>{errors.serialNumbers}</ErrorText>
                            )}
                          </FormGroup>
                        </div>
                      ) : null}
                </Section>
                
                {/* Sección de Destino */}
                <Section>
                  <SectionTitle>Destino</SectionTitle>
                    
                    {/* Opciones de tipo de destino */}
                    <DestinationTypeOptions>
                      {/* Solo mostrar las opciones de departamento y sucursal */}
                      <div 
                        className={`option ${destinationType === 'department' ? 'selected' : ''}`}
                        onClick={() => handleDestinationTypeChange('department', setFieldValue)}
                      >
                        <div className="option-header">
                          <Icon name="Users" className="option-icon" />
                          <span className="option-title">Departamento</span>
                        </div>
                        <div className="option-description">
                          Asignar al inventario de un departamento completo
                        </div>
                      </div>
                      
                      <div 
                        className={`option ${destinationType === 'branch' ? 'selected' : ''}`}
                        onClick={() => handleDestinationTypeChange('branch', setFieldValue)}
                      >
                        <div className="option-header">
                          <Icon name="Home" className="option-icon" />
                          <span className="option-title">Sucursal</span>
                        </div>
                        <div className="option-description">
                          Enviar a una sucursal u oficina específica
                        </div>
                      </div>
                    </DestinationTypeOptions>
                    
                    {/* Lista de selección basada en el tipo de destino */}
                    <FormGroup>
                      <FormLabel>Seleccionar {destinationType === 'department' ? 'Departamento' : 'Sucursal'}</FormLabel>
                      <select
                        value={values.destination.id}
                        onChange={(e) => {
                          const selectedId = e.target.value;
                          const selectedItem = getDestinationList().find(item => item.id.toString() === selectedId);
                          if (selectedItem) {
                            handleDestinationSelect(selectedId, selectedItem.name, setFieldValue);
                          }
                        }}
                        className="form-select"
                      >
                        <option value="">Seleccione una opción</option>
                        {getDestinationList().map(item => (
                          <option key={item.id} value={item.id}>
                            {item.name} 
                            {destinationType === 'branch' && item.location ? ` (${item.location})` : ''}
                          </option>
                        ))}
                      </select>
                      {errors.destination && errors.destination.id && touched.destination && touched.destination.id && (
                        <ErrorText>{errors.destination.id}</ErrorText>
                      )}
                    </FormGroup>
                    
                    {/* Información adicional para notebooks y celulares */}
                    {selectedItem && selectedItem.requiresAdditionalInfo && selectedItem.additionalInfoFields ? (
                      <div style={{ marginTop: 'var(--spacing-md)' }}>
                        <FormGroup>
                          <FormLabel>Información Adicional</FormLabel>
                          <div style={{ 
                            padding: 'var(--spacing-md)', 
                            backgroundColor: 'rgba(0, 0, 0, 0.03)', 
                            borderRadius: 'var(--border-radius-sm)' 
                          }}>
                            {selectedItem.additionalInfoFields.map(field => (
                              <div key={field.name} style={{ marginBottom: 'var(--spacing-md)' }}>
                                <FormLabel htmlFor={`additionalInfo.${field.name}`}>{field.label}</FormLabel>
                                <Field
                                  name={`additionalInfo.${field.name}`}
                                  id={`additionalInfo.${field.name}`}
                                  type={field.type}
                                  className="form-input"
                                />
                                <FormikErrorMessage component="div" name={`additionalInfo.${field.name}`} className="error-text" />
                              </div>
                            ))}
                          </div>
                        </FormGroup>
                      </div>
                    ) : null}
                  </Section>
                
                {/* Sección de Notas */}
                <Section>
                  <SectionTitle>Notas Adicionales</SectionTitle>
                    <FormGroup>
                      <FormLabel htmlFor="notes">Notas (opcional)</FormLabel>
                      <Field
                        as="textarea"
                        id="notes"
                        name="notes"
                        className="form-textarea"
                        rows="3"
                        placeholder="Ingrese notas adicionales sobre esta salida de inventario..."
                      />
                    </FormGroup>
                    
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
                            Procesando...
                          </>
                        ) : (
                          <>
                            <Icon name="LogOut" size={16} style={{ marginRight: 'var(--spacing-xs)' }} />
                            Registrar Salida
                          </>
                        )}
                      </Button>
                    </FormActions>
                  </Section>
              </FormContainer>
            </Form>
          )}
        </Formik>
      </Card>
    </div>
  );
};

export default InventoryOutForm;
