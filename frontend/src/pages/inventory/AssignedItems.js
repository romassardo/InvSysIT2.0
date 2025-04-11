import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Icon from '../../components/ui/Icon';
import { inventoryService, categoryService } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`;

const PageDescription = styled.p`
  color: var(--text-muted);
  margin-top: var(--spacing-xs);
  font-size: 0.95rem;
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
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

const InfoAlert = styled.div`
  background-color: var(--primary-light);
  border-left: 4px solid var(--primary);
  padding: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
  
  .alert-icon {
    color: var(--primary);
    flex-shrink: 0;
  }
  
  .alert-content {
    font-size: 0.95rem;
    color: var(--text-primary);
  }

  .alert-title {
    font-weight: 600;
    margin-bottom: var(--spacing-xs);
  }
`;

const SearchInput = styled.div`
  flex: 1;
  min-width: 250px;
  position: relative;
  
  input {
    width: 100%;
    padding: var(--spacing-sm) var(--spacing-md);
    padding-left: calc(var(--spacing-md) * 2.5);
    border-radius: var(--border-radius-sm);
    border: 1px solid rgba(0, 0, 0, 0.1);
    font-family: 'Nunito', sans-serif;
    font-size: 0.9rem;
  }
  
  svg {
    position: absolute;
    left: var(--spacing-sm);
    top: 50%;
    transform: translateY(-50%);
    color: var(--text-muted);
  }
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

const TableContainer = styled.div`
  overflow-x: auto;
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    th {
      text-align: left;
      padding: var(--spacing-sm);
      color: var(--text-secondary);
      font-weight: 600;
      font-size: 0.9rem;
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
    }
    
    td {
      padding: var(--spacing-sm);
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      font-size: 0.95rem;
    }
    
    tr:hover td {
      background-color: var(--primary-light);
    }
  }
`;

const InventoryItem = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  
  .item-icon {
    width: 40px;
    height: 40px;
    background-color: var(--primary-light);
    color: var(--primary);
    border-radius: var(--border-radius-sm);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .item-details {
    display: flex;
    flex-direction: column;
    
    .item-name {
      font-weight: 600;
      color: var(--text-primary);
    }
    
    .item-category {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
  }
`;

const AssigneeInfo = styled.div`
  display: flex;
  flex-direction: column;
  
  .assignee-name {
    font-weight: 600;
    color: var(--text-primary);
  }
  
  .assignee-type {
    font-size: 0.85rem;
    color: var(--text-muted);
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--spacing-xs);
  justify-content: flex-end;
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
`;

const PaginationInfo = styled.div`
  font-size: 0.9rem;
  color: var(--text-muted);
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: var(--spacing-xs);
`;

