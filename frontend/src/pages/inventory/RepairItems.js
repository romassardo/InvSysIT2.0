import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import FeatherIcon from 'feather-icons-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { repairService } from '../../services/api';
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

const RepairCard = styled(Card)`
  display: grid;
  grid-template-columns: 1fr;
  margin-bottom: var(--spacing-md);
  border-left: 4px solid var(--warning);
  transition: transform 0.2s ease;
  
  &:hover {
    transform: translateY(-2px);
  }
`;

const RepairHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: var(--spacing-md);
`;

const RepairInfo = styled.div`
  display: flex;
  align-items: flex-start;
  gap: var(--spacing-md);
`;

const AssetIcon = styled.div`
  width: 50px;
  height: 50px;
  background-color: var(--warning-light);
  color: var(--warning);
  border-radius: var(--border-radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const AssetDetails = styled.div`
  display: flex;
  flex-direction: column;
`;

const AssetName = styled.h3`
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-primary);
  margin: 0;
  margin-bottom: var(--spacing-xs);
`;

const AssetMeta = styled.div`
  display: flex;
  gap: var(--spacing-sm);
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
`;

const RepairMeta = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-md);
  margin-top: var(--spacing-sm);
`;

const MetaItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const MetaLabel = styled.span`
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: var(--spacing-xs);
`;

const MetaValue = styled.span`
  font-size: 0.95rem;
  font-weight: ${props => props.bold ? '600' : '400'};
  color: var(--text-primary);
`;

const RepairStatus = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const RepairDate = styled.div`
  font-size: 0.9rem;
  color: var(--text-muted);
  margin-top: var(--spacing-xs);
`;

const RepairProblem = styled.div`
  background-color: rgba(0, 0, 0, 0.02);
  padding: var(--spacing-sm) var(--spacing-md);
  border-radius: var(--border-radius-sm);
  font-size: 0.95rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-md);
`;

const RepairFooter = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-top: 1px solid rgba(0, 0, 0, 0.05);
  padding-top: var(--spacing-md);
`;

const RepairTags = styled.div`
  display: flex;
  gap: var(--spacing-xs);
`;

const Tag = styled.span`
  font-size: 0.8rem;
  padding: 2px 10px;
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: var(--border-radius-full);
  color: var(--text-secondary);
`;

const RepairActions = styled.div`
  display: flex;
  gap: var(--spacing-xs);
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
    color: var(--warning);
  }
  
  h3 {
    font-size: 1.2rem;
    margin-bottom: var(--spacing-md);
    color: var(--text-primary);
  }
`;

const LoadingContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: var(--spacing-xl);
  
  svg {
    color: var(--primary);
    animation: spin 1s linear infinite;
    margin-bottom: var(--spacing-md);
  }
  
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
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

