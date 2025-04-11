import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import Icon from '../../components/ui/Icon';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { productService, categoryService } from '../../services/api';
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

const InventoryList = () => {
  const { showNotification } = useNotification();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    subcategory: '',
    status: '',
    location: ''
  });
  
  const [availableSubcategories, setAvailableSubcategories] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0
  });
  
  // Cargar categorías disponibles
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAll();
        if (response && response.data) {
          setCategories(response.data);
        }
      } catch (error) {
        console.error('Error al cargar categorías:', error);
      }
    };
    
    fetchCategories();
  }, []);
  
  // Efecto para cargar las subcategorías cuando cambia la categoría seleccionada
  useEffect(() => {
    if (filters.category) {
      updateAvailableSubcategories(filters.category);
    }
  }, [filters.category]);
  
  // Cargar inventario desde la API
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Construir los parámetros de consulta para la API
        const queryParams = {};
        
        if (filters.search) queryParams.search = filters.search;
        if (filters.category) queryParams.category = filters.category;
        if (filters.subcategory) queryParams.subcategory = filters.subcategory;
        if (filters.status) queryParams.status = filters.status;
        if (filters.location) queryParams.location = filters.location;
        
        // Agregar parámetros de paginación
        queryParams.page = pagination.page;
        queryParams.limit = pagination.limit;
        
        // Obtener los productos del inventario
        const response = await productService.getAllProducts(queryParams);
        
        if (response && response.data) {
          // Procesar los datos recibidos y agregar iconos según la categoría
          const processedAssets = response.data.map(item => {
            // Determinar el icono según la categoría y subcategoría
            let icon = 'Package';
            const category = (item.category || '').toLowerCase();
            const subcategory = (item.subcategory || '').toLowerCase();
            
            if (category.includes('computadora')) {
              icon = subcategory.includes('notebook') ? 'Laptop' : 'Cpu';
            } else if (category.includes('celular')) {
              icon = 'Smartphone';
            } else if (category.includes('periférico')) {
              if (subcategory.includes('monitor')) icon = 'Monitor';
              else if (subcategory.includes('teclado')) icon = 'Type';
              else if (subcategory.includes('mouse')) icon = 'MousePointer';
              else if (subcategory.includes('auricular')) icon = 'Headphones';
            } else if (category.includes('consumible')) {
              if (subcategory.includes('cable')) icon = 'Paperclip';
              else if (subcategory.includes('toner')) icon = 'Printer';
              else icon = 'Box';
            }
            
            // Extraer ubicaciones únicas para el filtro
            if (item.location && !locations.includes(item.location)) {
              setLocations(prev => [...prev, item.location]);
            }
            
            return {
              ...item,
              icon
            };
          });
          
          setAssets(processedAssets);
          setPagination(prev => ({
            ...prev,
            total: response.headers['x-total-count'] || processedAssets.length
          }));
        } else {
          throw new Error('Formato de respuesta inválido');
        }
      } catch (error) {
        console.error('Error al cargar inventario:', error);
        setError('Error al cargar el inventario. Por favor, intente nuevamente.');
        showNotification('Error al cargar el inventario', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchInventory();
  }, [filters, pagination.page, pagination.limit, showNotification]);
  
  // Manejar cambios en filtros
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'category') {
      // Resetear subcategoría cuando cambia la categoría
      setFilters(prev => ({
        ...prev,
        [name]: value,
        subcategory: ''
      }));
      
      // Actualizar subcategorías disponibles
      updateAvailableSubcategories(value);
    } else {
      setFilters(prev => ({
        ...prev,
        [name]: value
      }));
    }
    
    // Resetear la paginación cuando cambian los filtros
    setPagination(prev => ({
      ...prev,
      page: 1
    }));
  };
  
  // Actualizar subcategorías disponibles cuando cambia la categoría
  const updateAvailableSubcategories = async (category) => {
    if (!category) {
      setAvailableSubcategories([]);
      return;
    }
    
    try {
      // Obtener subcategorías de la API
      const response = await categoryService.getSubcategories(category);
      if (response && response.data) {
        setAvailableSubcategories(response.data);
      }
    } catch (error) {
      console.error(`Error al cargar subcategorías para ${category}:`, error);
      setAvailableSubcategories([]);
    }
  };
  
  // Filtrar los activos según los criterios de búsqueda y filtros
  const filteredAssets = useMemo(() => {
    return assets.filter(asset => {
      // Filtrar por texto de búsqueda (nombre, número de serie, etc.)
      const searchMatch = !filters.search || 
        asset.name.toLowerCase().includes(filters.search.toLowerCase()) || 
        (asset.serialNumber && asset.serialNumber.toLowerCase().includes(filters.search.toLowerCase())) ||
        (asset.assignedTo && asset.assignedTo.toLowerCase().includes(filters.search.toLowerCase()));
      
      // Filtrar por categoría
      const categoryMatch = !filters.category || asset.category === filters.category;
      
      // Filtrar por subcategoría
      const subcategoryMatch = !filters.subcategory || asset.subcategory === filters.subcategory;
      
      // Filtrar por estado
      const statusMatch = !filters.status || asset.status === filters.status;
      
      // Filtrar por ubicación
      const locationMatch = !filters.location || asset.location === filters.location;
      
      // Todos los filtros deben coincidir
      return searchMatch && categoryMatch && subcategoryMatch && statusMatch && locationMatch;
    });
  }, [assets, filters]);
  
  // Obtener badge según estado
  const getStatusBadge = (status) => {
    switch (status) {
      case 'Asignado':
        return <Badge variant="success">{status}</Badge>;
      case 'En Stock':
        return <Badge variant="default">{status}</Badge>;
      case 'En Reparación':
        return <Badge variant="warning">{status}</Badge>;
      case 'Stock Bajo':
        return <Badge variant="danger">{status}</Badge>;
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
    // La llamada a la API se realiza automáticamente en el useEffect que observa pagination.page
  };
  
  return (
    <div>
      <PageHeader>
        <PageTitle>Inventario</PageTitle>
        
        <div style={{ display: 'flex', gap: 'var(--spacing-md)' }}>
          <Button 
            variant="outline" 
            icon="list"
            as={Link}
            to="/inventory/asset/new"
          >
            Catálogo de Productos
          </Button>
          
          <Button 
            variant="primary" 
            icon="plus"
            as={Link}
            to="/inventory/entry/new"
          >
            Entrada de Mercadería
          </Button>
          
          <Button 
            variant="secondary" 
            icon="minus"
            as={Link}
            to="/inventory/out/new"
          >
            Salida de Mercadería
          </Button>
        </div>
      </PageHeader>
      
      <FilterBar>
        <SearchInput>
          <Icon name="Search" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por nombre, número de serie, etc." 
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
            <option key={index} value={category.name}>{category.name}</option>
          ))}
        </FilterSelect>
        
        {availableSubcategories.length > 0 && (
          <FilterSelect 
            name="subcategory" 
            value={filters.subcategory}
            onChange={handleFilterChange}
          >
            <option value="">Todas las Subcategorías</option>
            {availableSubcategories.map((subcategory, index) => (
              <option key={index} value={subcategory}>{subcategory}</option>
            ))}
          </FilterSelect>
        )}
        
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
            <Icon name="Loader" size={36} />
            <p style={{ marginTop: 'var(--spacing-md)' }}>Cargando inventario...</p>
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
                    <th>Activo</th>
                    <th>N° Serie</th>
                    <th>Cantidad</th>
                    <th>Categoría</th>
                    <th>Estado</th>
                    <th>Ubicación</th>
                    <th>Responsable</th>
                    <th style={{ textAlign: 'center' }}>Historial</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAssets.map(asset => (
                    <tr key={asset.id}>
                      <td>
                        <InventoryItem>
                          <div className="item-icon">
                            <Icon name={asset.icon} size={18} />
                          </div>
                          <div className="item-details">
                            <span className="item-name">{asset.name}</span>
                            {asset.assignedTo && (
                              <span className="item-category">
                                Asignado a: {asset.assignedTo}
                              </span>
                            )}
                          </div>
                        </InventoryItem>
                      </td>
                      <td>
                        {asset.serialNumber || "--"}
                      </td>
                      <td>
                        {asset.quantity || "1"}
                      </td>
                      <td>
                        {asset.category}
                        {asset.subcategory && (
                          <span style={{ 
                            fontSize: '0.85rem', 
                            color: 'var(--text-muted)',
                            display: 'block'
                          }}>
                            {asset.subcategory}
                          </span>
                        )}
                      </td>
                      <td>
                        {getStatusBadge(asset.status)}
                      </td>
                      <td>{asset.location}</td>
                      <td>
                        {asset.lastModifiedBy || asset.createdBy || "--"}
                      </td>
                      <td style={{ textAlign: 'center' }}>
                        {(asset.category === 'Computadoras' || asset.category === 'Celulares') && (
                          <Button 
                            variant="icon" 
                            title="Ver Historial"
                            as={Link}
                            to={`/inventory/asset/${asset.id}`}
                          >
                            <Icon name="Clock" size={16} />
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </TableContainer>
            
            <PaginationContainer>
              <PaginationInfo>
                Mostrando {filteredAssets.length} de {pagination.total} activos
              </PaginationInfo>
              
              <PaginationButtons>
                <Button 
                  variant="outline" 
                  disabled={pagination.page === 1}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  <Icon name="ChevronLeft" size={16} />
                </Button>
                
                <Button variant="outline">
                  {pagination.page}
                </Button>
                
                <Button 
                  variant="outline"
                  disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit)}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  <Icon name="ChevronRight" size={16} />
                </Button>
              </PaginationButtons>
            </PaginationContainer>
          </>
        )}
      </Card>
    </div>
  );
};

export default InventoryList;