const AssignedItems = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const { showNotification } = useNotification();
  
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filteredAssets, setFilteredAssets] = useState([]);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: queryParams.get('category') || '',
    assignedTo: '',
    location: '',
    deviceType: queryParams.get('deviceType') || 'trackable'
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  
  // Categorías rastreables (con asignación individual y seguimiento)
  const [trackableCategories, setTrackableCategories] = useState(['Computadoras', 'Celulares']);
  
  // Cargar categorías al iniciar
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAll();
        if (response && response.data) {
          setCategories(response.data);
          
          // Identificar las categorías rastreables (notebooks y celulares)
          const trackable = response.data
            .filter(cat => 
              cat.name.toLowerCase().includes('computadora') || 
              cat.name.toLowerCase().includes('celular') ||
              cat.name.toLowerCase().includes('notebook') ||
              cat.name.toLowerCase().includes('laptop')
            )
            .map(cat => cat.name);
            
          if (trackable.length > 0) {
            setTrackableCategories(trackable);
          }
        }
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    
    fetchCategories();
  }, []);

  // Cargar inventario de equipos asignados
  useEffect(() => {
    const fetchAssignedItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Crear parámetros para la consulta
        const queryParams = {
          assigned: true,  // Sólo items asignados
          ...filters      // Agregar cualquier otro filtro activo
        };
        
        // Quitar deviceType de los parámetros ya que es solo para UI local
        if (queryParams.deviceType) {
          delete queryParams.deviceType;
        }
        
        // Agregar parámetros de paginación
        queryParams.page = pagination.page;
        queryParams.limit = pagination.limit;
        
        // Obtener equipos asignados
        const response = await inventoryService.getAssignedItems(queryParams);
        
        if (response && response.data) {
          // Procesar los datos y agregar iconos adecuados
          const processedAssets = response.data.map(item => {
            // Determinar icono basado en la categoría
            let icon = 'Box';
            const category = (item.category || '').toLowerCase();
            const subcategory = (item.subcategory || '').toLowerCase();
            
            if (category.includes('computadora') || category.includes('notebook')) {
              icon = 'Laptop';
            } else if (category.includes('celular')) {
              icon = 'Smartphone';
            } else if (category.includes('periférico')) {
              if (subcategory.includes('monitor')) icon = 'Monitor';
              else if (subcategory.includes('mouse')) icon = 'MousePointer';
              else if (subcategory.includes('teclado')) icon = 'Type';
              else if (subcategory.includes('webcam')) icon = 'Video';
              else if (subcategory.includes('tv') || subcategory.includes('televisor')) icon = 'Tv';
            }
            
            // Extraer ubicaciones únicas para los filtros
            if (item.location && !locations.includes(item.location)) {
              setLocations(prev => [...prev, item.location]);
            }
            
            return {
              ...item,
              icon
            };
          });
          
          setAssets(processedAssets);
          
          // Si no hay filtros de cliente, establecer los datos filtrados también
          setFilteredAssets(processedAssets);
          
          setPagination(prev => ({
            ...prev,
            total: response.headers['x-total-count'] || processedAssets.length
          }));
        } else {
          throw new Error('Formato de respuesta inválido');
        }
      } catch (error) {
        console.error('Error al cargar equipos asignados:', error);
        setError('Error al cargar los equipos asignados. Por favor, intente nuevamente.');
        showNotification('Error al cargar los equipos asignados', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchAssignedItems();
  }, [filters, pagination.page, pagination.limit, showNotification]);
  
  // Aplicar filtros adicionales en el cliente si es necesario
  useEffect(() => {
    if (!assets.length) return;
    
    // Solo mostrar equipos rastreables si el filtro está activo
    let result = filters.deviceType === 'trackable' 
      ? assets.filter(asset => trackableCategories.includes(asset.category))
      : [...assets];
    
    // Aplicar filtro de búsqueda local si es necesario
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(asset =>
        asset.name?.toLowerCase().includes(searchTerm) ||
        asset.serialNumber?.toLowerCase().includes(searchTerm) ||
        asset.assignee?.name?.toLowerCase().includes(searchTerm) ||
        asset.location?.toLowerCase().includes(searchTerm)
      );
    }
    
    setFilteredAssets(result);
    
    // Actualizar paginación local
    setPagination(prev => ({
      ...prev,
      total: result.length
    }));
  }, [assets, filters, trackableCategories]);
  
  // Manejar cambios en filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Resetear paginación al cambiar filtros
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };
  
  // Función para formatear fecha
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
  // Manejar paginación
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(pagination.total / pagination.limit)) {
      return;
    }
    
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
    // En una implementación real, aquí haríamos una llamada a la API para obtener la nueva página
  };
  
  // Tipo de asignación (Empleado o Área)
  const getAssigneeTypeBadge = (type) => {
    switch (type) {
      case 'Empleado':
        return <Badge variant="primary">Empleado</Badge>;
      case 'Área':
        return <Badge variant="info">Área</Badge>;
      default:
        return <Badge>Otro</Badge>;
    }
  };
  
  // Contar número de dispositivos rastreables
  const getTrackableCount = () => {
    return assets.filter(asset => trackableCategories.includes(asset.category)).length;
  };
  
  return (
    <div>
      <PageHeader>
        <div>
          <PageTitle>Activos Asignados</PageTitle>
          <PageDescription>
            Gestión de equipos asignados a empleados, áreas y sucursales
          </PageDescription>
        </div>
        
        <div>
          <Button variant="outline" icon="file-text" style={{ marginRight: 'var(--spacing-sm)' }}>
            Exportar
          </Button>
          <Button 
            variant="primary" 
            icon="plus" 
            onClick={() => navigate('/inventory/assign/new')}
          >
            Nueva Asignación
          </Button>
        </div>
      </PageHeader>
      
      <InfoAlert>
        <div className="alert-icon">
          <Icon name="Info" size={24} />
        </div>
        <div className="alert-content">
          <div className="alert-title">Política de asignación de activos</div>
          <p>Solo las <strong>notebooks</strong> y <strong>celulares</strong> se asignan a empleados específicos con seguimiento detallado y registro de historial. El resto de los equipos/artículos se gestiona como inventario general y está disponible en la página de Inventario.</p>
        </div>
      </InfoAlert>
      
      <div style={{ display: 'flex', gap: 'var(--spacing-md)', marginBottom: 'var(--spacing-lg)' }}>
        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--primary-light)', padding: 'var(--spacing-sm) var(--spacing-md)', borderRadius: 'var(--border-radius-sm)' }}>
          <Icon name="Laptop" size={18} style={{ marginRight: 'var(--spacing-sm)', color: 'var(--primary)' }} />
          <span style={{ marginRight: 'var(--spacing-sm)' }}>Notebooks y Celulares:</span>
          <Badge variant="primary">{getTrackableCount()}</Badge>
        </div>
      </div>
      
      <FilterBar>
        <SearchInput>
          <FeatherIcon icon="search" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por activo, asignado a, etc." 
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </SearchInput>
        
        <FilterSelect 
          name="category" 
          value={filters.category}
          onChange={handleFilterChange}
        >
          <option value="">Todas las Categorías</option>
          <option value="Computadoras">Computadoras</option>
          <option value="Celulares">Celulares</option>
        </FilterSelect>
        
        <FilterSelect 
          name="location" 
          value={filters.location}
          onChange={handleFilterChange}
        >
          <option value="">Todas las Ubicaciones</option>
          {locations.map((location, index) => (
            <option key={index} value={location}>{location}</option>
          ))}
        </FilterSelect>
      </FilterBar>
      
      <Card>
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: 'var(--spacing-xl)',
            color: 'var(--text-muted)'
          }}>
            <FeatherIcon icon="loader" size={36} />
            <p style={{ marginTop: 'var(--spacing-md)' }}>Cargando activos asignados...</p>
          </div>
        ) : (
          <>
            <TableContainer>
              <table>
                <thead>
                  <tr>
                    <th>Activo</th>
                    <th>N° Serie</th>
                    <th>Asignado a</th>
                    <th>Ubicación</th>
                    <th>Fecha de Asignación</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.length === 0 ? (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                        <div style={{ color: 'var(--text-muted)' }}>
                          <Icon name="FileX" size={36} style={{ marginBottom: 'var(--spacing-sm)' }} />
                          <p>No se encontraron activos asignados con los filtros seleccionados</p>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredAssets.map(asset => (
                    <tr key={asset.id}>
                      <td>
                        <InventoryItem>
                          <div className="item-icon">
                            <FeatherIcon icon={asset.icon} size={18} />
                          </div>
                          <div className="item-details">
                            <span className="item-name">{asset.name}</span>
                            <span className="item-category">{asset.category} {asset.subcategory && `- ${asset.subcategory}`}</span>
                          </div>
                        </InventoryItem>
                      </td>
                      <td>{asset.serialNumber}</td>
                      <td>
                        <AssigneeInfo>
                          <span className="assignee-name">{asset.assignee.name}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                            {getAssigneeTypeBadge(asset.assignee.type)}
                            <span className="assignee-type">{asset.assignee.department}</span>
                          </div>
                        </AssigneeInfo>
                      </td>
                      <td>{asset.location}</td>
                      <td>
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <span>{formatDate(asset.assignedDate)}</span>
                          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            Por: {asset.assignedBy}
                          </span>
                        </div>
                      </td>
                      <td>
                        <ActionButtons>
                          <Button 
                            variant="icon" 
                            title="Ver Detalles"
                            as={Link}
                            to={`/inventory/asset/${asset.id}`}
                          >
                            <FeatherIcon icon="eye" size={16} />
                          </Button>
                          
                          <Button 
                            variant="icon" 
                            title="Retornar Activo"
                          >
                            <FeatherIcon icon="rotate-ccw" size={16} />
                          </Button>
                          
                          {/* Botón de reparación solo para notebooks y celulares */}
                          {(asset.category === 'Computadoras' || asset.category === 'Celulares') && (
                            <Button 
                              variant="icon" 
                              title="Enviar a Reparación"
                              as={Link}
                              to={`/inventory/repair/${asset.id}`}
                            >
                              <FeatherIcon icon="tool" size={16} />
                            </Button>
                          )}
                        </ActionButtons>
                      </td>
                    </tr>
                  )))
                }</tbody>
              </table>
            </TableContainer>
            
            <PaginationContainer>
              <PaginationInfo>
                Mostrando {filteredAssets.length} de {pagination.total} activos asignados
              </PaginationInfo>
              
              <PaginationButtons>
                <Button 
                  variant="outline" 
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  <FeatherIcon icon="chevron-left" size={16} />
                </Button>
                
                <Button variant="outline">
                  {pagination.page}
                </Button>
                
                <Button 
                  variant="outline"
                  disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  <FeatherIcon icon="chevron-right" size={16} />
                </Button>
              </PaginationButtons>
            </PaginationContainer>
          </>
        )}
      </Card>
    </div>
  );
};

export default AssignedItems;
