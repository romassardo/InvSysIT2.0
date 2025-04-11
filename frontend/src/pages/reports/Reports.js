import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FeatherIcon from 'feather-icons-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import { reportService } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

// Modal para edición de reportes
const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-lg);
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: var(--spacing-lg);
`;

const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
  padding-bottom: var(--spacing-sm);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  
  h2 {
    font-size: 1.5rem;
    font-weight: 700;
    margin: 0;
  }
`;

const ModalForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
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

const ReportsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`;

const ReportCard = styled.div`
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-md);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  cursor: pointer;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
`;

const ReportIcon = styled.div`
  width: 50px;
  height: 50px;
  background-color: var(--primary-light);
  color: var(--primary);
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: var(--spacing-md);
`;

const ReportTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  margin: 0;
  margin-bottom: var(--spacing-xs);
`;

const ReportDescription = styled.p`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin: 0;
  margin-bottom: var(--spacing-md);
`;

const ReportActions = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: var(--spacing-xs);
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

const FilterBar = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-sm);
  margin-bottom: var(--spacing-lg);
  padding: var(--spacing-md);
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
`;

const FilterSelect = styled.select`
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  border: 1px solid rgba(0, 0, 0, 0.1);
  font-family: 'Nunito', sans-serif;
  font-size: 0.9rem;
  min-width: 150px;
  background-color: white;
`;

const DateInput = styled.input`
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  border: 1px solid rgba(0, 0, 0, 0.1);
  font-family: 'Nunito', sans-serif;
  font-size: 0.9rem;
  min-width: 150px;
  background-color: white;
