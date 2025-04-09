import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
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
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
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
  
  // Simulación de carga de datos
  // Efecto para cargar las subcategorías cuando cambia la categoría seleccionada
  useEffect(() => {
    if (filters.category) {
      updateAvailableSubcategories(filters.category);
    }
  }, [filters.category]);
  
  useEffect(() => {
    // En una implementación real, estos datos vendrían de la API
    const mockAssets = [
      {
        id: 1,
        name: 'Notebook Dell Latitude 7400',
        serialNumber: 'DL7400-123456',
        category: 'Computadoras',
        subcategory: 'Notebooks',
        status: 'Asignado',
        assignedTo: 'Juan Pérez',
        location: 'Oficina Central',
        icon: 'Package' // Reemplazado de 'laptop' que no existe en react-feather
      },
      {
        id: 2,
        name: 'Monitor Samsung 24"',
        serialNumber: 'SM24-987654',
        category: 'Periféricos',
        subcategory: 'Monitores',
        status: 'En Stock',
        assignedTo: null,
        location: 'Almacén IT',
        icon: 'monitor'
      },
      {
        id: 3,
        name: 'iPhone 13 Pro',
        serialNumber: 'IP13-456789',
        category: 'Celulares',
        subcategory: '',
        status: 'Asignado',
        assignedTo: 'María López',
        location: 'Sucursal Norte',
        icon: 'Smartphone' // Nombre correcto en PascalCase
      },
      {
        id: 4,
        name: 'Teclado Logitech MX Keys',
        serialNumber: 'LG-MXK-001',
        category: 'Periféricos',
        subcategory: 'Teclados',
        status: 'En Reparación',
        assignedTo: null,
        location: 'Servicio Técnico',
        icon: 'Type' // Reemplazado de 'keyboard' que no existe en react-feather
      },
      {
        id: 5,
        name: 'Cable HDMI 1.5m',
        serialNumber: null,
        category: 'Consumibles',
        subcategory: 'Cables',
        status: 'En Stock',
        quantity: 15,
        assignedTo: null,
        location: 'Almacén IT',
        icon: 'paperclip'
      },
      {
        id: 6,
        name: 'Mouse Wireless HP',
        serialNumber: 'HP-WM-123',
        category: 'Periféricos',
        subcategory: 'Mouse',
        status: 'En Stock',
        assignedTo: null,
        location: 'Oficina Central',
        icon: 'MousePointer' // Corregido a PascalCase
      },
      {
        id: 7,
        name: 'Desktop HP ProDesk 600',
        serialNumber: 'HP600-789456',
        category: 'Computadoras',
        subcategory: 'Desktops',
        status: 'En Stock',
        assignedTo: null,
        location: 'Almacén IT',
        icon: 'cpu'
      },
      {
        id: 8,
        name: 'Toner HP 85A',
        serialNumber: null,
        category: 'Consumibles',
        subcategory: 'Toner',
        status: 'Stock Bajo',
        quantity: 2,
        assignedTo: null,
        location: 'Almacén IT',
        icon: 'box'
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
    // En una implementación real, aquí haríamos una llamada a la API con los nuevos filtros
  };
  
  // Actualizar subcategorías disponibles cuando cambia la categoría
  const updateAvailableSubcategories = (category) => {
    if (!category) {
      setAvailableSubcategories([]);
      return;
    }
    
    // En una implementación real, estos datos vendrían de la API
    const subcategoriesMap = {
      'Computadoras': ['Notebooks', 'Desktops', 'Raspberry Pi'],
      'Periféricos': ['Teclados', 'Mouse', 'Kit Teclado/Mouse', 'Auriculares', 'Webcams', 'Monitores', 'Televisores'],
      'Consumibles': ['Cables', 'Pilas', 'Toner', 'Drum', 'Cargadores'],
      'Componentes': ['Memorias RAM', 'Discos Externos', 'Discos SSD/NVMe', 'Placas Sending', 'Placas de Video', 'Motherboards', 'Adaptadores USB Varios']
    };
    
    // Asegurate de que las subcategorías se establezcan correctamente
    const subcategories = subcategoriesMap[category] || [];
    console.log(`Subcategorías para ${category}:`, subcategories);
    setAvailableSubcategories(subcategories);
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
    // En una implementación real, aquí haríamos una llamada a la API para obtener la nueva página
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
          <option value="Computadoras">Computadoras</option>
          <option value="Celulares">Celulares</option>
          <option value="Periféricos">Periféricos</option>
          <option value="Consumibles">Consumibles</option>
          <option value="Componentes">Componentes</option>
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
          <option value="Almacén IT">Almacén IT</option>
          <option value="Oficina Central">Oficina Central</option>
          <option value="Sucursal Norte">Sucursal Norte</option>
          <option value="Servicio Técnico">Servicio Técnico</option>
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
