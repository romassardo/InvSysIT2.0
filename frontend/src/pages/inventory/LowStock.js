import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FeatherIcon from 'feather-icons-react';
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

const StocksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--spacing-md);
  margin-bottom: var(--spacing-lg);
`;

const StockCard = styled.div`
  background-color: var(--card-bg);
  border-radius: var(--border-radius-md);
  box-shadow: var(--shadow-sm);
  padding: var(--spacing-md);
  border-left: 4px solid ${props => props.critical ? 'var(--danger)' : 'var(--warning)'};
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: var(--shadow-md);
  }
`;

const StockHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
`;

const StockTitle = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  margin-bottom: var(--spacing-xs);
`;

const StockCategory = styled.div`
  font-size: 0.85rem;
  color: var(--text-muted);
`;

const StockLevels = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-md);
`;

const StockLevel = styled.div`
  text-align: center;
`;

const StockLevelLabel = styled.div`
  font-size: 0.8rem;
  color: var(--text-muted);
  margin-bottom: var(--spacing-xs);
`;

const StockLevelValue = styled.div`
  font-size: ${props => props.large ? '1.4rem' : '1.1rem'};
  font-weight: ${props => props.large ? '800' : '600'};
  color: ${props => {
    if (props.type === 'current' && props.critical) return 'var(--danger)';
    if (props.type === 'current' && props.warning) return 'var(--warning)';
    return 'var(--text-primary)';
  }};
`;

const ProgressBar = styled.div`
  height: 8px;
  width: 100%;
  background-color: var(--gray-light);
  border-radius: var(--border-radius-sm);
  margin-bottom: var(--spacing-md);
  overflow: hidden;
`;

const ProgressFill = styled.div`
  height: 100%;
  width: ${props => props.percentage}%;
  background-color: ${props => {
    if (props.percentage < 25) return 'var(--danger)';
    if (props.percentage < 50) return 'var(--warning)';
    return 'var(--success)';
  }};
  transition: width 0.3s ease;
`;

const StockActions = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StockFooter = styled.div`
  font-size: 0.85rem;
  color: var(--text-muted);
`;

const InfoContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const InfoCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
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
    background-color: ${props => props.critical ? 'var(--danger-light)' : 'var(--warning-light)'};
    color: ${props => props.critical ? 'var(--danger)' : 'var(--warning)'};
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

const ActionButtons = styled.div`
  display: flex;
  gap: var(--spacing-xs);
  justify-content: flex-end;
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl) var(--spacing-md);
  color: var(--text-muted);
  text-align: center;
  
  svg {
    margin-bottom: var(--spacing-md);
    color: var(--success);
  }
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: var(--spacing-md);
    color: var(--text-primary);
  }
`;

const PaginationContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-lg);
`;

const PaginationInfo = styled.div`
  font-size: 0.9rem;
  color: var(--text-muted);
`;

const PaginationButtons = styled.div`
  display: flex;
  gap: var(--spacing-xs);