`;

const Reports = () => {
  const [activeTab, setActiveTab] = useState('predefined');
  const [selectedReport, setSelectedReport] = useState(null);
  const [loading, setLoading] = useState({
    predefined: true,
    custom: true
  });
  const [error, setError] = useState({
    predefined: null,
    custom: null
  });
  const [showEditModal, setShowEditModal] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [reportToEdit, setReportToEdit] = useState(null);
  const [newReport, setNewReport] = useState({
    title: '',
    description: '',
    formats: ['pdf', 'excel'],
    icon: 'file-text',
    dataSource: 'inventory',
    selectedFields: [],
    filters: {
      category: '',
      status: '',
      location: '',
      dateFrom: '',
      dateTo: ''
    }
  });
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    category: '',
    status: '',
    location: ''
  });
  const { showNotification } = useNotification();
  
  // Cargar reportes predefinidos y personalizados desde la API
  const [predefinedReports, setPredefinedReports] = useState([]);
  const [customReports, setCustomReports] = useState([]);
  
  useEffect(() => {
    const fetchReports = async () => {
      try {
        // Cargar reportes predefinidos
        setLoading(prev => ({ ...prev, predefined: true }));
        const predefinedResponse = await reportService.getPredefinedReports();
        
        if (predefinedResponse.data) {
          // Mapear los datos al formato requerido por el componente
          const formattedPredefined = predefinedResponse.data.map(report => ({
            id: report.id,
            title: report.name,
            description: report.description,
            icon: getReportIcon(report.type || 'general'),
            formats: report.availableFormats || ['pdf', 'excel']
          }));
          
          setPredefinedReports(formattedPredefined);
          setError(prev => ({ ...prev, predefined: null }));
        }
      } catch (error) {
        console.error('Error al cargar reportes predefinidos:', error);
        setError(prev => ({ ...prev, predefined: 'Error al cargar reportes predefinidos' }));
        showNotification('Error al cargar reportes predefinidos', 'error');
      } finally {
        setLoading(prev => ({ ...prev, predefined: false }));
      }
      
      try {
        // Cargar reportes personalizados
        setLoading(prev => ({ ...prev, custom: true }));
        const customResponse = await reportService.getCustomReports();
        
        if (customResponse.data) {
          // Mapear los datos al formato requerido por el componente
          const formattedCustom = customResponse.data.map(report => ({
            id: report.id,
            title: report.name,
            description: report.description || `Reporte personalizado creado el ${new Date(report.createdAt).toLocaleDateString()}`,
            icon: 'filter',
            formats: report.availableFormats || ['pdf', 'excel']
          }));
          
          setCustomReports(formattedCustom);
          setError(prev => ({ ...prev, custom: null }));
        }
      } catch (error) {
        console.error('Error al cargar reportes personalizados:', error);
        setError(prev => ({ ...prev, custom: 'Error al cargar reportes personalizados' }));
        showNotification('Error al cargar reportes personalizados', 'error');
      } finally {
        setLoading(prev => ({ ...prev, custom: false }));
      }
    };
    
    fetchReports();
  }, [showNotification]);
  
  // Determinar el icono adecuado según el tipo de reporte
  const getReportIcon = (reportType) => {
    switch (reportType.toLowerCase()) {
      case 'inventory':
        return 'database';
      case 'category':
        return 'pie-chart';
      case 'assigned':
        return 'users';
      case 'repair':
        return 'tool';
      case 'lowstock':
        return 'alert-triangle';
      case 'history':
        return 'clock';
      default:
        return 'file-text';
    }
  };
  
  // Lista temporal para mostrar mientras se cargan datos reales
  const fallbackPredefinedReports = [
    {
      id: 1,
      title: 'Inventario General',
      description: 'Reporte detallado de todos los activos en el sistema, con su estado actual y ubicación.',
      icon: 'database',
      formats: ['pdf', 'excel', 'csv']
    },
    {
      id: 2,
      title: 'Activos por Categoría',
      description: 'Distribución de activos según su categoría y subcategoría, con totales y porcentajes.',
      icon: 'pie-chart',
      formats: ['pdf', 'excel']
    },
    {
      id: 3,
      title: 'Activos Asignados',
      description: 'Listado de activos asignados a empleados o áreas, con fecha de asignación.',
      icon: 'users',
      formats: ['pdf', 'excel', 'csv']
    },
    {
      id: 4,
      title: 'Activos en Reparación',
      description: 'Detalle de activos actualmente en reparación, con proveedor y fecha estimada de retorno.',
      icon: 'tool',
      formats: ['pdf', 'excel']
    },
    {
      id: 5,
      title: 'Consumibles Bajo Stock',
      description: 'Listado de consumibles con nivel de stock por debajo del umbral mínimo.',
      icon: 'alert-triangle',
      formats: ['pdf', 'excel', 'csv']
    },
    {
      id: 6,
      title: 'Historial de Reparaciones',
      description: 'Historial completo de reparaciones realizadas, con fechas y costos asociados.',
      icon: 'clock',
      formats: ['pdf', 'excel']
    }
  ];
  
  // Reportes personalizados fallback mientras se cargan los datos reales
  const fallbackCustomReports = [
    {
      id: 101,
      title: 'Equipos por Marca',
      description: 'Reporte personalizado creado el 10/03/2025',
      icon: 'filter',
      formats: ['pdf', 'excel']
    },
    {
      id: 102,
      title: 'Rotación Notebooks',
      description: 'Reporte personalizado creado el 25/03/2025',
      icon: 'filter',
      formats: ['pdf', 'excel']
    }
  ];
  
  // Manejar cambios en filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Seleccionar un reporte
  const handleReportSelect = (report) => {
    setSelectedReport(report);
  };
  
  // Manejar el click en un formato de reporte
  const handleFormatClick = (format, report, e) => {
    e.stopPropagation();
    setSelectedReport(report);
    generateReport(format);
  };
  
  // Generar reporte con API real
  const generateReport = async (format) => {
    if (!selectedReport) return;
    
    try {
      setLoading(prev => ({ ...prev, generate: true }));
      
      // Preparar parámetros para la generación del reporte
      const params = {
        reportId: selectedReport.id,
        format: format || 'pdf',
        filters: filters
      };
      
      // Llamada a la API real para generar el reporte
      const response = await reportService.generateReport(params);
      
      if (response.data && response.data.url) {
        // Abrir enlace de descarga en nueva pestaña
        window.open(response.data.url, '_blank');
        showNotification(`Reporte ${selectedReport?.title} generado correctamente`, 'success');
      } else {
        throw new Error('No se pudo obtener la URL de descarga');
      }
    } catch (error) {
      console.error('Error al generar reporte:', error);
      showNotification('Error al generar el reporte', 'error');
    } finally {
      setLoading(prev => ({ ...prev, generate: false }));
    }
  };
  
  // Renderizar el contenido según la tab activa
  const renderContent = () => {
    switch (activeTab) {
      case 'predefined':
        return (
          <>
            <ReportsGrid>
              {predefinedReports.map(report => (
                <ReportCard 
                  key={report.id} 
                  onClick={() => handleReportSelect(report)}
                  style={{
                    border: selectedReport && selectedReport.id === report.id 
                      ? '2px solid var(--primary)' 
                      : '1px solid rgba(0, 0, 0, 0.1)'
                  }}
                >
                  <ReportIcon>
                    <FeatherIcon icon={report.icon} size={24} />
                  </ReportIcon>
                  <ReportTitle>{report.title}</ReportTitle>
                  <ReportDescription>{report.description}</ReportDescription>
                  <ReportActions>
                    {report.formats.map(format => (
                      <Button 
                        key={format} 
                        variant="outline" 
                        size="small"
                        onClick={(e) => handleFormatClick(format, report, e)}
                      >
                        {format.toUpperCase()}
                      </Button>
                    ))}
                  </ReportActions>
                </ReportCard>
              ))}
            </ReportsGrid>
            
            {/* Panel de filtros para reporte seleccionado */}
            {selectedReport && (
              <Card style={{ marginTop: 'var(--spacing-md)' }}>
                <h3 style={{ marginBottom: 'var(--spacing-md)' }}>Configuración de "{selectedReport.title}"</h3>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
                  gap: 'var(--spacing-md)',
                  marginBottom: 'var(--spacing-lg)'
                }}>
                  {/* Filtros dependiendo del tipo de reporte */}
                  {selectedReport.id === 'inventory' && (
                    <>
                      <FormGroup>
                        <label htmlFor="predefCategory">Categoría</label>
                        <select
                          id="predefCategory"
                          name="category"
                          value={filters.category}
                          onChange={handleFilterChange}
                        >
                          <option value="">Todas</option>
                          <option value="computers">Computadoras</option>
                          <option value="phones">Celulares</option>
                          <option value="peripherals">Periféricos</option>
                          <option value="network">Equipos de Red</option>
                        </select>
                      </FormGroup>
                      
                      <FormGroup>
                        <label htmlFor="predefStatus">Estado</label>
                        <select
                          id="predefStatus"
                          name="status"
                          value={filters.status}
                          onChange={handleFilterChange}
                        >
                          <option value="">Todos</option>
                          <option value="active">Activo</option>
                          <option value="assigned">Asignado</option>
                          <option value="maintenance">En Mantenimiento</option>
                          <option value="retired">Retirado</option>
                        </select>
                      </FormGroup>
                      
                      <FormGroup>
                        <label htmlFor="predefLocation">Ubicación</label>
                        <select
                          id="predefLocation"
                          name="location"
                          value={filters.location}
                          onChange={handleFilterChange}
                        >
                          <option value="">Todas</option>
                          <option value="central">Oficina Central</option>
                          <option value="branch1">Sucursal 1</option>
                          <option value="branch2">Sucursal 2</option>
                          <option value="branch3">Sucursal 3</option>
                        </select>
                      </FormGroup>
                    </>
                  )}
                  
                  {selectedReport.id === 'assets-by-category' && (
                    <>
                      <FormGroup>
                        <label htmlFor="predefStatus">Estado</label>
                        <select
                          id="predefStatus"
                          name="status"
                          value={filters.status}
                          onChange={handleFilterChange}
                        >
                          <option value="">Todos</option>
                          <option value="active">Activo</option>
                          <option value="assigned">Asignado</option>
                          <option value="maintenance">En Mantenimiento</option>
                          <option value="retired">Retirado</option>
                        </select>
                      </FormGroup>
                    </>
                  )}
                  
                  {selectedReport.id === 'assignments' && (
                    <>
                      <FormGroup>
                        <label htmlFor="predefDepartment">Departamento</label>
                        <select
                          id="predefDepartment"
                          name="department"
                          value={filters.department}
                          onChange={handleFilterChange}
                        >
                          <option value="">Todos</option>
                          <option value="it">IT</option>
                          <option value="sales">Ventas</option>
                          <option value="marketing">Marketing</option>
                          <option value="finance">Finanzas</option>
                          <option value="hr">Recursos Humanos</option>
                        </select>
                      </FormGroup>
                    </>
                  )}
                  
                  {/* Filtros comunes a todos los reportes */}
                  <FormGroup>
                    <label htmlFor="predefDateFrom">Fecha Desde</label>
                    <input
                      type="date"
                      id="predefDateFrom"
                      name="dateFrom"
                      value={filters.dateFrom}
                      onChange={handleFilterChange}
                    />
                  </FormGroup>
                  
                  <FormGroup>
                    <label htmlFor="predefDateTo">Fecha Hasta</label>
                    <input
                      type="date"
                      id="predefDateTo"
                      name="dateTo"
                      value={filters.dateTo}
                      onChange={handleFilterChange}
                    />
                  </FormGroup>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--spacing-md)' }}>
                  {selectedReport.formats.map(format => (
                    <Button 
                      key={format} 
                      variant="primary"
                      icon={format === 'pdf' ? 'file-text' : format === 'excel' ? 'file' : 'file'}
                      onClick={() => generateReport(format)}
                    >
                      Generar {format.toUpperCase()}
                    </Button>
                  ))}
                </div>
              </Card>
            )}
          </>
        );
      
      case 'custom':
        return (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--spacing-md)' }}>
              <Button 
                variant="primary" 
                icon="plus"
                onClick={() => setShowCreateModal(true)}
              >
                Crear Reporte Personalizado
              </Button>
            </div>
            
            {customReports.length === 0 ? (
              <Card>
                <div style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  alignItems: 'center',
                  padding: 'var(--spacing-xl)',
                  color: 'var(--text-muted)',
                  textAlign: 'center'
                }}>
                  <FeatherIcon icon="file-text" size={48} />
                  <h3 style={{ marginTop: 'var(--spacing-md)' }}>No hay reportes personalizados</h3>
                  <p>Crea tu primer reporte personalizado para guardarlo aquí</p>
                  <Button 
                    variant="primary" 
                    icon="plus" 
                    style={{ marginTop: 'var(--spacing-md)' }}
                    onClick={() => setShowCreateModal(true)}
                  >
                    Crear Reporte
                  </Button>
                </div>
              </Card>
            ) : (
              <ReportsGrid>
                {customReports.map(report => (
                  <ReportCard 
                    key={report.id} 
                    onClick={() => handleReportSelect(report)}
                    style={{
                      border: selectedReport && selectedReport.id === report.id 
                        ? '2px solid var(--primary)' 
                        : '1px solid rgba(0, 0, 0, 0.1)'
                    }}
                  >
                    <ReportIcon>
                      <FeatherIcon icon={report.icon} size={24} />
                    </ReportIcon>
                    <ReportTitle>{report.title}</ReportTitle>
                    <ReportDescription>{report.description}</ReportDescription>
                    <ReportActions>
                      <Button 
                        variant="icon" 
                        title="Editar reporte"
                        onClick={(e) => {
                          e.stopPropagation();
                          setReportToEdit(report);
                          setShowEditModal(true);
                        }}
                      >
                        <FeatherIcon icon="edit-2" size={16} />
                      </Button>
                      
                      <Button 
                        variant="icon" 
                        title="Eliminar reporte"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteReport(report.id);
                        }}
                      >
                        <FeatherIcon icon="trash-2" size={16} />
                      </Button>
                      
                      {report.formats.map(format => (
                        <Button 
                          key={format} 
                          variant="outline" 
                          size="small"
                          onClick={(e) => handleFormatClick(format, report, e)}
                        >
                          {format.toUpperCase()}
                        </Button>
                      ))}
                    </ReportActions>
                  </ReportCard>
                ))}
              </ReportsGrid>
            )}
          </>
        );
      
      default:
        return null;
    }
  };
  
  // Manejar cambios en el formulario de edición
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    setReportToEdit(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  // Guardar cambios del reporte editado
  const handleSaveEdit = async (e) => {
    e.preventDefault();
    
    try {
      setLoading(prev => ({ ...prev, update: true }));
      
      // Preparar datos para la API
      const reportData = {
        name: reportToEdit.title,
        description: reportToEdit.description || 'Reporte personalizado actualizado',
        filters: reportToEdit.filters,
        fields: reportToEdit.selectedFields,
        formats: reportToEdit.formats
      };
      
      // Llamada a la API real para actualizar el reporte
      await reportService.updateCustomReport(reportToEdit.id, reportData);
      
      // Actualizar la lista local
      const updatedReports = customReports.map(report => 
        report.id === reportToEdit.id ? reportToEdit : report
      );
      
      setCustomReports(updatedReports);
      setShowEditModal(false);
      setReportToEdit(null);
      
      showNotification('Reporte actualizado correctamente', 'success');
    } catch (error) {
      console.error('Error al actualizar reporte:', error);
      showNotification('Error al actualizar el reporte', 'error');
    } finally {
      setLoading(prev => ({ ...prev, update: false }));
    }
  };
  
  // Manejar cambios en el formulario de creación
  const handleCreateFormChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('filters.')) {
      const filterName = name.split('.')[1];
      setNewReport(prev => ({
        ...prev,
        filters: {
          ...prev.filters,
          [filterName]: value
        }
      }));
    } else {
      setNewReport(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Manejar selección de campos
  const handleFieldSelect = (field) => {
    setNewReport(prev => {
      if (prev.selectedFields.includes(field)) {
        return {
          ...prev,
          selectedFields: prev.selectedFields.filter(f => f !== field)
        };
      } else {
        return {
          ...prev,
          selectedFields: [...prev.selectedFields, field]
        };
      }
    });
  };
  
  // Obtener los campos disponibles según la fuente de datos seleccionada
  const getAvailableFields = (dataSource) => {
    switch(dataSource) {
      case 'inventory':
        return [
          { id: 'id', label: 'ID' },
          { id: 'name', label: 'Nombre' },
          { id: 'category', label: 'Categoría' },
          { id: 'subcategory', label: 'Subcategoría' },
          { id: 'brand', label: 'Marca' },
          { id: 'model', label: 'Modelo' },
          { id: 'serial', label: 'Nº Serie' },
          { id: 'status', label: 'Estado' },
          { id: 'location', label: 'Ubicación' },
          { id: 'purchaseDate', label: 'Fecha Compra' },
          { id: 'purchasePrice', label: 'Precio Compra' },
          { id: 'warranty', label: 'Garantía' },
          { id: 'lastMaintenance', label: 'Último Mantenimiento' },
          { id: 'notes', label: 'Notas' }
        ];
      case 'assignments':
        return [
          { id: 'id', label: 'ID' },
          { id: 'assetId', label: 'ID Equipo' },
          { id: 'assetName', label: 'Nombre Equipo' },
          { id: 'userId', label: 'ID Usuario' },
          { id: 'userName', label: 'Nombre Usuario' },
          { id: 'assignDate', label: 'Fecha Asignación' },
          { id: 'returnDate', label: 'Fecha Devolución' },
          { id: 'department', label: 'Departamento' },
          { id: 'encryptionPass', label: 'Clave Encriptación' },
          { id: 'status', label: 'Estado' }
        ];
      case 'movements':
        return [
          { id: 'id', label: 'ID' },
          { id: 'assetId', label: 'ID Equipo' },
          { id: 'assetName', label: 'Nombre Equipo' },
          { id: 'moveDate', label: 'Fecha Movimiento' },
          { id: 'fromLocation', label: 'Desde' },
          { id: 'toLocation', label: 'Hacia' },
          { id: 'movedBy', label: 'Responsable' },
          { id: 'reason', label: 'Motivo' }
        ];
      case 'maintenance':
        return [
          { id: 'id', label: 'ID' },
          { id: 'assetId', label: 'ID Equipo' },
          { id: 'assetName', label: 'Nombre Equipo' },
          { id: 'startDate', label: 'Fecha Inicio' },
          { id: 'endDate', label: 'Fecha Fin' },
          { id: 'maintenanceType', label: 'Tipo Mantenimiento' },
          { id: 'provider', label: 'Proveedor' },
          { id: 'cost', label: 'Costo' },
          { id: 'status', label: 'Estado' },
          { id: 'notes', label: 'Notas' }
        ];
      default:
        return [];
    }
  };

  // Guardar el nuevo reporte personalizado
  const handleSaveNewReport = (e) => {
    e.preventDefault();
    
    // Validar que se hayan seleccionado campos
    if (newReport.selectedFields.length === 0) {
      alert('Debes seleccionar al menos un campo para el reporte');
      return;
    }
    
    // Crear un nuevo ID (en un entorno real esto vendría del backend)
    const newId = Date.now();
    
    // Crear el nuevo reporte
    const reportToAdd = {
      ...newReport,
      id: newId,
      description: newReport.description || `Reporte personalizado creado el ${new Date().toLocaleDateString()}`
    };
    
    // Añadir el nuevo reporte a la lista
    setCustomReports([...customReports, reportToAdd]);
    
    // Cerrar el modal y reiniciar el formulario
    setShowCreateModal(false);
    setNewReport({
      title: '',
      description: '',
      formats: ['pdf', 'excel'],
      icon: 'file-text',
      dataSource: 'inventory',
      selectedFields: [],
      filters: {
        category: '',
        status: '',
        location: '',
        dateFrom: '',
        dateTo: ''
      }
    });
    
    // Mostrar mensaje de éxito
    alert('Reporte personalizado creado correctamente');
  };
  
  return (
    <div>
      <PageHeader>
        <PageTitle>Reportes</PageTitle>
      </PageHeader>
      
      <TabsContainer>
        <Tab 
          active={activeTab === 'predefined'} 
          onClick={() => setActiveTab('predefined')}
        >
          Reportes Predefinidos
        </Tab>
        <Tab 
          active={activeTab === 'custom'} 
          onClick={() => setActiveTab('custom')}
        >
          Reportes Personalizados
        </Tab>
      </TabsContainer>
      
      <FilterBar>
        <DateInput 
          type="date" 
          placeholder="Fecha desde" 
          name="dateFrom"
          value={filters.dateFrom}
          onChange={handleFilterChange}
        />
        
        <DateInput 
          type="date" 
          placeholder="Fecha hasta" 
          name="dateTo"
          value={filters.dateTo}
          onChange={handleFilterChange}
        />
        
        <FilterSelect 
          name="category" 
          value={filters.category}
          onChange={handleFilterChange}
        >
          <option value="">Todas las Categorías</option>
          <option value="Computadoras">Computadoras</option>
          <option value="Celulares">Celulares</option>
          <option value="Periféricos">Periféricos</option>
          <option value="Consumibles">Consumibles</option>
          <option value="Componentes">Componentes</option>
        </FilterSelect>
        
        <FilterSelect 
          name="status" 
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">Todos los Estados</option>
          <option value="En Stock">En Stock</option>
          <option value="Asignado">Asignado</option>
          <option value="En Reparación">En Reparación</option>
          <option value="Stock Bajo">Stock Bajo</option>
        </FilterSelect>
        
        <FilterSelect 
          name="location" 
          value={filters.location}
          onChange={handleFilterChange}
        >
          <option value="">Todas las Ubicaciones</option>
          <option value="Oficina Central">Oficina Central</option>
          <option value="Sucursal Norte">Sucursal Norte</option>
          <option value="Sucursal Sur">Sucursal Sur</option>
          <option value="Depósito Central">Depósito Central</option>
        </FilterSelect>
        
        <Button variant="outline" icon="filter">
          Aplicar Filtros
        </Button>
      </FilterBar>
      
      {renderContent()}
      
      {selectedReport && (
        <Card 
          title={`Generar Reporte: ${selectedReport.title}`}
          style={{ marginTop: 'var(--spacing-lg)' }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <p style={{ marginBottom: 'var(--spacing-md)' }}>{selectedReport.description}</p>
              <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
                <span style={{ fontWeight: '600' }}>Formatos disponibles:</span>
                {selectedReport.formats.map(format => (
                  <span key={format} style={{ 
                    padding: '2px 8px', 
                    backgroundColor: 'rgba(0, 0, 0, 0.05)', 
                    borderRadius: 'var(--border-radius-sm)', 
                    fontSize: '0.85rem' 
                  }}>
                    {format.toUpperCase()}
                  </span>
                ))}
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: 'var(--spacing-sm)' }}>
              {selectedReport.formats.map(format => (
                <Button 
                  key={format} 
                  variant={format === 'pdf' ? 'primary' : 'outline'}
                  onClick={() => generateReport(format)}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <FeatherIcon icon="loader" size={16} style={{ marginRight: 'var(--spacing-xs)' }} />
                      Generando...
                    </>
                  ) : (
                    <>
                      <FeatherIcon 
                        icon={
                          format === 'pdf' ? 'file-text' : 
                          format === 'excel' ? 'file' : 
                          'download'
                        } 
                        size={16} 
                        style={{ marginRight: 'var(--spacing-xs)' }} 
                      />
                      Exportar {format.toUpperCase()}
                    </>
                  )}
                </Button>
              ))}
            </div>
          </div>
        </Card>
      )}
      
      {/* Modal de Creación de Reporte */}
      {showCreateModal && (
        <ModalOverlay onClick={() => setShowCreateModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>Crear Reporte Personalizado</h2>
              <Button 
                variant="icon" 
                onClick={() => setShowCreateModal(false)}
              >
                <FeatherIcon icon="x" size={20} />
              </Button>
            </ModalHeader>
            
            <ModalForm onSubmit={handleSaveNewReport}>
              <FormGroup>
                <label htmlFor="createTitle">Título del Reporte*</label>
                <input
                  type="text"
                  id="createTitle"
                  name="title"
                  value={newReport.title}
                  onChange={handleCreateFormChange}
                  required
                  placeholder="Ej: Equipos por Marca"
                />
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="createDescription">Descripción</label>
                <textarea
                  id="createDescription"
                  name="description"
                  value={newReport.description}
                  onChange={handleCreateFormChange}
                  rows="3"
                  placeholder="Descripción opcional del reporte"
                />
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="dataSource">Origen de Datos*</label>
                <select
                  id="dataSource"
                  name="dataSource"
                  value={newReport.dataSource}
                  onChange={handleCreateFormChange}
                  required
                >
                  <option value="inventory">Inventario</option>
                  <option value="assignments">Asignaciones</option>
                  <option value="movements">Movimientos</option>
                  <option value="maintenance">Mantenimientos</option>
                </select>
              </FormGroup>
              
              <FormGroup>
                <label>Campos a incluir*</label>
                <div style={{ 
                  display: 'flex', 
                  flexWrap: 'wrap', 
                  gap: 'var(--spacing-xs)', 
                  border: '1px solid rgba(0,0,0,0.1)', 
                  borderRadius: 'var(--border-radius-sm)',
                  padding: 'var(--spacing-sm)'
                }}>
                  {getAvailableFields(newReport.dataSource).map(field => (
                    <div 
                      key={field.id}
                      onClick={() => handleFieldSelect(field.id)}
                      style={{
                        padding: 'var(--spacing-xs) var(--spacing-sm)',
                        borderRadius: 'var(--border-radius-sm)',
                        border: '1px solid rgba(0,0,0,0.1)',
                        background: newReport.selectedFields.includes(field.id) ? 'var(--primary-light)' : 'white',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 'var(--spacing-xs)'
                      }}
                    >
                      {newReport.selectedFields.includes(field.id) && (
                        <FeatherIcon icon="check" size={14} color="var(--primary)" />
                      )}
                      {field.label}
                    </div>
                  ))}
                </div>
                {newReport.selectedFields.length === 0 && (
                  <div style={{ color: 'var(--error)', fontSize: '0.85rem', marginTop: 'var(--spacing-xs)' }}>
                    Selecciona al menos un campo para el reporte
                  </div>
                )}
              </FormGroup>
              
              <FormGroup>
                <label>Filtros (Opcional)</label>
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: '1fr 1fr', 
                  gap: 'var(--spacing-sm)',
                  border: '1px solid rgba(0,0,0,0.1)', 
                  borderRadius: 'var(--border-radius-sm)',
                  padding: 'var(--spacing-sm)'
                }}>
                  {newReport.dataSource === 'inventory' && (
                    <>
                      <div>
                        <label htmlFor="filterCategory" style={{ fontWeight: 'normal', fontSize: '0.9rem' }}>Categoría</label>
                        <select
                          id="filterCategory"
                          name="filters.category"
                          value={newReport.filters.category}
                          onChange={handleCreateFormChange}
                          style={{ marginTop: 'var(--spacing-xs)' }}
                        >
                          <option value="">Todas</option>
                          <option value="computers">Computadoras</option>
                          <option value="phones">Celulares</option>
                          <option value="peripherals">Periféricos</option>
                          <option value="network">Equipos de Red</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="filterStatus" style={{ fontWeight: 'normal', fontSize: '0.9rem' }}>Estado</label>
                        <select
                          id="filterStatus"
                          name="filters.status"
                          value={newReport.filters.status}
                          onChange={handleCreateFormChange}
                          style={{ marginTop: 'var(--spacing-xs)' }}
                        >
                          <option value="">Todos</option>
                          <option value="active">Activo</option>
                          <option value="assigned">Asignado</option>
                          <option value="maintenance">En Mantenimiento</option>
                          <option value="retired">Retirado</option>
                        </select>
                      </div>
                      
                      <div>
                        <label htmlFor="filterLocation" style={{ fontWeight: 'normal', fontSize: '0.9rem' }}>Ubicación</label>
                        <select
                          id="filterLocation"
                          name="filters.location"
                          value={newReport.filters.location}
                          onChange={handleCreateFormChange}
                          style={{ marginTop: 'var(--spacing-xs)' }}
                        >
                          <option value="">Todas</option>
                          <option value="central">Oficina Central</option>
                          <option value="branch1">Sucursal 1</option>
                          <option value="branch2">Sucursal 2</option>
                          <option value="branch3">Sucursal 3</option>
                        </select>
                      </div>
                    </>
                  )}
                  
                  <div>
                    <label htmlFor="filterDateFrom" style={{ fontWeight: 'normal', fontSize: '0.9rem' }}>Fecha Desde</label>
                    <input
                      type="date"
                      id="filterDateFrom"
                      name="filters.dateFrom"
                      value={newReport.filters.dateFrom}
                      onChange={handleCreateFormChange}
                      style={{ marginTop: 'var(--spacing-xs)' }}
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="filterDateTo" style={{ fontWeight: 'normal', fontSize: '0.9rem' }}>Fecha Hasta</label>
                    <input
                      type="date"
                      id="filterDateTo"
                      name="filters.dateTo"
                      value={newReport.filters.dateTo}
                      onChange={handleCreateFormChange}
                      style={{ marginTop: 'var(--spacing-xs)' }}
                    />
                  </div>
                </div>
              </FormGroup>
              
              <FormGroup>
                <label>Formatos de Exportación</label>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                    <input
                      type="checkbox"
                      checked={newReport.formats.includes('pdf')}
                      onChange={(e) => {
                        const formats = e.target.checked
                          ? [...newReport.formats, 'pdf'].filter((v, i, a) => a.indexOf(v) === i)
                          : newReport.formats.filter(f => f !== 'pdf');
                        setNewReport({ ...newReport, formats });
                      }}
                    />
                    PDF
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                    <input
                      type="checkbox"
                      checked={newReport.formats.includes('excel')}
                      onChange={(e) => {
                        const formats = e.target.checked
                          ? [...newReport.formats, 'excel'].filter((v, i, a) => a.indexOf(v) === i)
                          : newReport.formats.filter(f => f !== 'excel');
                        setNewReport({ ...newReport, formats });
                      }}
                    />
                    Excel
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                    <input
                      type="checkbox"
                      checked={newReport.formats.includes('csv')}
                      onChange={(e) => {
                        const formats = e.target.checked
                          ? [...newReport.formats, 'csv'].filter((v, i, a) => a.indexOf(v) === i)
                          : newReport.formats.filter(f => f !== 'csv');
                        setNewReport({ ...newReport, formats });
                      }}
                    />
                    CSV
                  </label>
                </div>
              </FormGroup>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancelar
                </Button>
                
                <Button type="submit" variant="primary">
                  Crear Reporte
                </Button>
              </div>
            </ModalForm>
          </ModalContent>
        </ModalOverlay>
      )}
      
      {/* Modal de Edición de Reporte */}
      {showEditModal && reportToEdit && (
        <ModalOverlay onClick={() => setShowEditModal(false)}>
          <ModalContent onClick={(e) => e.stopPropagation()}>
            <ModalHeader>
              <h2>Editar Reporte</h2>
              <Button 
                variant="icon" 
                onClick={() => setShowEditModal(false)}
              >
                <FeatherIcon icon="x" size={20} />
              </Button>
            </ModalHeader>
            
            <ModalForm onSubmit={handleSaveEdit}>
              <FormGroup>
                <label htmlFor="title">Título del Reporte*</label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={reportToEdit.title}
                  onChange={handleEditFormChange}
                  required
                />
              </FormGroup>
              
              <FormGroup>
                <label htmlFor="description">Descripción</label>
                <textarea
                  id="description"
                  name="description"
                  value={reportToEdit.description}
                  onChange={handleEditFormChange}
                  rows="3"
                />
              </FormGroup>
              
              <FormGroup>
                <label>Formatos de Exportación</label>
                <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                    <input
                      type="checkbox"
                      checked={reportToEdit.formats.includes('pdf')}
                      onChange={(e) => {
                        const formats = e.target.checked
                          ? [...reportToEdit.formats, 'pdf'].filter((v, i, a) => a.indexOf(v) === i)
                          : reportToEdit.formats.filter(f => f !== 'pdf');
                        setReportToEdit({ ...reportToEdit, formats });
                      }}
                    />
                    PDF
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                    <input
                      type="checkbox"
                      checked={reportToEdit.formats.includes('excel')}
                      onChange={(e) => {
                        const formats = e.target.checked
                          ? [...reportToEdit.formats, 'excel'].filter((v, i, a) => a.indexOf(v) === i)
                          : reportToEdit.formats.filter(f => f !== 'excel');
                        setReportToEdit({ ...reportToEdit, formats });
                      }}
                    />
                    Excel
                  </label>
                  
                  <label style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                    <input
                      type="checkbox"
                      checked={reportToEdit.formats.includes('csv')}
                      onChange={(e) => {
                        const formats = e.target.checked
                          ? [...reportToEdit.formats, 'csv'].filter((v, i, a) => a.indexOf(v) === i)
                          : reportToEdit.formats.filter(f => f !== 'csv');
                        setReportToEdit({ ...reportToEdit, formats });
                      }}
                    />
                    CSV
                  </label>
                </div>
              </FormGroup>
              
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 'var(--spacing-sm)', marginTop: 'var(--spacing-md)' }}>
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={() => setShowEditModal(false)}
                >
                  Cancelar
                </Button>
                
                <Button type="submit" variant="primary">
                  Guardar Cambios
                </Button>
              </div>
            </ModalForm>
          </ModalContent>
        </ModalOverlay>
      )}
    </div>
  );
};

export default Reports;
