import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/ui/Icon';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { inventoryService } from '../../services/api';
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
  
  &:focus {
    outline: none;
    border-color: var(--primary);
    box-shadow: 0 0 0 3px var(--primary-light);
  }
`;

const TableContainer = styled.div`
  overflow-x: auto;
  
  table {
    width: 100%;
    border-collapse: collapse;
    
    th {
      text-align: left;
      padding: var(--spacing-sm) var(--spacing-md);
      border-bottom: 2px solid rgba(0, 0, 0, 0.05);
      font-weight: 600;
      color: var(--text-dark);
    }
    
    td {
      padding: var(--spacing-sm) var(--spacing-md);
      border-bottom: 1px solid rgba(0, 0, 0, 0.05);
      color: var(--text-primary);
      vertical-align: middle;
    }
    
    tr:hover td {
      background-color: var(--hover-bg);
    }
  }
`;

const AssetCell = styled.div`
  display: flex;
  align-items: center;
  
  .icon {
    margin-right: var(--spacing-sm);
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 6px;
    background-color: var(--primary-light);
    color: var(--primary);
  }
  
  .name {
    font-weight: 600;
    margin-bottom: 2px;
  }
  
  .category {
    font-size: 0.8rem;
    color: var(--text-muted);
  }
`;

const DateRangeInput = styled.div`
  display: flex;
  gap: var(--spacing-xs);
  min-width: 250px;
  align-items: center;
  
  input {
    padding: var(--spacing-sm);
    border-radius: var(--border-radius-sm);
    border: 1px solid rgba(0, 0, 0, 0.1);
    font-family: 'Nunito', sans-serif;
    font-size: 0.85rem;
    
    &:focus {
      outline: none;
      border-color: var(--primary);
      box-shadow: 0 0 0 3px var(--primary-light);
    }
  }
  
  span {
    color: var(--text-muted);
    font-size: 0.9rem;
  }
`;

const PaginationControls = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: var(--spacing-lg);
  padding-top: var(--spacing-md);
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  
  .pagination-info {
    color: var(--text-muted);
    font-size: 0.9rem;
  }
  
  .pagination-buttons {
    display: flex;
    gap: var(--spacing-xs);
    
    button {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 32px;
      height: 32px;
      border-radius: var(--border-radius-sm);
      border: 1px solid rgba(0, 0, 0, 0.1);
      background: var(--card-bg);
      cursor: pointer;
      
      &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
      }
      
      &:hover:not(:disabled) {
        background: var(--hover-bg);
      }
      
      &.active {
        background: var(--primary);
        color: white;
        border-color: var(--primary);
      }
    }
  }
`;

const StatusBadge = ({ type }) => {
  switch (type) {
    case 'entry':
      return <Badge variant="success">Entrada</Badge>;
    case 'out':
      return <Badge variant="warning">Salida</Badge>;
    case 'transfer':
      return <Badge variant="info">Transferencia</Badge>;
    case 'return':
      return <Badge variant="primary">Devolución</Badge>;
    default:
      return <Badge>{type}</Badge>;
  }
};

