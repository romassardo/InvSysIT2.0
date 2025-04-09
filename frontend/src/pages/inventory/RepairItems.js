import React, { useState, useEffect, useCallback } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
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
  const [repairItems, setRepairItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);
  const [lastAction, setLastAction] = useState(null);
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
  
  // Simular carga de datos
  useEffect(() => {
    // En una implementación real, estos datos vendrían de la API
    const mockRepairItems = [
      {
        id: 1,
        assetId: 101,
        assetName: 'Notebook Dell Latitude 7400',
        assetCategory: 'Computadoras',
        assetSubcategory: 'Notebooks',
        serialNumber: 'DL7400-123456',
        problem: 'La pantalla presenta fallos al encender, muestra líneas horizontales y ocasionalmente se apaga por completo.',
        problemDetails: 'El usuario reporta que el problema comenzó después de una caída leve.',
        sentDate: '2025-02-10T14:20:30Z',
        estimatedReturnDate: '2025-02-25T00:00:00Z',
        status: 'En Proceso',
        provider: 'Servicio Técnico Dell',
        providerReference: 'REP-2025-0123',
        inWarranty: true,
        sentBy: 'Soporte2',
        previousStatus: 'Asignado',
        previousAssignee: 'Juan Pérez',
        icon: 'laptop',
        notes: 'Equipo prioritario, necesario para presentación del 01/03',
        lastUpdate: '2025-02-15T10:30:00Z',
        tags: ['Garantía', 'Pantalla', 'Prioritario']
      },
      {
        id: 2,
        assetId: 102,
        assetName: 'iPhone 13 Pro',
        assetCategory: 'Celulares',
        assetSubcategory: '',
        serialNumber: 'IP13-456789',
        problem: 'No carga correctamente, la batería dura menos de 2 horas de uso.',
        problemDetails: 'La batería muestra un estado de salud del 65% según diagnóstico.',
        sentDate: '2025-01-20T11:15:45Z',
        estimatedReturnDate: '2025-02-05T00:00:00Z',
        status: 'En Proceso',
        provider: 'iService',
        providerReference: 'ISV-2025-456',
        inWarranty: false,
        sentBy: 'Admin',
        previousStatus: 'Asignado',
        previousAssignee: 'María López',
        icon: 'smartphone',
        notes: '',
        lastUpdate: '2025-01-30T14:20:00Z',
        tags: ['Batería', 'Fuera de Garantía']
      },
      {
        id: 3,
        assetId: 103,
        assetName: 'Monitor LG 27"',
        assetCategory: 'Periféricos',
        assetSubcategory: 'Monitores',
        serialNumber: 'LG27-789012',
        problem: 'Sin imagen, el LED de encendido funciona pero no muestra señal de video.',
        problemDetails: 'Se probó con diferentes cables y fuentes sin éxito.',
        sentDate: '2025-02-18T09:30:15Z',
        estimatedReturnDate: '2025-03-10T00:00:00Z',
        status: 'En Proceso',
        provider: 'Servicio Técnico LG',
        providerReference: 'LG-25-789',
        inWarranty: true,
        sentBy: 'Soporte1',
        previousStatus: 'En Stock',
        previousAssignee: '',
        icon: 'monitor',
        notes: '',
        lastUpdate: '2025-02-20T10:15:00Z',
        tags: ['Garantía', 'Sin señal']
      },
      {
        id: 4,
        assetId: 104,
        assetName: 'Impresora HP LaserJet Pro',
        assetCategory: 'Periféricos',
        assetSubcategory: 'Impresoras',
        serialNumber: 'HPLJ-112233',
        problem: 'Error en fusor, código E2-01.',
        problemDetails: 'La impresora muestra mensaje de error en pantalla y no imprime.',
        sentDate: '2025-01-05T13:45:20Z',
        estimatedReturnDate: '2025-01-20T00:00:00Z',
        status: 'En Proceso',
        provider: 'Servicio Técnico HP',
        providerReference: 'HP-25-112',
        inWarranty: false,
        sentBy: 'Admin',
        previousStatus: 'Asignado',
        previousAssignee: 'Departamento Contable',
        icon: 'printer',
        notes: 'Listo para retirar del servicio técnico',
        lastUpdate: '2025-01-18T16:45:00Z',
        tags: ['Fusor', 'Listo', 'Fuera de Garantía']
      },
      {
        id: 5,
        assetId: 105,
        assetName: 'Notebook HP ProBook 450',
        assetCategory: 'Computadoras',
        assetSubcategory: 'Notebooks',
        serialNumber: 'HP450-654321',
        problem: 'Sobrecalentamiento y apagados repentinos.',
        problemDetails: 'El equipo se apaga después de 10-15 minutos de uso intensivo.',
        sentDate: '2025-02-05T10:00:00Z',
        estimatedReturnDate: '2025-02-20T00:00:00Z',
        status: 'En Proceso',
        provider: 'TecnoService',
        providerReference: 'TS-2025-789',
        inWarranty: false,
        sentBy: 'Soporte2',
        previousStatus: 'Asignado',
        previousAssignee: 'Ana Martínez',
        icon: 'laptop',
        notes: 'Daño en motherboard, costo de reparación excede el 70% del valor del equipo',
        lastUpdate: '2025-02-15T11:30:00Z',
        tags: ['Motherboard', 'Baja']
      }
    ];
    
    setTimeout(() => {
      setRepairItems(mockRepairItems);
      setPagination({
        page: 1,
        limit: 5,
        total: mockRepairItems.length
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
  
  // Función para mostrar notificaciones
  const showNotification = useCallback((message, type = 'success', undoAction = null) => {
    setNotification({ message, type, undoAction });
    
    // Auto-cerrar notificación después de 5 segundos si no hay opción de deshacer
    if (!undoAction) {
      setTimeout(() => {
        setNotification(null);
      }, 5000);
    }
  }, []);
  
  // Función para cerrar notificación
  const closeNotification = () => {
    setNotification(null);
    setLastAction(null);
  };
  
  // Función para deshacer la última acción
  const undoLastAction = () => {
    if (lastAction) {
      if (lastAction.type === 'return') {
        // Restaurar el elemento eliminado
        setRepairItems(prev => [...prev, lastAction.item]);
        showNotification('Se ha deshecho la acción: Retorno al stock', 'info');
      } else if (lastAction.type === 'discharge') {
        // Restaurar el elemento eliminado
        setRepairItems(prev => [...prev, lastAction.item]);
        showNotification('Se ha deshecho la acción: Baja de activo', 'info');
      }
      setLastAction(null);
    }
  };
  
  // Función para manejar el retorno del activo al stock
  const handleReturnToStock = (assetId) => {
    // Encontrar el elemento antes de eliminarlo para poder restaurarlo
    const itemToRemove = repairItems.find(item => item.id === assetId);
    
    // En una implementación real, se llamaría a la API para actualizar el estado
    console.log(`Retornando activo ${assetId} al inventario`);
    
    // Simulamos la actualización del listado
    setRepairItems(prev => prev.filter(item => item.id !== assetId));
    
    // Guardar la acción para poder deshacerla
    setLastAction({
      type: 'return',
      item: itemToRemove
    });
    
    // Mostrar mensaje con opción de deshacer
    showNotification(
      `Activo ${itemToRemove.assetName} retornado al inventario`, 
      'success', 
      true
    );
  };
  
  // Función para procesar la baja de un activo
  const handleProcessDischarge = (assetId) => {
    // Encontrar el elemento antes de eliminarlo para poder restaurarlo
    const itemToRemove = repairItems.find(item => item.id === assetId);
    
    // En una implementación real, se llamaría a la API para dar de baja el activo
    console.log(`Procesando baja del activo ${assetId}`);
    
    // Simulamos la actualización del listado
    setRepairItems(prev => prev.filter(item => item.id !== assetId));
    
    // Guardar la acción para poder deshacerla
    setLastAction({
      type: 'discharge',
      item: itemToRemove
    });
    
    // Mostrar mensaje con opción de deshacer
    showNotification(
      `Activo ${itemToRemove.assetName} procesado para baja`, 
      'error', 
      true
    );
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
          <option value="Computadoras">Computadoras</option>
          <option value="Celulares">Celulares</option>
          <option value="Periféricos">Periféricos</option>
        </FilterSelect>
        
        <FilterSelect 
          name="provider" 
          value={filters.provider}
          onChange={handleFilterChange}
        >
          <option value="">Todos los Proveedores</option>
          <option value="Servicio Técnico Dell">Servicio Técnico Dell</option>
          <option value="iService">iService</option>
          <option value="Servicio Técnico LG">Servicio Técnico LG</option>
          <option value="Servicio Técnico HP">Servicio Técnico HP</option>
          <option value="TecnoService">TecnoService</option>
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
                    >
                      Marcar como Recibido
                    </Button>
                    
                    <Button 
                      variant="danger"
                      size="small"
                      icon="x-circle"
                      onClick={() => handleProcessDischarge(item.id)}
                    >
                      Procesar Baja
                    </Button>
                  </div>
                </RepairActions>
              </RepairFooter>
            </RepairCard>
          ))}
          
          <PaginationContainer>
            <PaginationInfo>
              Mostrando {repairItems.length} de {pagination.total} activos en reparación
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
      {/* Mostrar notificación si existe */}
      {notification && (
        <Notification type={notification.type}>
          <FeatherIcon 
            icon={notification.type === 'success' ? 'check-circle' : notification.type === 'error' ? 'alert-circle' : 'alert-triangle'} 
            size={20} 
          />
          <span>{notification.message}</span>
          
          {notification.undoAction && lastAction && (
            <span className="undo" onClick={undoLastAction}>Deshacer</span>
          )}
          
          <span className="close" onClick={closeNotification}>
            <FeatherIcon icon="x" size={16} />
          </span>
        </Notification>
      )}
    </div>
  );
};

export default RepairItems;
