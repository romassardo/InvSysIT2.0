import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import styled from 'styled-components';
import FeatherIcon from 'feather-icons-react';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { productService, inventoryService, repairService } from '../../services/api';
import { useNotification } from '../../context/NotificationContext';

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-lg);
`;

const BackButton = styled(Link)`
  display: flex;
  align-items: center;
  color: var(--text-secondary);
  text-decoration: none;
  margin-right: var(--spacing-md);
  transition: color 0.2s;
  
  &:hover {
    color: var(--primary);
    text-decoration: none;
  }
  
  span {
    margin-left: var(--spacing-xs);
  }
`;

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 800;
  color: var(--text-primary);
  margin: 0;
  display: flex;
  align-items: center;
  gap: var(--spacing-md);
`;

const StatusBadge = styled.div`
  margin-left: var(--spacing-sm);
`;

const ActionButtons = styled.div`
  display: flex;
  gap: var(--spacing-sm);
`;

const InfoCard = styled(Card)`
  margin-bottom: var(--spacing-md);
`;

const AssetHeader = styled.div`
  margin-bottom: var(--spacing-md);
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: var(--spacing-sm);
`;

const AssetCategory = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
`;

const AssetName = styled.h2`
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-xs) 0;
`;

const AssetSerial = styled.div`
  font-size: 0.9rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-sm);
  
  span {
    font-family: var(--font-mono);
    background-color: rgba(0, 0, 0, 0.05);
    padding: 2px 6px;
    border-radius: var(--border-radius-sm);
  }
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: var(--spacing-md);
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const InfoLabel = styled.div`
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-bottom: var(--spacing-xs);
`;

const InfoValue = styled.div`
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: 500;
`;

const SpecificationsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: var(--spacing-md);
  margin-top: var(--spacing-sm);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
`;

const SpecItem = styled.div`
  display: flex;
  flex-direction: column;
`;

const NotesSection = styled.div`
  margin-top: var(--spacing-md);
  padding-top: var(--spacing-md);
  border-top: 1px solid var(--border-color);
`;

const CardTitle = styled.h3`
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--text-primary);
  margin: 0 0 var(--spacing-md) 0;
  display: flex;
  align-items: center;
  
  svg {
    margin-right: var(--spacing-xs);
    color: var(--primary);
  }
`;

const HistoryList = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const HistoryItem = styled.div`
  position: relative;
  display: flex;
  padding-left: 36px;
  
  &::before {
    content: '';
    position: absolute;
    left: 10px;
    top: 0;
    bottom: 0;
    width: 2px;
    background-color: var(--primary-light);
  }
  
  &:last-child::before {
    height: 24px;
  }
`;

const HistoryIcon = styled.div`
  position: absolute;
  left: 0;
  top: 0;
  width: 24px;
  height: 24px;
  background-color: var(--primary-light);
  color: var(--primary);
  border-radius: var(--border-radius-full);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const HistoryContent = styled.div`
  flex: 1;
`;

const HistoryHeader = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: var(--spacing-xs);
`;

const HistoryTitle = styled.div`
  font-weight: 600;
  color: var(--text-primary);
`;

const HistoryDate = styled.div`
  font-size: 0.85rem;
  color: var(--text-muted);
`;

const HistoryDetails = styled.div`
  font-size: 0.95rem;
  color: var(--text-secondary);
`;

const HistorySubtext = styled.div`
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-top: var(--spacing-xs);
`;

const RepairInfoCard = styled(Card)`
  border: 1px solid var(--warning-light);
  margin-top: var(--spacing-lg);
`;

const AssetDetailSkeleton = styled.div`
  display: flex;
  flex-direction: column;
  gap: var(--spacing-md);
`;

const SkeletonLine = styled.div`
  height: ${props => props.height || '1rem'};
  width: ${props => props.width || '100%'};
  background-color: rgba(0, 0, 0, 0.05);
  border-radius: var(--border-radius-sm);
  animation: pulse 1.5s infinite;
  
  @keyframes pulse {
    0%, 100% {
      opacity: 0.5;
    }
    50% {
      opacity: 1;
    }
  }
