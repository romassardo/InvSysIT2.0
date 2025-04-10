import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import styled from 'styled-components';
import FeatherIcon from 'feather-icons-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
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
  flex-wrap: wrap;
  gap: var(--spacing-md);
  font-size: 0.9rem;
  color: var(--text-secondary);
`;

const RadioGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-xs);
`;

const RadioOption = styled.label`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
  cursor: pointer;
  padding: var(--spacing-xs) 0;
  
  input {
    width: auto;
  }
`;

const AssignForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [asset, setAsset] = useState(null);
  const [employees, setEmployees] = useState([]);
  const [areas, setAreas] = useState([]);
  const [locations, setLocations] = useState([]);
  
  // Usar el contexto de notificaciones
  const { showNotification } = useNotification();
  
  const initialValues = {
    assetId: id || '',
    serialNumber: '',
    assigneeType: 'employee',
    employeeId: '',
    areaId: '',
    location: '',
    assignmentDate: new Date().toISOString().split('T')[0],
    expectedReturnDate: '',
    purpose: '',
    notes: '',
    termsAccepted: false,
    // Información adicional específica para notebooks y celulares
    additionalInfo: {}
  };
  
  // Referencia a todos los activos disponibles para asignación (notebooks y celulares)
  const [availableAssets, setAvailableAssets] = useState([]);

  // Estado para almacenar los números de serie seleccionados
  const [selectedSerial, setSelectedSerial] = useState('');
  
  // Simular carga de datos
  useEffect(() => {
    // En una implementación real, estos datos vendrían de la API
    const mockEmployees = [
      { id: 1, name: 'Juan Pérez', department: 'Desarrollo', email: 'juan.perez@empresa.com' },
      { id: 2, name: 'María López', department: 'Marketing', email: 'maria.lopez@empresa.com' },
      { id: 3, name: 'Carlos González', department: 'Administración', email: 'carlos.gonzalez@empresa.com' },
      { id: 4, name: 'Ana Martínez', department: 'Recursos Humanos', email: 'ana.martinez@empresa.com' },
      { id: 5, name: 'Pedro Sánchez', department: 'Ventas', email: 'pedro.sanchez@empresa.com' }
    ];
    
    // Activos asignables (solo notebooks y celulares)
    const mockAssets = [
      { 
        id: 101, 
        name: 'Notebook Dell Latitude 7400', 
        category: 'Computadoras', 
        subcategory: 'Notebooks', 
        icon: 'laptop', 
        requiresSerial: true,
        currentStock: 3,
        serialNumbers: ['DL7400-123456', 'DL7400-123457', 'DL7400-123458'],
        requiresAdditionalInfo: true,
        additionalInfoFields: [
          { name: 'encryptionPass', label: 'encryption pass', type: 'password' }
        ]
      },
      { 
        id: 102, 
        name: 'iPhone 13 Pro', 
        category: 'Celulares', 
        subcategory: '', 
        icon: 'smartphone', 
        requiresSerial: true,
        currentStock: 2,
        serialNumbers: ['IP13-456789', 'IP13-456790'],
        requiresAdditionalInfo: true,
        additionalInfoFields: [
          { name: 'phoneNumber', label: 'Número de Teléfono', type: 'text' },
          { name: 'gmailAccount', label: 'Cuenta Gmail', type: 'email' },
          { name: 'gmailPassword', label: 'Contraseña Gmail', type: 'password' },
          { name: 'whatsappVerification', label: 'Código de Verificación WhatsApp', type: 'text' }
        ]
      }
    ];
    
    setAvailableAssets(mockAssets);
    
    const mockAreas = [
      { id: 1, name: 'Sala de Reuniones', location: 'Oficina Central' },
      { id: 2, name: 'Recepción', location: 'Oficina Central' },
      { id: 3, name: 'Sala de Capacitación', location: 'Sucursal Norte' },
      { id: 4, name: 'Lobby', location: 'Sucursal Sur' }
    ];
    
    const mockLocations = [
      { id: 1, name: 'Oficina Central' },
      { id: 2, name: 'Sucursal Norte' },
      { id: 3, name: 'Sucursal Sur' }
    ];
    
    setEmployees(mockEmployees);
    setAreas(mockAreas);
    setLocations(mockLocations);
    
    // Si hay un ID, cargar datos del activo
    if (id) {
      // En una implementación real, estos datos vendrían de la API
      setTimeout(() => {
        // Datos simulados para una notebook disponible
        const mockAsset = {
          id: parseInt(id),
          name: 'Notebook Dell Latitude 7400',
          serialNumber: 'DL7400-123456',
          category: 'Computadoras',
          subcategory: 'Notebooks',
          status: 'En Stock',
          location: 'Oficina Central',
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
    serialNumber: Yup.string().required('Debe seleccionar un número de serie'),
    assigneeType: Yup.string().required('Tipo de asignación es obligatorio'),
    employeeId: Yup.string().when('assigneeType', {
      is: 'employee',
      then: () => Yup.string().required('El empleado es obligatorio'),
      otherwise: () => Yup.string()
    }),
    areaId: Yup.string().when('assigneeType', {
      is: 'area',
      then: () => Yup.string().required('El área es obligatoria'),
      otherwise: () => Yup.string()
    }),
    location: Yup.string().required('La ubicación es obligatoria'),
    assignmentDate: Yup.date().required('La fecha de asignación es obligatoria'),
    expectedReturnDate: Yup.date().min(
      Yup.ref('assignmentDate'),
      'La fecha de devolución debe ser posterior a la fecha de asignación'
    ),
    purpose: Yup.string().required('El propósito de uso es obligatorio'),
    notes: Yup.string(),
    termsAccepted: Yup.boolean().oneOf([true], 'Debe aceptar los términos de asignación'),
    // Validación dinámica para información adicional
    additionalInfo: Yup.object().when(['assetId'], (assetId, schema) => {
      const asset = assetId ? availableAssets.find(a => a.id.toString() === assetId[0]) : null;
      
      if (asset && asset.requiresAdditionalInfo && asset.additionalInfoFields) {
        const shapeObject = {};
        
        asset.additionalInfoFields.forEach(field => {
          shapeObject[field.name] = Yup.string().required(`${field.label} es obligatorio`);
        });
        
        return schema.shape(shapeObject);
      }
      
      return schema;
    })
  });
  
  // Función para deshacer la asignación de un activo
  const undoAssignment = (data) => {
    if (!data) return;
    
    // En una implementación real, aquí se realizaría la llamada a la API
    // para cancelar la asignación que acabamos de hacer
    console.log('Cancelando asignación de activo:', data);
    
    // Mostrar notificación informativa
    showNotification(
      `Asignación cancelada: ${data.assetName}`,
      'info'
    );
  };
  
  // Manejar cambio de selección de activo
  const handleAssetChange = (event, setFieldValue) => {
    const selectedAssetId = event.target.value;
    setFieldValue('assetId', selectedAssetId);
    setFieldValue('serialNumber', ''); // Resetear el número de serie
    setFieldValue('additionalInfo', {}); // Resetear información adicional
    
    // Si hay un ID, cargar datos del activo
    if (selectedAssetId) {
      const selectedAsset = availableAssets.find(a => a.id.toString() === selectedAssetId);
      if (selectedAsset) {
        setAsset(selectedAsset);
      }
    } else {
      setAsset(null);
    }
  };

  // Manejar selección de número de serie
  const handleSerialSelect = (serial, setFieldValue) => {
    setSelectedSerial(serial);
    setFieldValue('serialNumber', serial);
  };

  // Enviar formulario
  const handleSubmit = (values, { setSubmitting }) => {
    console.log('Valores del formulario:', values);
    
    // Obtener el activo seleccionado
    const selectedAsset = availableAssets.find(a => a.id.toString() === values.assetId);
    
    // Obtener nombre del activo para la notificación
    const assetName = selectedAsset ? selectedAsset.name : 'Activo #' + values.assetId;
    
    // Obtener nombre del asignado (empleado o área)
    let assigneeName = '';
    if (values.assigneeType === 'employee') {
      const employee = employees.find(e => e.id.toString() === values.employeeId);
      assigneeName = employee ? employee.name : 'Empleado #' + values.employeeId;
    } else {
      const area = areas.find(a => a.id.toString() === values.areaId);
      assigneeName = area ? area.name : 'Área #' + values.areaId;
    }
    
    // En una implementación real, aquí enviaríamos los datos a la API
    setTimeout(() => {
      setSubmitting(false);
      
      // NUEVO: Actualizar el stock (eliminar el número de serie usado)
      if (selectedAsset && selectedAsset.requiresSerial) {
        // Simulamos la actualización del stock reduciendo los números de serie disponibles
        const updatedAssets = availableAssets.map(asset => {
          if (asset.id === selectedAsset.id) {
            return {
              ...asset,
              currentStock: asset.currentStock - 1,
              serialNumbers: asset.serialNumbers.filter(sn => sn !== values.serialNumber)
            };
          }
          return asset;
        });
        
        setAvailableAssets(updatedAssets);
      }
      
      // Datos de la asignación para potencialmente deshacer
      const submittedData = {
        ...values,
        id: 'assignment-' + Date.now(), // Simulando un ID generado por el servidor
        assetName: assetName,
        assigneeName: assigneeName,
        serialNumber: values.serialNumber
      };
      
      // Mostrar notificación con opción de deshacer
      showNotification(
        `${assetName} (S/N: ${values.serialNumber}) asignado a ${assigneeName}`,
        'success',
        undoAssignment,
        submittedData
      );
      
      // Redirigir a la página de activos asignados
      navigate('/inventory/assigned');
    }, 1000);
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
            <FeatherIcon icon="user-plus" size={24} color="var(--primary)" />
            Asignar Activo
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
          <FeatherIcon icon="user-plus" size={24} color="var(--primary)" />
          Asignar Activo
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
                      <Field 
                        as="select" 
                        id="assetId" 
                        name="assetId"
                        onChange={(e) => handleAssetChange(e, setFieldValue)}
                      >
                        <option value="">Seleccionar Activo</option>
                        {availableAssets
                          .filter(assetItem => 
                            assetItem.category === 'Computadoras' && assetItem.subcategory === 'Notebooks' || 
                            assetItem.category === 'Celulares'
                          )
                          .map(assetItem => (
                            <option key={assetItem.id} value={assetItem.id} disabled={assetItem.currentStock === 0}>
                              {assetItem.name} ({assetItem.currentStock} disponibles)
                            </option>
                          ))}
                      </Field>
                      <ErrorMessage name="assetId" component={ErrorText} />
                    </FormGroup>
                  </FormSection>
                )}
                
                {asset && asset.requiresSerial && (
                  <FormSection>
                    <h3>Seleccionar Número de Serie</h3>
                    <FormGroup>
                      <label>Números de Serie Disponibles</label>
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                        gap: 'var(--spacing-sm)',
                        marginTop: 'var(--spacing-xs)'
                      }}>
                        {asset.serialNumbers.map(serial => (
                          <div 
                            key={serial}
                            style={{
                              border: '1px solid rgba(0, 0, 0, 0.1)',
                              borderColor: values.serialNumber === serial ? 'var(--primary)' : 'rgba(0, 0, 0, 0.1)',
                              backgroundColor: values.serialNumber === serial ? 'var(--primary-light)' : 'transparent',
                              borderRadius: 'var(--border-radius-sm)',
                              padding: 'var(--spacing-sm)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              cursor: 'pointer',
                              transition: 'all 0.2s'
                            }}
                            onClick={() => handleSerialSelect(serial, setFieldValue)}
                          >
                            {serial}
                            {values.serialNumber === serial && (
                              <FeatherIcon icon="check" size={14} style={{ marginLeft: '5px' }} />
                            )}
                          </div>
                        ))}
                      </div>
                      <ErrorMessage name="serialNumber" component={ErrorText} />
                    </FormGroup>
                  </FormSection>
                )}
                
                {asset && asset.requiresAdditionalInfo && asset.additionalInfoFields && (
                  <FormSection>
                    <h3>Información Técnica</h3>
                    <div style={{ 
                      padding: 'var(--spacing-md)', 
                      backgroundColor: 'rgba(0, 0, 0, 0.02)', 
                      borderRadius: 'var(--border-radius-sm)',
                      marginBottom: 'var(--spacing-md)'
                    }}>
                      {asset.additionalInfoFields.map(field => (
                        <FormGroup key={field.name}>
                          <label htmlFor={`additionalInfo.${field.name}`}>{field.label}</label>
                          <Field
                            name={`additionalInfo.${field.name}`}
                            id={`additionalInfo.${field.name}`}
                            type={field.type}
                          />
                          <ErrorMessage name={`additionalInfo.${field.name}`} component={ErrorText} />
                        </FormGroup>
                      ))}
                    </div>
                  </FormSection>
                )}
                
                <FormSection>
                  <h3>Tipo de Asignación</h3>
                  <FormGroup>
                    <RadioGroup>
                      <RadioOption>
                        <Field 
                          type="radio" 
                          id="assigneeTypeEmployee" 
                          name="assigneeType" 
                          value="employee"
                        />
                        <span>Asignar a un Empleado</span>
                      </RadioOption>
                      
                      <RadioOption>
                        <Field 
                          type="radio" 
                          id="assigneeTypeArea" 
                          name="assigneeType" 
                          value="area"
                        />
                        <span>Asignar a un Área</span>
                      </RadioOption>
                    </RadioGroup>
                    <ErrorMessage name="assigneeType" component={ErrorText} />
                  </FormGroup>
                </FormSection>
                
                {values.assigneeType === 'employee' ? (
                  <FormSection>
                    <h3>Información del Empleado</h3>
                    <FormGroup>
                      <label htmlFor="employeeId">Empleado*</label>
                      <Field as="select" id="employeeId" name="employeeId">
                        <option value="">Seleccionar Empleado</option>
                        {employees.map(employee => (
                          <option key={employee.id} value={employee.id}>
                            {employee.name} - {employee.department}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="employeeId" component={ErrorText} />
                    </FormGroup>
                    
                    {values.employeeId && (
                      <div style={{ 
                        padding: 'var(--spacing-sm) var(--spacing-md)',
                        backgroundColor: 'rgba(0, 0, 0, 0.02)',
                        borderRadius: 'var(--border-radius-sm)',
                        marginTop: 'var(--spacing-xs)'
                      }}>
                        {(() => {
                          const employee = employees.find(e => e.id === parseInt(values.employeeId));
                          return employee ? (
                            <>
                              <div style={{ fontSize: '0.9rem', marginBottom: 'var(--spacing-xs)' }}>
                                <strong>Departamento:</strong> {employee.department}
                              </div>
                              <div style={{ fontSize: '0.9rem' }}>
                                <strong>Email:</strong> {employee.email}
                              </div>
                            </>
                          ) : null;
                        })()}
                      </div>
                    )}
                  </FormSection>
                ) : (
                  <FormSection>
                    <h3>Información del Área</h3>
                    <FormGroup>
                      <label htmlFor="areaId">Área*</label>
                      <Field as="select" id="areaId" name="areaId">
                        <option value="">Seleccionar Área</option>
                        {areas.map(area => (
                          <option key={area.id} value={area.id}>
                            {area.name} - {area.location}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="areaId" component={ErrorText} />
                    </FormGroup>
                  </FormSection>
                )}
                
                <FormSection>
                  <h3>Detalles de la Asignación</h3>
                  <FieldGrid>
                    <FormGroup>
                      <label htmlFor="location">Ubicación*</label>
                      <Field as="select" id="location" name="location">
                        <option value="">Seleccionar Ubicación</option>
                        {locations.map(location => (
                          <option key={location.id} value={location.name}>
                            {location.name}
                          </option>
                        ))}
                      </Field>
                      <ErrorMessage name="location" component={ErrorText} />
                    </FormGroup>
                    
                    <FormGroup>
                      <label htmlFor="assignmentDate">Fecha de Asignación*</label>
                      <Field type="date" id="assignmentDate" name="assignmentDate" />
                      <ErrorMessage name="assignmentDate" component={ErrorText} />
                    </FormGroup>
                    
                    
                    <FormGroup>
                      <label htmlFor="purpose">Propósito de Uso*</label>
                      <Field as="select" id="purpose" name="purpose">
                        <option value="">Seleccionar Propósito</option>
                        <option value="Uso Laboral">Uso Laboral</option>
                        <option value="Proyecto Específico">Proyecto Específico</option>
                        <option value="Sustitución Temporal">Sustitución Temporal</option>
                        <option value="Teletrabajo">Teletrabajo</option>
                        <option value="Eventos">Eventos</option>
                        <option value="Otro">Otro (especificar en notas)</option>
                      </Field>
                      <ErrorMessage name="purpose" component={ErrorText} />
                    </FormGroup>
                  </FieldGrid>
                  
                  <FormGroup>
                    <label htmlFor="notes">Notas Adicionales</label>
                    <Field 
                      as="textarea" 
                      id="notes" 
                      name="notes" 
                      placeholder="Especificar cualquier condición especial, detalles sobre el propósito de uso, etc."
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
                        <FeatherIcon icon="user-check" size={16} style={{ marginRight: 'var(--spacing-xs)' }} />
                        Asignar Activo
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

export default AssignForm;