const InventoryMovements = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [movements, setMovements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    type: '',
    category: '',
    dateFrom: '',
    dateTo: '',
    destination: ''
  });
  
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  
  // Cargar datos de movimientos de inventario desde la API
  useEffect(() => {
    const fetchInventoryMovements = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Construir parámetros de filtro para la API
        const queryParams = {};
        
        if (filters.type) queryParams.type = filters.type;
        if (filters.category) queryParams.category = filters.category;
        if (filters.dateFrom) queryParams.dateFrom = filters.dateFrom;
        if (filters.dateTo) queryParams.dateTo = filters.dateTo;
        if (filters.search) queryParams.search = filters.search;
        if (filters.destination) queryParams.destination = filters.destination;
        
        // Obtener movimientos de inventario
        const response = await inventoryService.getMovements(queryParams);
        
        if (response.data && Array.isArray(response.data)) {
          // Procesar los datos recibidos
          const processedMovements = response.data.map(movement => {
            // Determinar el icono basado en la categoría del producto
            let icon = 'Box';
            if (movement.product) {
              const category = (movement.product.category || '').toLowerCase();
              const subcategory = (movement.product.subcategory || '').toLowerCase();
              
              if (category.includes('computadora')) icon = 'Laptop';
              else if (category.includes('celular')) icon = 'Smartphone';
              else if (category.includes('periférico')) {
                if (subcategory.includes('monitor')) icon = 'Monitor';
                else if (subcategory.includes('teclado')) icon = 'Type';
                else if (subcategory.includes('mouse')) icon = 'MousePointer';
              }
              else if (category.includes('consumible')) {
                if (subcategory.includes('cable')) icon = 'Paperclip';
                else if (subcategory.includes('toner')) icon = 'Printer';
              }
            }
            
            // Asegurarse de que product tenga la estructura correcta
            const formattedProduct = movement.product ? {
              ...movement.product,
              icon
            } : { name: 'Producto desconocido', icon: 'HelpCircle' };
            
            return {
              ...movement,
              product: formattedProduct
            };
          });
          
          setMovements(processedMovements);
          setPagination(prev => ({
            ...prev,
            total: processedMovements.length
          }));
          
          // Extraer categorías únicas para el filtro
          const uniqueCategories = [...new Set(processedMovements
            .filter(m => m.product && m.product.category)
            .map(m => m.product.category))]
            .sort();
          
          setCategories(uniqueCategories);
        } else {
          throw new Error('Formato de respuesta inválido');
        }
      } catch (error) {
        console.error('Error al cargar movimientos de inventario:', error);
        setError('Error al cargar movimientos. Por favor, intente nuevamente.');
        showNotification('Error al cargar movimientos de inventario', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInventoryMovements();
  }, [filters, showNotification]);
  
  // Manejar cambios en los filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    setFilters({
      ...filters,
      [name]: value
    });
    
    // Resetear la paginación al cambiar los filtros
    setPagination({
      ...pagination,
      page: 1
    });
  };
  
  // Filtrar movimientos según los criterios seleccionados
  const filteredMovements = useMemo(() => {
    return movements.filter(movement => {
      // Filtro por búsqueda (nombre de producto, categoría, destino)
      const searchMatch = filters.search === '' || 
        movement.product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        movement.product.category.toLowerCase().includes(filters.search.toLowerCase()) ||
        (movement.product.subcategory && movement.product.subcategory.toLowerCase().includes(filters.search.toLowerCase())) ||
        movement.destination.toLowerCase().includes(filters.search.toLowerCase());
      
      // Filtro por tipo de movimiento
      const typeMatch = filters.type === '' || movement.type === filters.type;
      
      // Filtro por categoría
      const categoryMatch = filters.category === '' || movement.product.category === filters.category;
      
      // Filtro por fecha desde
      const dateFromMatch = filters.dateFrom === '' || new Date(movement.date) >= new Date(filters.dateFrom);
      
      // Filtro por fecha hasta
      const dateToMatch = filters.dateTo === '' || new Date(movement.date) <= new Date(filters.dateTo);
      
      // Filtro por destino
      const destinationMatch = filters.destination === '' || movement.destination.toLowerCase().includes(filters.destination.toLowerCase());
      
      return searchMatch && typeMatch && categoryMatch && dateFromMatch && dateToMatch && destinationMatch;
    });
  }, [movements, filters]);
  
  // Paginar los resultados
  const paginatedMovements = useMemo(() => {
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    return filteredMovements.slice(start, end);
  }, [filteredMovements, pagination]);
  
  // Manejar paginación
  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > Math.ceil(filteredMovements.length / pagination.limit)) {
      return;
    }
    
    setPagination(prev => ({
      ...prev,
      page: newPage
    }));
  };
  
  // Generar páginas para la paginación
  const generatePaginationButtons = () => {
    const totalPages = Math.ceil(filteredMovements.length / pagination.limit);
    const buttons = [];
    
    // Lógica para mostrar un número limitado de botones
    const maxButtons = 5;
    let startPage = Math.max(1, pagination.page - Math.floor(maxButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxButtons - 1);
    
    if (endPage - startPage + 1 < maxButtons) {
      startPage = Math.max(1, endPage - maxButtons + 1);
    }
    
    // Botón de página anterior
    buttons.push(
      <button 
        key="prev" 
        onClick={() => handlePageChange(pagination.page - 1)}
        disabled={pagination.page === 1}
      >
        <Icon name="ChevronLeft" size={16} />
      </button>
    );
    
    // Botones de página numerados
    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button 
          key={i} 
          className={pagination.page === i ? 'active' : ''}
          onClick={() => handlePageChange(i)}
        >
          {i}
        </button>
      );
    }
    
    // Botón de página siguiente
    buttons.push(
      <button 
        key="next" 
        onClick={() => handlePageChange(pagination.page + 1)}
        disabled={pagination.page === totalPages}
      >
        <Icon name="ChevronRight" size={16} />
      </button>
    );
    
    return buttons;
  };
  
  // Formatear fecha
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
    return new Date(dateString).toLocaleDateString('es-AR', options);
  };
  
  // Ver detalles de un movimiento
  const handleViewMovementDetails = (movementId) => {
    navigate(`/inventory/movement/${movementId}`);
  };
  
  return (
    <div>
      <PageHeader>
        <PageTitle>Movimientos de Inventario</PageTitle>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <Button 
            variant="primary" 
            icon="plus"
            onClick={() => navigate('/inventory/entry/new')}
          >
            Registrar Entrada
          </Button>
          
          <Button 
            variant="secondary" 
            icon="minus"
            onClick={() => navigate('/inventory/out/new')}
          >
            Registrar Salida
          </Button>
        </div>
      </PageHeader>
      
      <FilterBar>
        <SearchInput>
          <Icon name="Search" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por producto o destino..." 
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
          />
        </SearchInput>
        
        <FilterSelect 
          name="type" 
          value={filters.type}
          onChange={handleFilterChange}
        >
          <option value="">Todos los Movimientos</option>
          <option value="entry">Entradas</option>
          <option value="out">Salidas</option>
        </FilterSelect>
        
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
        
        <DateRangeInput>
          <input
            type="date"
            name="dateFrom"
            value={filters.dateFrom}
            onChange={handleFilterChange}
            placeholder="Fecha desde"
          />
          <span>a</span>
          <input
            type="date"
            name="dateTo"
            value={filters.dateTo}
            onChange={handleFilterChange}
            placeholder="Fecha hasta"
          />
        </DateRangeInput>
        
        <Button 
          variant="outline" 
          icon="Download"
          onClick={async () => {
            try {
              const response = await inventoryService.exportMovements(filters);
              if (response && response.data) {
                // Crear un objeto blob con los datos CSV/Excel
                const blob = new Blob([response.data], { type: response.headers['content-type'] });
                const url = window.URL.createObjectURL(blob);
                
                // Crear un enlace temporal y hacer clic en él para descargar
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `movimientos_inventario_${new Date().toISOString().split('T')[0]}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
                
                showNotification('Reporte exportado correctamente', 'success');
              }
            } catch (error) {
              console.error('Error al exportar los movimientos:', error);
              showNotification('Error al exportar los movimientos', 'error');
            }
          }}
        >
          Exportar
        </Button>
      </FilterBar>
      
      <Card>
        {loading ? (
          <div style={{ 
            textAlign: 'center', 
            padding: 'var(--spacing-xl)',
            color: 'var(--text-muted)'
          }}>
            <Icon name="Loader" size={36} />
            <p style={{ marginTop: 'var(--spacing-md)' }}>Cargando movimientos...</p>
          </div>
        ) : error ? (
          <div style={{ 
            textAlign: 'center', 
            padding: 'var(--spacing-xl)',
            color: 'var(--danger)'
          }}>
            <Icon name="AlertTriangle" size={36} />
            <p style={{ marginTop: 'var(--spacing-md)' }}>{error}</p>
            <Button 
              variant="primary" 
              onClick={() => window.location.reload()}
              style={{ marginTop: 'var(--spacing-md)' }}
            >
              Reintentar
            </Button>
          </div>
        ) : (
          <>
            <TableContainer>
              <table>
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Tipo</th>
                    <th>Producto</th>
                    <th>Cantidad</th>
                    <th>Destino</th>
                    <th>Usuario</th>
                    <th style={{ textAlign: 'center' }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedMovements.length > 0 ? (
                    paginatedMovements.map(movement => (
                      <tr key={movement.id}>
                        <td>{formatDate(movement.date)}</td>
                        <td>
                          <StatusBadge type={movement.type} />
                        </td>
                        <td>
                          <AssetCell>
                            <div className="icon">
                              <Icon name={movement.product.icon || 'Package'} size={16} />
                            </div>
                            <div>
                              <div className="name">{movement.product.name}</div>
                              <div className="category">
                                {movement.product.category} 
                                {movement.product.subcategory && ` / ${movement.product.subcategory}`}
                              </div>
                            </div>
                          </AssetCell>
                        </td>
                        <td>{movement.quantity}</td>
                        <td>{movement.destination}</td>
                        <td>{movement.user}</td>
                        <td style={{ textAlign: 'center' }}>
                          <Button 
                            variant="icon" 
                            onClick={() => handleViewMovementDetails(movement.id)}
                          >
                            <Icon name="Eye" size={16} />
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" style={{ textAlign: 'center', padding: 'var(--spacing-lg)' }}>
                        No se encontraron movimientos que coincidan con los filtros.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </TableContainer>
            
            {filteredMovements.length > 0 && (
              <PaginationControls>
                <div className="pagination-info">
                  Mostrando {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, filteredMovements.length)} de {filteredMovements.length} movimientos
                </div>
                <div className="pagination-buttons">
                  {generatePaginationButtons()}
                </div>
              </PaginationControls>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default InventoryMovements;