`;

// Componente principal
const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Cargar datos reales desde la API
  useEffect(() => {
    const fetchAssetDetails = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Obtener detalles básicos del activo
        const assetResponse = await productService.getProductById(id);
        
        if (!assetResponse || !assetResponse.data) {
          throw new Error('No se pudo obtener la información del activo');
        }
        
        const assetData = assetResponse.data;
        
        // Procesar categoría y subcategoría desde categoryPath si está disponible
        let category = 'Otros';
        let subcategory = '';
        
        if (assetData.categoryPath) {
          const pathParts = assetData.categoryPath.split('/');
          category = pathParts[0] || 'Otros';
          subcategory = pathParts[1] || '';
        }
        
        // Obtener historial de movimientos para este activo
        const historyResponse = await inventoryService.getMovementsByProductId(id);
        const historyData = historyResponse?.data || [];
        
        // Obtener información de reparaciones para este activo
        const repairResponse = await repairService.getByProductId(id);
        const repairData = repairResponse?.data || [];
        
        // Combinar movimientos y reparaciones en un único historial
        const combinedHistory = [];
        
        // Procesar movimientos
        historyData.forEach(movement => {
          let action = '';
          let icon = '';
          
          switch(movement.type) {
            case 'entry':
              action = 'Entrada de Stock';
              icon = 'package';
              break;
            case 'assignment':
              action = 'Asignación';
              icon = 'user-check';
              break;
            case 'return':
              action = 'Devolución';
              icon = 'corner-up-left';
              break;
            case 'transfer':
              action = 'Transferencia';
              icon = 'repeat';
              break;
            default:
              action = 'Movimiento';
              icon = 'move';
          }
          
          combinedHistory.push({
            id: `m-${movement.id}`,
            date: movement.timestamp,
            action,
            user: movement.user?.name || 'Sistema',
            details: movement.notes || 'Sin detalles',
            icon
          });
        });
        
        // Procesar reparaciones
        repairData.forEach(repair => {
          // Evento de envío a reparación
          combinedHistory.push({
            id: `r-send-${repair.id}`,
            date: repair.sentDate,
            action: 'Envío a Reparación',
            user: repair.sentBy || 'Sistema',
            details: `${repair.problem}${repair.problemDetails ? ` - ${repair.problemDetails}` : ''}`,
            icon: 'tool'
          });
          
          // Si existe fecha de retorno, agregar evento de retorno
          if (repair.returnDate) {
            combinedHistory.push({
              id: `r-return-${repair.id}`,
              date: repair.returnDate,
              action: 'Retorno de Reparación',
              user: repair.processedBy || 'Sistema',
              details: repair.resolution || 'Reparación completada',
              icon: 'check-circle'
            });
          }
        });
        
        // Ordenar historial por fecha descendente (más reciente primero)
        combinedHistory.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // Determinar estado actual
        const currentStatus = determineStatus(assetData, historyData);
        
        // Construir objeto con toda la información del activo
        const processedAsset = {
          id: assetData.id,
          name: assetData.name,
          serialNumber: assetData.serialNumber || 'N/A',
          category,
          subcategory,
          status: currentStatus.status,
          assignedTo: currentStatus.assignedTo,
          location: currentStatus.location,
          specifications: assetData.specifications || {},
          purchaseDate: assetData.purchaseDate,
          warrantyUntil: assetData.warrantyEnd,
          notes: assetData.notes,
          history: combinedHistory,
          inRepair: currentStatus.status === 'En Reparación'
        };
        
        setAsset(processedAsset);
      } catch (error) {
        console.error('Error al cargar detalles del activo:', error);
        setError('No se pudo cargar la información del activo');
        showNotification('Error al cargar detalles del activo', 'error');
      } finally {
        setLoading(false);
      }
    };
    
    if (id) {
      fetchAssetDetails();
    }
  }, [id, showNotification]);
  
  // Función para determinar el estado actual del activo
  const determineStatus = (assetData, movements) => {
    // Valores por defecto
    const result = {
      status: 'En Stock',
      assignedTo: '',
      location: assetData.location || 'Almacén principal'
    };
    
    if (!movements || movements.length === 0) {
      return result;
    }
    
    // Ordenar movimientos por fecha (más reciente primero)
    const sortedMovements = [...movements].sort((a, b) => 
      new Date(b.timestamp) - new Date(a.timestamp)
    );
    
    // Buscar la asignación más reciente que no haya sido devuelta
    const activeAssignment = sortedMovements.find(m => 
      m.type === 'assignment' && !m.isReturned
    );
    
    if (activeAssignment) {
      result.status = 'Asignado';
      
      if (activeAssignment.assignedTo) {
        result.assignedTo = activeAssignment.assignedTo.name || 'Usuario no especificado';
      } else if (activeAssignment.destinationDepartment) {
        result.assignedTo = activeAssignment.destinationDepartment;
      }
      
      if (activeAssignment.destinationBranch) {
        result.location = activeAssignment.destinationBranch;
      }
    }
    
    // Verificar si está actualmente en reparación
    const activeRepair = sortedMovements.find(m => 
      m.type === 'repair' && !m.isReturned
    );
    
    if (activeRepair) {
      result.status = 'En Reparación';
      result.location = activeRepair.provider || 'Servicio Técnico';
    }
    
    return result;
  };
  
  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleString('es-ES', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    });
  };
  
  // Genera un color basado en el estado del activo
  const getStatusColor = (status) => {
    switch(status) {
      case 'Asignado':
        return 'success';
      case 'En Reparación':
        return 'warning';
      case 'Dado de Baja':
        return 'danger';
      default:
        return 'info';
    }
  };
  
  // Función para manejar acción de enviar a reparación
  const handleRepair = () => {
    navigate(`/inventory/repair/new/${id}`);
  };
  
  // Función para manejar acción de asignar
  const handleAssign = () => {
    navigate(`/inventory/assign/new/${id}`);
  };
  
  return (
    <div>
      <PageHeader>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BackButton to="/inventory">
            <FeatherIcon icon="arrow-left" size={16} />
            <span>Volver al inventario</span>
          </BackButton>
          
          <PageTitle>
            Detalle del Activo
            {asset && (
              <StatusBadge>
                <Badge color={getStatusColor(asset.status)}>{asset.status}</Badge>
              </StatusBadge>
            )}
          </PageTitle>
        </div>
        
        {asset && (
          <ActionButtons>
            {asset.status !== 'En Reparación' && asset.status !== 'Dado de Baja' && (
              <Button variant="warning" onClick={handleRepair}>
                <FeatherIcon icon="tool" size={16} />
                Enviar a Reparación
              </Button>
            )}
            
            {asset.status !== 'Asignado' && asset.status !== 'En Reparación' && asset.status !== 'Dado de Baja' && (
              <Button variant="primary" onClick={handleAssign}>
                <FeatherIcon icon="user-plus" size={16} />
                Asignar
              </Button>
            )}
            
            <Button variant="secondary" onClick={() => navigate(`/inventory/edit/${id}`)}>
              <FeatherIcon icon="edit" size={16} />
              Editar
            </Button>
          </ActionButtons>
        )}
      </PageHeader>
      
      {loading ? (
        <AssetDetailSkeleton>
          <SkeletonLine height="2rem" width="60%" />
          <SkeletonLine height="1.5rem" width="40%" />
          <SkeletonLine height="10rem" />
          <SkeletonLine height="8rem" />
        </AssetDetailSkeleton>
      ) : error ? (
        <Card>
          <div style={{ textAlign: 'center', padding: 'var(--spacing-xl)' }}>
            <FeatherIcon icon="alert-triangle" size={48} color="var(--danger)" />
            <h3 style={{ marginTop: 'var(--spacing-md)' }}>{error}</h3>
            <Button 
              variant="primary" 
              style={{ marginTop: 'var(--spacing-lg)'}}
              onClick={() => navigate('/inventory')}
            >
              Volver al Inventario
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <InfoCard>
            <AssetHeader>
              <HeaderRow>
                <div>
                  <AssetCategory>
                    {asset.category} {asset.subcategory && `/ ${asset.subcategory}`}
                  </AssetCategory>
                  <AssetName>{asset.name}</AssetName>
                  <AssetSerial>
                    Número de Serie: <span>{asset.serialNumber}</span>
                  </AssetSerial>
                </div>
              </HeaderRow>
              
              <InfoGrid>
                <InfoItem>
                  <InfoLabel>Ubicación Actual</InfoLabel>
                  <InfoValue>{asset.location || 'No especificado'}</InfoValue>
                </InfoItem>
                
                {asset.assignedTo && (
                  <InfoItem>
                    <InfoLabel>Asignado a</InfoLabel>
                    <InfoValue>{asset.assignedTo}</InfoValue>
                  </InfoItem>
                )}
                
                <InfoItem>
                  <InfoLabel>Fecha de Compra</InfoLabel>
                  <InfoValue>{formatDate(asset.purchaseDate)}</InfoValue>
                </InfoItem>
                
                <InfoItem>
                  <InfoLabel>Fin de Garantía</InfoLabel>
                  <InfoValue>{formatDate(asset.warrantyUntil)}</InfoValue>
                </InfoItem>
              </InfoGrid>
              
              {/* Mostrar las especificaciones técnicas si existen */}
              {asset.specifications && Object.keys(asset.specifications).length > 0 && (
                <SpecificationsGrid>
                  {Object.entries(asset.specifications).map(([key, value]) => (
                    <SpecItem key={key}>
                      <InfoLabel>{key}</InfoLabel>
                      <InfoValue>{value}</InfoValue>
                    </SpecItem>
                  ))}
                </SpecificationsGrid>
              )}
              
              {/* Mostrar las notas si existen */}
              {asset.notes && (
                <NotesSection>
                  <InfoLabel>Notas</InfoLabel>
                  <div style={{ whiteSpace: 'pre-line' }}>{asset.notes}</div>
                </NotesSection>
              )}
            </AssetHeader>
          </InfoCard>
          
          {/* Tarjeta de información si está en reparación */}
          {asset.inRepair && (
            <RepairInfoCard>
              <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-sm)' }}>
                <FeatherIcon icon="alert-triangle" size={20} color="var(--warning)" />
                <div>
                  <div style={{ fontWeight: 600 }}>Este activo se encuentra actualmente en reparación</div>
                  <div style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                    Consulta el historial para más detalles sobre la reparación en curso.
                  </div>
                </div>
              </div>
            </RepairInfoCard>
          )}
          
          {/* Historial del activo */}
          <Card style={{ marginTop: 'var(--spacing-md)' }}>
            <CardTitle>
              <FeatherIcon icon="clock" size={18} />
              Historial del Activo
            </CardTitle>
            
            <HistoryList>
              {asset.history.length > 0 ? (
                asset.history.map((item) => (
                  <HistoryItem key={item.id}>
                    <HistoryIcon>
                      <FeatherIcon icon={item.icon} size={14} />
                    </HistoryIcon>
                    <HistoryContent>
                      <HistoryHeader>
                        <HistoryTitle>{item.action}</HistoryTitle>
                        <HistoryDate>{formatDate(item.date)}</HistoryDate>
                      </HistoryHeader>
                      <HistoryDetails>{item.details}</HistoryDetails>
                      <HistorySubtext>Por: {item.user}</HistorySubtext>
                    </HistoryContent>
                  </HistoryItem>
                ))
              ) : (
                <div style={{ textAlign: 'center', padding: 'var(--spacing-md)', color: 'var(--text-muted)' }}>
                  No hay registros de actividad para este activo
                </div>
              )}
            </HistoryList>
          </Card>
        </>
      )}
    </div>
  );
};

export default AssetDetail;
