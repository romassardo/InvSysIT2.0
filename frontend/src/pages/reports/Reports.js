import React, { useState, useEffect } from 'react';
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
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    dateFrom: '',
    dateTo: '',
    category: '',
    status: '',
    location: ''
  });
  
  // Lista de reportes predefinidos
  const predefinedReports = [
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
  
  // Lista de reportes personalizados (normalmente vendría de la API)
  const [customReports, setCustomReports] = useState([
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
  ]);
  
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
  
  // Generar reporte
  const generateReport = (format) => {
    setLoading(true);
    
    // En una implementación real, aquí haríamos una llamada a la API
    console.log(`Generando reporte ${selectedReport.title} en formato ${format}`);
    console.log('Filtros:', filters);
    
    // Simulamos la generación del reporte
    setTimeout(() => {
      setLoading(false);
      
      // Simulamos una descarga
      alert(`Reporte ${selectedReport.title} generado en formato ${format}`);
    }, 2000);
  };
  
  // Renderizar el contenido según la tab activa
  const renderContent = () => {
    switch (activeTab) {
      case 'predefined':
        return (
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
                      onClick={(e) => {
                        e.stopPropagation();
                        handleReportSelect(report);
                        generateReport(format);
                      }}
                    >
                      {format.toUpperCase()}
                    </Button>
                  ))}
                </ReportActions>
              </ReportCard>
            ))}
          </ReportsGrid>
        );
      
      case 'custom':
        return (
          <>
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 'var(--spacing-md)' }}>
              <Button variant="primary" icon="plus">
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
                          // Acción de editar
                        }}
                      >
                        <FeatherIcon icon="edit-2" size={16} />
                      </Button>
                      
                      <Button 
                        variant="icon" 
                        title="Eliminar reporte"
                        onClick={(e) => {
                          e.stopPropagation();
                          // Acción de eliminar
                        }}
                      >
                        <FeatherIcon icon="trash-2" size={16} />
                      </Button>
                      
                      {report.formats.map(format => (
                        <Button 
                          key={format} 
                          variant="outline" 
                          size="small"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleReportSelect(report);
                            generateReport(format);
                          }}
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
    </div>
  );
};

export default Reports;