const Notification = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  padding: var(--spacing-md) var(--spacing-lg);
  background-color: ${props => props.type === 'success' ? '#28a745' : props.type === 'error' ? '#dc3545' : props.type === 'info' ? '#17a2b8' : '#ffc107'};
  color: ${props => props.type === 'warning' ? '#212529' : 'white'};
  border-radius: var(--border-radius-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: var(--spacing-sm);
  z-index: 1000;
  animation: slideIn 0.3s ease-out forwards;
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
  
  .close {
    margin-left: var(--spacing-md);
    cursor: pointer;
    opacity: 0.8;
    
    &:hover {
      opacity: 1;
    }
  }
  
  .undo {
    margin-left: var(--spacing-md);
    text-decoration: underline;
    cursor: pointer;
    font-weight: 600;
    
    &:hover {
      opacity: 0.9;
    }
  }
`;

const RepairItems = () => {
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [repairItems, setRepairItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastAction, setLastAction] = useState(null);
  const [providers, setProviders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filters, setFilters] = useState({
    search: '',
    category: '',
    provider: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 5,
    total: 0
  });
  
  // Obtener elementos en reparación desde la API
  useEffect(() => {
    const fetchRepairItems = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Crear parámetros para la consulta
        const queryParams = {
          status: 'in_progress',
          ...filters
        };
        
        // Agregar parámetros de paginación
        queryParams.page = pagination.page;
        queryParams.limit = pagination.limit;
        
        // Obtener elementos en reparación desde la API
        const response = await repairService.getByStatus('in_progress', queryParams);
        
        if (response && response.data) {
          // Procesar los datos y agregar iconos adecuados
          const processedItems = response.data.map(item => {
            // Determinar icono basado en la categoría
            let icon = 'Box';
            const category = (item.assetCategory || '').toLowerCase();
            const subcategory = (item.assetSubcategory || '').toLowerCase();
            
            if (category.includes('computadora') || category.includes('notebook')) {
              icon = 'Laptop';
            } else if (category.includes('celular')) {
              icon = 'Smartphone';
            } else if (category.includes('periférico')) {
              if (subcategory.includes('monitor')) icon = 'Monitor';
              else if (subcategory.includes('impresora')) icon = 'Printer';
              else if (subcategory.includes('teclado')) icon = 'Type';
              else if (subcategory.includes('mouse')) icon = 'MousePointer';
            }
            
            // Recopilar proveedores y categorías únicos para los filtros
            if (item.provider && !providers.includes(item.provider)) {
              setProviders(prev => [...prev, item.provider]);
            }
            
            if (item.assetCategory && !categories.includes(item.assetCategory)) {
              setCategories(prev => [...prev, item.assetCategory]);
            }
            
            // Procesar tags si vienen como string de la API
            let processedTags = item.tags;
            if (typeof item.tags === 'string') {
              try {
                processedTags = JSON.parse(item.tags);
              } catch {
                processedTags = item.tags.split(',').map(tag => tag.trim());
              }
            }
            
            return {
              ...item,
              icon,
              tags: Array.isArray(processedTags) ? processedTags : []
            };
          });
          
          setRepairItems(processedItems);
          setPagination(prev => ({
            ...prev,
            total: response.headers['x-total-count'] || processedItems.length
          }));
        } else {
          throw new Error('Formato de respuesta inválido');
        }
      } catch (error) {
        console.error('Error al cargar elementos en reparación:', error);
        setError('Error al cargar elementos en reparación. Por favor, intente nuevamente.');
        showNotification('Error al cargar elementos en reparación', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    fetchRepairItems();
  }, [filters, pagination.page, pagination.limit, showNotification]);
  
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
    if (!dateString) return '-';
    
    const date = new Date(dateString);
    return date.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };
  
  // Función para calcular días en reparación
  const getDaysInRepair = (sentDate) => {
    const sent = new Date(sentDate);
    const today = new Date();
    const diffTime = Math.abs(today - sent);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };
  
  // Obtener estilo según estado
  const getStatusBadge = (status) => {
    // Simplificado a un solo estado
    return <Badge variant="warning">{status}</Badge>;
  };
  
  // Mostrar notificación temporal
  const showTempNotification = useCallback((message, type = 'success', action = null) => {
    showNotification(message, type);
    setLastAction(action);
  }, [showNotification]);
  
  // Función para cerrar notificación
  const closeNotification = () => {
    setLastAction(null);
  };
  
  // Deshacer la última acción
  const undoLastAction = useCallback(async () => {
    if (!lastAction) return;
    
    try {
      if (lastAction.type === 'return') {
        // Enviar solicitud a la API para deshacer retorno al stock
        await repairService.undoReturnToStock(lastAction.id);
        
        // Restaurar el elemento en el estado local
        setRepairItems(prev => [...prev, lastAction.item]);
        
        // Mostrar notificación
        showNotification('Se ha deshecho la acción: Retorno al stock', 'info');
      } else if (lastAction.type === 'discharge') {
        // Enviar solicitud a la API para deshacer baja de activo
        await repairService.undoDischarge(lastAction.id);
        
        // Restaurar el elemento en el estado local
        setRepairItems(prev => [...prev, lastAction.item]);
        
        // Mostrar notificación
        showNotification('Se ha deshecho la acción: Baja de activo', 'info');
      }
    } catch (error) {
      console.error('Error al deshacer acción:', error);
      showNotification(
        'Error al deshacer la acción. Por favor, inténtelo nuevamente.',
        'error'
      );
    }
    
    // Limpiar la última acción
    setLastAction(null);
  }, [lastAction, showNotification]);
  
  // Función para manejar el retorno del activo al stock
  const handleReturnToStock = async (assetId) => {
    try {
      // Encontrar el elemento antes de eliminarlo para poder restaurarlo
      const itemToRemove = repairItems.find(item => item.id === assetId);
      
      if (!itemToRemove) {
        throw new Error('No se encontró el activo');
      }
      
      // Llamar a la API para retornar el activo al stock
      await repairService.returnToStock(assetId);
      
      // Actualizar el listado local
      setRepairItems(prev => prev.filter(item => item.id !== assetId));
      
      // Guardar la acción para poder deshacerla
      setLastAction({
        type: 'return',
        id: assetId,
        item: itemToRemove
      });
      
      // Mostrar mensaje con opción de deshacer
      showTempNotification(
        `Activo ${itemToRemove.assetName} retornado al inventario`, 
        'success', 
        { type: 'return', id: assetId, item: itemToRemove }
      );
    } catch (error) {
      console.error('Error al retornar activo al stock:', error);
      showNotification('Error al retornar el activo al stock', 'error');
    }
  };
  
  // Función para procesar la baja de un activo
  const handleProcessDischarge = async (assetId) => {
    try {
      // Encontrar el elemento antes de eliminarlo para poder restaurarlo
      const itemToRemove = repairItems.find(item => item.id === assetId);
      
      if (!itemToRemove) {
        throw new Error('No se encontró el activo');
      }
      
      // Llamar a la API para dar de baja el activo
      await repairService.dischargeAsset(assetId);
      
      // Actualizar el listado local
      setRepairItems(prev => prev.filter(item => item.id !== assetId));
    
      // Guardar la acción para poder deshacerla
      setLastAction({
        type: 'discharge',
        id: assetId,
        item: itemToRemove
      });
      
      // Mostrar mensaje con opción de deshacer
      showTempNotification(
        `Activo ${itemToRemove.assetName} procesado para baja`, 
        'error', 
        { type: 'discharge', id: assetId, item: itemToRemove }
      );
    } catch (error) {
      console.error('Error al procesar baja del activo:', error);
      showNotification('Error al procesar baja del activo', 'error');
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
    // La llamada a la API se ejecuta automáticamente a través del useEffect
  };
  
  return (
    <div>
      <PageHeader>
        <PageTitle>
          <FeatherIcon icon="tool" size={28} color="var(--warning)" />
          Activos en Reparación
        </PageTitle>
        
        <div>
          <Button variant="outline" icon="file-text" style={{ marginRight: 'var(--spacing-sm)' }}>
            Exportar
          </Button>
          <Button 
            variant="primary" 
            icon="plus"
            onClick={() => navigate('/inventory/repair/new')}
          >
            Enviar a Reparación
          </Button>
        </div>
      </PageHeader>
      
      <FilterBar>
        <SearchInput>
          <FeatherIcon icon="search" size={16} />
          <input 
            type="text" 
            placeholder="Buscar por activo, problema, proveedor..." 
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
          name="provider" 
          value={filters.provider}
          onChange={handleFilterChange}
        >
          <option value="">Todos los Proveedores</option>
          {providers.map((provider, index) => (
            <option key={index} value={provider}>{provider}</option>
          ))}
        </FilterSelect>
        

      </FilterBar>
      
      {loading ? (
        <Card>
          <LoadingContainer>
            <FeatherIcon icon="loader" size={36} />
            <p>Cargando activos en reparación...</p>
          </LoadingContainer>
        </Card>
      ) : repairItems.length === 0 ? (
        <Card>
          <EmptyState>
            <FeatherIcon icon="tool" size={48} />
            <h3>No hay activos en reparación</h3>
            <p>Actualmente no hay dispositivos enviados a reparación. Cuando envíes un activo a reparación, aparecerá en esta lista.</p>
            <Button 
              variant="primary" 
              icon="plus" 
              style={{ marginTop: 'var(--spacing-md)' }}
              onClick={() => navigate('/inventory/repair/new')}
            >
              Enviar un Activo a Reparación
            </Button>
          </EmptyState>
        </Card>
      ) : (
        <>
          {repairItems.map(item => (
            <RepairCard key={item.id}>
              <RepairHeader>
                <RepairInfo>
                  <AssetIcon>
                    <FeatherIcon icon={item.icon} size={24} />
                  </AssetIcon>
                  
                  <AssetDetails>
                    <AssetName>
                      <Link to={`/inventory/asset/${item.assetId}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                        {item.assetName}
                      </Link>
                    </AssetName>
                    
                    <AssetMeta>
                      <span>{item.assetCategory} {item.assetSubcategory && `- ${item.assetSubcategory}`}</span>
                      <span>•</span>
                      <span>N° Serie: {item.serialNumber}</span>
                    </AssetMeta>
                    
                    <RepairMeta>
                      <MetaItem>
                        <MetaLabel>Enviado por</MetaLabel>
                        <MetaValue>{item.sentBy}</MetaValue>
                      </MetaItem>
                      
                      <MetaItem>
                        <MetaLabel>Proveedor</MetaLabel>
                        <MetaValue bold>{item.provider}</MetaValue>
                      </MetaItem>
                      
                      <MetaItem>
                        <MetaLabel>Ref. Proveedor</MetaLabel>
                        <MetaValue>{item.providerReference || '-'}</MetaValue>
                      </MetaItem>
                      
                      <MetaItem>
                        <MetaLabel>Tiempo en reparación</MetaLabel>
                        <MetaValue>{getDaysInRepair(item.sentDate)} días</MetaValue>
                      </MetaItem>
                      
                      <MetaItem>
                        <MetaLabel>Garantía</MetaLabel>
                        <MetaValue>
                          {item.inWarranty ? 
                            <Badge variant="success">Cubierto</Badge> : 
                            <Badge variant="danger">Sin cobertura</Badge>
                          }
                        </MetaValue>
                      </MetaItem>
                    </RepairMeta>
                  </AssetDetails>
                </RepairInfo>
                
                <RepairStatus>
                  {getStatusBadge(item.status)}
                  <RepairDate>
                    Enviado el {formatDate(item.sentDate)}
                  </RepairDate>
                  {item.estimatedReturnDate && (
                    <RepairDate>
                      Retorno estimado: {formatDate(item.estimatedReturnDate)}
                    </RepairDate>
                  )}
                  {item.lastUpdate && (
                    <RepairDate>
                      Última actualización: {formatDate(item.lastUpdate)}
                    </RepairDate>
                  )}
                </RepairStatus>
              </RepairHeader>
              
              <RepairProblem>
                <strong>Problema reportado:</strong> {item.problem}
                {item.problemDetails && (
                  <div style={{ marginTop: 'var(--spacing-xs)', fontSize: '0.9rem' }}>
                    {item.problemDetails}
                  </div>
                )}
              </RepairProblem>
              
              {item.notes && (
                <div style={{ 
                  marginBottom: 'var(--spacing-md)',
                  padding: 'var(--spacing-sm) var(--spacing-md)',
                  borderLeft: '3px solid var(--primary-light)',
                  backgroundColor: 'rgba(0, 0, 0, 0.02)',
                  fontSize: '0.9rem'
                }}>
                  <strong>Notas:</strong> {item.notes}
                </div>
              )}
              
              <RepairFooter>
                <RepairTags>
                  {item.tags.map((tag, index) => (
                    <Tag key={index}>{tag}</Tag>
                  ))}
                </RepairTags>
                
                <RepairActions>
                  <Button 
                    variant="icon" 
                    title="Ver Historial Completo"
                    onClick={() => {/* Acción para ver historial */}}
                  >
                    <FeatherIcon icon="clock" size={16} />
                  </Button>
                  
                  <div style={{ display: 'flex', gap: 'var(--spacing-xs)' }}>
                    <Button 
                      variant="primary"
                      size="small"
                      icon="check-circle"
                      onClick={() => handleReturnToStock(item.id)}
                      disabled={loading}
                    >
                      Marcar como Recibido
                    </Button>
                    
                    <Button 
                      variant="danger"
                      size="small"
                      icon="x-circle"
                      onClick={() => handleProcessDischarge(item.id)}
                      disabled={loading}
                    >
                      Procesar Baja
                    </Button>
                  </div>
                </RepairActions>
              </RepairFooter>
            </RepairCard>
          ))}
          
          {repairItems.length > 0 && (
            <PaginationContainer>
              <PaginationInfo>
                Mostrando {repairItems.length} de {pagination.total} activos en reparación
              </PaginationInfo>
              
              <PaginationButtons>
                <Button 
                  variant="outline" 
                  disabled={pagination.page === 1 || loading}
                  onClick={() => handlePageChange(pagination.page - 1)}
                >
                  <FeatherIcon icon="chevron-left" size={16} />
                </Button>
                
                <Button variant="outline">
                  {pagination.page}
                </Button>
                
                <Button 
                  variant="outline"
                  disabled={pagination.page >= Math.ceil(pagination.total / pagination.limit) || loading}
                  onClick={() => handlePageChange(pagination.page + 1)}
                >
                  <FeatherIcon icon="chevron-right" size={16} />
                </Button>
              </PaginationButtons>
            </PaginationContainer>
          )}
        </>
      )}

    </div>
  );
};

export default RepairItems;
