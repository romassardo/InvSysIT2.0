import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import Icon from '../../components/ui/Icon';

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
  
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filteredAssets, setFilteredAssets] = useState([]);
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
  const trackableCategories = ['Computadoras', 'Celulares'];
  
  // Simulación de carga de datos
  // Aplicar filtros a los activos
  useEffect(() => {
    if (!assets.length) return;
    
    // Solo mostrar equipos rastreables (notebooks y celulares)
    let result = assets.filter(asset => trackableCategories.includes(asset.category));
    
    // Aplicar filtro de búsqueda
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(asset =>
        asset.name.toLowerCase().includes(searchTerm) ||
        asset.serialNumber.toLowerCase().includes(searchTerm) ||
        asset.assignee.name.toLowerCase().includes(searchTerm) ||
        asset.location.toLowerCase().includes(searchTerm)
      );
    }
    
    // Filtrar por categoría
    if (filters.category) {
      result = result.filter(asset => asset.category === filters.category);
    }
    
    // Filtrar por ubicación
    if (filters.location) {
      result = result.filter(asset => asset.location === filters.location);
    }
    
    setFilteredAssets(result);
    
    // Actualizar paginación
    setPagination(prev => ({
      ...prev,
      total: result.length
    }));
  }, [assets, filters]);

  useEffect(() => {
    // En una implementación real, estos datos vendrían de la API
    const mockAssets = [
      {
        id: 1,
        name: 'Notebook Dell Latitude 7400',
        serialNumber: 'DL7400-123456',
        category: 'Computadoras',
        subcategory: 'Notebooks',
        assignee: {
          name: 'Juan Pérez',
          type: 'Empleado',
          department: 'Desarrollo'
        },
        location: 'Oficina Central',
        assignedDate: '2025-03-10T14:22:10Z',
        assignedBy: 'Admin',
        icon: 'laptop'
      },
      {
        id: 3,
        name: 'iPhone 13 Pro',
        serialNumber: 'IP13-456789',
        category: 'Celulares',
        subcategory: '',
        assignee: {
          name: 'María López',
          type: 'Empleado',
          department: 'Marketing'
        },
        location: 'Sucursal Norte',
        assignedDate: '2025-02-05T11:30:00Z',
        assignedBy: 'Soporte1',
        icon: 'smartphone'
      },
      {
        id: 6,
        name: 'Mouse Wireless HP',
        serialNumber: 'HP-WM-123',
        category: 'Periféricos',
        subcategory: 'Mouse',
        assignee: {
          name: 'Carlos González',
          type: 'Empleado',
          department: 'Administración'
        },
        location: 'Oficina Central',
        assignedDate: '2025-01-20T09:15:00Z',
        assignedBy: 'Admin',
        icon: 'mouse-pointer'
      },
      {
        id: 9,
        name: 'Monitor LG 27"',
        serialNumber: 'LG27-789012',
        category: 'Periféricos',
        subcategory: 'Monitores',
        assignee: {
          name: 'Sala de Reuniones',
          type: 'Área',
          department: 'General'
        },
        location: 'Oficina Central',
        assignedDate: '2025-03-15T10:00:00Z',
        assignedBy: 'Admin',
        icon: 'monitor'
      },
      {
        id: 10,
        name: 'Notebook HP ProBook 450',
        serialNumber: 'HP450-654321',
        category: 'Computadoras',
        subcategory: 'Notebooks',
        assignee: {
          name: 'Ana Martínez',
          type: 'Empleado',
          department: 'Recursos Humanos'
        },
        location: 'Sucursal Sur',
        assignedDate: '2025-03-01T11:45:30Z',
        assignedBy: 'Soporte2',
        icon: 'laptop'
      },
      {
        id: 11,
        name: 'Televisor Samsung 55"',
        serialNumber: 'TV55-112233',
        category: 'Periféricos',
        subcategory: 'Televisores',
        assignee: {
          name: 'Recepción',
          type: 'Área',
          department: 'General'
        },
        location: 'Oficina Central',
        assignedDate: '2025-02-20T15:30:00Z',
        assignedBy: 'Admin',
        icon: 'tv'
      },
      {
        id: 12,
        name: 'Webcam Logitech C920',
        serialNumber: 'LGC920-445566',
        category: 'Periféricos',
        subcategory: 'Webcams',
        assignee: {
          name: 'Pedro Sánchez',
          type: 'Empleado',
          department: 'Ventas'
        },
        location: 'Oficina Central',
        assignedDate: '2025-03-05T09:15:00Z',
        assignedBy: 'Soporte1',
        icon: 'video'
      }
    ];
    
    setTimeout(() => {
      setAssets(mockAssets);
      setPagination({
        page: 1,
        limit: 10,
        total: mockAssets.length
      });
      setLoading(false);
    }, 800);
  }, []);
  
  // Manejar cambios en filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    // En una implementación real, aquí haríamos una llamada a la API con los nuevos filtros
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
          <option value="Oficina Central">Oficina Central</option>
          <option value="Sucursal Norte">Sucursal Norte</option>
          <option value="Sucursal Sur">Sucursal Sur</option>
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