`;

const LowStock = () => {
  const [lowStockItems, setLowStockItems] = useState([]);
  const [criticalItems, setCriticalItems] = useState([]);
  const [warningItems, setWarningItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    status: ''
  });
  const [view, setView] = useState('cards'); // 'cards' o 'table'
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  
  // Simular carga de datos
  useEffect(() => {
    // En una implementación real, estos datos vendrían de la API
    const mockLowStockItems = [
      {
        id: 1,
        name: 'Tóner HP CF380X Negro',
        serialNumber: '',
        category: 'Consumibles',
        subcategory: 'Toner',
        currentStock: 2,
        minimumStock: 5,
        idealStock: 10,
        location: 'Depósito Central',
        lastRestocked: '2025-03-01T10:00:00Z',
        status: 'Crítico',
        compatibility: 'HP Color LaserJet Pro M476',
        icon: 'box',
        isConsumable: true
      },
      {
        id: 2,
        name: 'Cargador Universal Notebook 65W',
        serialNumber: '',
        category: 'Consumibles',
        subcategory: 'Cargadores',
        currentStock: 4,
        minimumStock: 8,
        idealStock: 15,
        location: 'Oficina Central',
        lastRestocked: '2025-02-15T14:30:00Z',
        status: 'Bajo',
        compatibility: 'Dell, Lenovo, HP',
        icon: 'battery-charging',
        isConsumable: true
      },
      {
        id: 3,
        name: 'Cable HDMI 2m',
        serialNumber: '',
        category: 'Consumibles',
        subcategory: 'Cables',
        currentStock: 3,
        minimumStock: 10,
        idealStock: 20,
        location: 'Depósito Central',
        lastRestocked: '2025-01-25T09:15:00Z',
        status: 'Crítico',
        compatibility: '',
        icon: 'box',
        isConsumable: true
      },
      {
        id: 4,
        name: 'Pilas AA Alcalinas (Pack 4u)',
        serialNumber: '',
        category: 'Consumibles',
        subcategory: 'Pilas',
        currentStock: 5,
        minimumStock: 10,
        idealStock: 25,
        location: 'Oficina Central',
        lastRestocked: '2025-03-05T11:45:00Z',
        status: 'Bajo',
        compatibility: '',
        icon: 'battery',
        isConsumable: true
      },
      {
        id: 5,
        name: 'Teclado USB básico',
        serialNumber: '',
        category: 'Periféricos',
        subcategory: 'Teclados',
        currentStock: 2,
        minimumStock: 5,
        idealStock: 10,
        location: 'Depósito Central',
        lastRestocked: '2025-02-10T13:20:00Z',
        status: 'Crítico',
        compatibility: '',
        icon: 'keyboard',
        isConsumable: false
      },
      {
        id: 6,
        name: 'Adaptador USB-C a HDMI',
        serialNumber: '',
        category: 'Componentes',
        subcategory: 'Adaptadores USB Varios',
        currentStock: 3,
        minimumStock: 6,
        idealStock: 12,
        location: 'Oficina Central',
        lastRestocked: '2025-01-15T16:30:00Z',
        status: 'Bajo',
        compatibility: '',
        icon: 'usb',
        isConsumable: false
      },
      {
        id: 7,
        name: 'Drum Xerox 113R00762',
        serialNumber: '',
        category: 'Consumibles',
        subcategory: 'Drum',
        currentStock: 1,
        minimumStock: 3,
        idealStock: 6,
        location: 'Depósito Central',
        lastRestocked: '2025-01-05T10:30:00Z',
        status: 'Crítico',
        compatibility: 'Xerox Phaser 4600',
        icon: 'box',
        isConsumable: true
      },
      {
        id: 8,
        name: 'Mouse Óptico USB',
        serialNumber: '',
        category: 'Periféricos',
        subcategory: 'Mouse',
        currentStock: 4,
        minimumStock: 8,
        idealStock: 15,
        location: 'Oficina Central',
        lastRestocked: '2025-02-20T09:00:00Z',
        status: 'Bajo',
        compatibility: '',
        icon: 'mouse-pointer',
        isConsumable: false
      }
    ];
    
    setTimeout(() => {
      setLowStockItems(mockLowStockItems);
      setCriticalItems(mockLowStockItems.filter(item => item.status === 'Crítico'));
      setWarningItems(mockLowStockItems.filter(item => item.status === 'Bajo'));
      setPagination({
        page: 1,
        limit: 10,
        total: mockLowStockItems.length
      });
      setLoading(false);
    }, 1000);
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
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return date.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Calcular porcentaje de stock
  const calculateStockPercentage = (current, ideal) => {
    if (!ideal || ideal === 0) return 0;
    const percentage = (current / ideal) * 100;
    return Math.min(percentage, 100); // Cap at 100%
  };
  
  // Obtener estilo según estado
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Crítico':
        return <Badge variant="danger">{status}</Badge>;
      case 'Bajo':
        return <Badge variant="warning">{status}</Badge>;
      case 'Normal':
        return <Badge variant="success">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
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
  
  const toggleView = () => {
    setView(view === 'cards' ? 'table' : 'cards');
  };
  
  return (
    <div>
      <PageHeader>
        <PageTitle>
          <FeatherIcon icon="alert-triangle" size={28} color="var(--warning)" />
          Nivel Bajo de Stock
        </PageTitle>
        
        <div>
          <Button 
            variant="outline" 
            icon={view === 'cards' ? 'list' : 'grid'} 
            onClick={toggleView}
            style={{ marginRight: 'var(--spacing-sm)' }}
          >
            {view === 'cards' ? 'Vista de Tabla' : 'Vista de Tarjetas'}
          </Button>
          <Button variant="outline" icon="file-text" style={{ marginRight: 'var(--spacing-sm)' }}>
            Exportar
          </Button>
          <Button variant="primary" icon="plus">
            Añadir Stock
          </Button>
        </div>
      </PageHeader>
      
      <InfoCard style={{ marginBottom: 'var(--spacing-lg)' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', 
          gap: 'var(--spacing-lg)'
        }}>
          <div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-xs)' }}>
              Total productos con bajo stock
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--text-primary)' }}>
              {lowStockItems.length}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-xs)' }}>
              Nivel crítico
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--danger)' }}>
              {criticalItems.length}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-xs)' }}>
              Nivel de advertencia
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--warning)' }}>
              {warningItems.length}
            </div>
          </div>
          
          <div>
            <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 'var(--spacing-xs)' }}>
              Consumibles
            </div>
            <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--primary)' }}>
              {lowStockItems.filter(item => item.isConsumable).length}
            </div>
          </div>
        </div>
      </InfoCard>
      
      <FilterBar>
        <SearchInput>
          <FeatherIcon icon="search" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, categoría..." 
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
          <option value="Consumibles">Consumibles</option>
          <option value="Periféricos">Periféricos</option>
          <option value="Componentes">Componentes</option>
        </FilterSelect>
        
        <FilterSelect 
          name="status" 
          value={filters.status}
          onChange={handleFilterChange}
        >
          <option value="">Todos los Estados</option>
          <option value="Crítico">Crítico</option>
          <option value="Bajo">Bajo</option>
        </FilterSelect>
      </FilterBar>
      
      {loading ? (
        <Card>
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center',
            padding: 'var(--spacing-xl)',
            color: 'var(--text-muted)'
          }}>
            <FeatherIcon icon="loader" size={36} />
            <p style={{ marginTop: 'var(--spacing-md)' }}>Cargando items con bajo stock...</p>
          </div>
        </Card>
      ) : lowStockItems.length === 0 ? (
        <Card>
          <EmptyState>
            <FeatherIcon icon="check-circle" size={48} />
            <h3>¡No hay items con nivel bajo de stock!</h3>
            <p>Todos los consumibles y activos se encuentran con niveles adecuados de stock. Puedes revisar más tarde o establecer umbrales de alerta diferentes.</p>
          </EmptyState>
        </Card>
      ) : view === 'cards' ? (
        <StocksGrid>
          {lowStockItems.map(item => (
            <StockCard key={item.id} critical={item.status === 'Crítico'}>
              <StockHeader>
                <div>
                  <StockTitle>{item.name}</StockTitle>
                  <StockCategory>{item.category} {item.subcategory && `- ${item.subcategory}`}</StockCategory>
                </div>
                {getStatusBadge(item.status)}
              </StockHeader>
              
              <StockLevels>
                <StockLevel>
                  <StockLevelLabel>Stock Actual</StockLevelLabel>
                  <StockLevelValue 
                    large 
                    type="current" 
                    critical={item.status === 'Crítico'}
                    warning={item.status === 'Bajo'}
                  >
                    {item.currentStock}
                  </StockLevelValue>
                </StockLevel>
                
                <StockLevel>
                  <StockLevelLabel>Mínimo</StockLevelLabel>
                  <StockLevelValue>{item.minimumStock}</StockLevelValue>
                </StockLevel>
                
                <StockLevel>
                  <StockLevelLabel>Ideal</StockLevelLabel>
                  <StockLevelValue>{item.idealStock}</StockLevelValue>
                </StockLevel>
              </StockLevels>
              
              <ProgressBar>
                <ProgressFill percentage={calculateStockPercentage(item.currentStock, item.idealStock)} />
              </ProgressBar>
              
              <StockActions>
                <StockFooter>
                  {item.compatibility && (
                    <div>Compatible: {item.compatibility}</div>
                  )}
                  <div>Última reposición: {formatDate(item.lastRestocked)}</div>
                </StockFooter>
                
                <Button variant="primary" icon="plus" size="small">
                  Añadir
                </Button>
              </StockActions>
            </StockCard>
          ))}
        </StocksGrid>
      ) : (
        <Card>
          <TableContainer>
            <table>
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Stock Actual</th>
                  <th>Mínimo</th>
                  <th>Ideal</th>
                  <th>Ubicación</th>
                  <th>Última Reposición</th>
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <InventoryItem critical={item.status === 'Crítico'}>
                        <div className="item-icon">
                          <FeatherIcon icon={item.icon} size={18} />
                        </div>
                        <div className="item-details">
                          <span className="item-name">{item.name}</span>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
                            <span className="item-category">{item.category} {item.subcategory && `- ${item.subcategory}`}</span>
                            {getStatusBadge(item.status)}
                          </div>
                        </div>
                      </InventoryItem>
                    </td>
                    <td style={{ 
                      fontWeight: 'bold', 
                      color: item.status === 'Crítico' ? 'var(--danger)' : 'var(--warning)'
                    }}>
                      {item.currentStock}
                    </td>
                    <td>{item.minimumStock}</td>
                    <td>{item.idealStock}</td>
                    <td>{item.location}</td>
                    <td>{formatDate(item.lastRestocked)}</td>
                    <td>
                      <ActionButtons>
                        <Button 
                          variant="icon" 
                          title="Ver Detalles"
                        >
                          <FeatherIcon icon="eye" size={16} />
                        </Button>
                        
                        <Button 
                          variant="primary"
                          size="small"
                          icon="plus"
                        >
                          Añadir
                        </Button>
                      </ActionButtons>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableContainer>
          
          <PaginationContainer>
            <PaginationInfo>
              Mostrando {lowStockItems.length} de {pagination.total} productos con bajo stock
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
        </Card>
      )}
    </div>
  );
};

export default LowStock;
