import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import FeatherIcon from 'feather-icons-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { inventoryService, reportService } from '../../services/api';
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
  const [error, setError] = useState(null);
  const { showNotification } = useNotification();
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
  const [categories, setCategories] = useState([]);
  
  // Cargar datos de stock bajo desde la API
  useEffect(() => {
    const fetchLowStockItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener items con stock bajo del reporte especializado
        const response = await reportService.lowStock();
        
        // Procesar los datos recibidos
        if (response.data && Array.isArray(response.data)) {
          // Mapear los datos para incluir información adicional necesaria para el componente
          const mappedItems = response.data.map(item => {
            // Determinar el icono basado en la categoría
            let icon = 'box';
            const categoryLower = (item.category || '').toLowerCase();
            const subcategoryLower = (item.subcategory || '').toLowerCase();
            
            if (categoryLower.includes('periférico')) {
              if (subcategoryLower.includes('teclado')) icon = 'keyboard';
              else if (subcategoryLower.includes('mouse')) icon = 'mouse-pointer';
              else if (subcategoryLower.includes('monitor')) icon = 'monitor';
            } else if (categoryLower.includes('consumible')) {
              if (subcategoryLower.includes('toner') || subcategoryLower.includes('tóner')) icon = 'printer';
              else if (subcategoryLower.includes('pila')) icon = 'battery';
              else if (subcategoryLower.includes('cargador')) icon = 'battery-charging';
            } else if (categoryLower.includes('componente')) {
              if (subcategoryLower.includes('adaptador') || subcategoryLower.includes('usb')) icon = 'usb';
              else if (subcategoryLower.includes('memoria')) icon = 'cpu';
              else if (subcategoryLower.includes('disco')) icon = 'hard-drive';
            }
            
            // Determinar el estado basado en los niveles de stock
            const currentStock = Number(item.currentStock) || 0;
            const minimumStock = Number(item.minimumThreshold || item.minimumStock) || 1;
            const ratio = currentStock / minimumStock;
            const status = ratio < 0.5 ? 'Crítico' : 'Bajo';
            
            return {
              ...item,
              icon,
              status,
              currentStock,
              minimumStock,
              idealStock: Number(item.idealStock) || (minimumStock * 2),
              isConsumable: item.type === 'consumable',
              compatibility: item.compatibleWith || ''
            };
          });
          
          // Aplicar filtros
          let filtered = [...mappedItems];
          
          if (filters.search) {
            filtered = filtered.filter(item => 
              (item.name && item.name.toLowerCase().includes(filters.search.toLowerCase())) ||
              (item.category && item.category.toLowerCase().includes(filters.search.toLowerCase())) ||
              (item.subcategory && item.subcategory.toLowerCase().includes(filters.search.toLowerCase()))
            );
          }
          
          if (filters.category) {
            filtered = filtered.filter(item => item.category === filters.category);
          }
          
          if (filters.status) {
            filtered = filtered.filter(item => item.status === filters.status);
          }
          
          // Separar en críticos y con advertencia
          const critical = filtered.filter(item => item.status === 'Crítico');
          const warning = filtered.filter(item => item.status === 'Bajo');
          
          setLowStockItems(filtered);
          setCriticalItems(critical);
          setWarningItems(warning);
          
          // Actualizar paginación
          setPagination(prev => ({
            ...prev,
            total: filtered.length
          }));
          
          // Obtener categorías únicas para el filtro
          const uniqueCategories = [...new Set(filtered.map(item => item.category))]
            .filter(Boolean)
            .sort();
          
          setCategories(uniqueCategories);
        } else {
          throw new Error('Formato de respuesta inválido');
        }
      } catch (error) {
        console.error('Error al cargar items con stock bajo:', error);
        setError('Error al cargar items con stock bajo. Por favor, intente nuevamente.');
        showNotification('Error al cargar datos de stock bajo', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLowStockItems();
  }, [filters.search, filters.category, filters.status, showNotification]);
  
  // Manejar cambios en filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
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
          {categories.map((category, index) => (
            <option key={index} value={category}>{category}</option>
          ))}
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
