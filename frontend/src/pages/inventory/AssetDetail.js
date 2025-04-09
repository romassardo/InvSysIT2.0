import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
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

const AssetGrid = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 992px) {
    grid-template-columns: 1fr;
  }
`;

const DetailItem = styled.div`
  margin-bottom: var(--spacing-md);
  display: flex;
  flex-direction: column;
  
  &:last-child {
    margin-bottom: 0;
  }
`;

const DetailLabel = styled.span`
  font-size: 0.85rem;
  color: var(--text-muted);
  margin-bottom: var(--spacing-xs);
`;

const DetailValue = styled.span`
  font-size: 1rem;
  color: var(--text-primary);
  font-weight: ${props => props.bold ? '600' : '400'};
`;

const HistoryList = styled.div`
  margin-top: var(--spacing-md);
`;

const HistoryItem = styled.div`
  display: flex;
  margin-bottom: var(--spacing-md);
  position: relative;
  padding-left: var(--spacing-xl);
  
  &:last-child {
    margin-bottom: 0;
  }
  
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
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Simulación de carga de datos
  useEffect(() => {
    // En una implementación real, estos datos vendrían de la API
    setTimeout(() => {
      // Datos simulados para una notebook
      const mockAsset = {
        id: parseInt(id),
        name: 'Notebook Dell Latitude 7400',
        serialNumber: 'DL7400-123456',
        category: 'Computadoras',
        subcategory: 'Notebooks',
        status: 'Asignado',
        assignedTo: 'Juan Pérez',
        location: 'Oficina Central',
        specifications: {
          processor: 'Intel Core i7 10th Gen',
          ram: '16GB',
          storage: '512GB SSD',
          os: 'Windows 11 Pro'
        },
        encryptionPassword: 'DLBit-9876#43@1',
        purchaseDate: '2024-12-10',
        warrantyUntil: '2026-12-10',
        notes: 'Equipo en perfecto estado, utilizado principalmente para desarrollo de software y tareas administrativas.',
        history: [
          {
            id: 1,
            date: '2025-01-15T10:30:45Z',
            action: 'Entrada de Stock',
            user: 'Admin',
            details: 'Recepción inicial del equipo',
            icon: 'package'
          },
          {
            id: 2,
            date: '2025-01-20T09:15:00Z',
            action: 'Configuración Inicial',
            user: 'Soporte1',
            details: 'Instalación SO, software básico y antivirus',
            icon: 'settings'
          },
          {
            id: 3,
            date: '2025-02-10T14:20:30Z',
            action: 'Envío a Reparación',
            user: 'Soporte2',
            details: 'Falla en pantalla - enviado a Dell',
            icon: 'tool'
          },
          {
            id: 4,
            date: '2025-02-25T11:05:15Z',
            action: 'Retorno de Reparación',
            user: 'Admin',
            details: 'Reemplazo de pantalla completo bajo garantía',
            icon: 'check-circle'
          },
          {
            id: 5,
            date: '2025-03-10T14:22:10Z',
            action: 'Asignación',
            user: 'Admin',
            details: 'Asignado a Juan Pérez',
            icon: 'user-check'
          }
        ]
      };
      
      setAsset(mockAsset);
      setLoading(false);
    }, 1000);
  }, [id]);
  
  // Función para formatear fecha
  const formatDate = (dateString) => {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleString('es-AR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };
  
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
  
  // Obtener icono según categoría
  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Computadoras':
        return asset?.subcategory === 'Notebooks' ? 'laptop' : 'cpu';
      case 'Celulares':
        return 'smartphone';
      case 'Periféricos':
        return 'monitor';
      case 'Consumibles':
        return 'box';
      case 'Componentes':
        return 'hard-drive';
      default:
        return 'box';
    }
  };
  
  if (loading) {
    return (
      <div>
        <PageHeader>
          <BackButton to="/inventory">
            <FeatherIcon icon="arrow-left" size={20} />
            <span>Volver al Inventario</span>
          </BackButton>
          
          <SkeletonLine height="40px" width="150px" />
        </PageHeader>
        
        <AssetDetailSkeleton>
          <SkeletonLine height="180px" />
          <SkeletonLine height="180px" />
          <SkeletonLine height="300px" />
        </AssetDetailSkeleton>
      </div>
    );
  }
  
  return (
    <div>
      <PageHeader>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <BackButton to="/inventory">
            <FeatherIcon icon="arrow-left" size={20} />
            <span>Volver al Inventario</span>
          </BackButton>
          
          <PageTitle>
            <FeatherIcon icon={getCategoryIcon(asset.category)} size={28} />
            {asset.name}
            <StatusBadge>
              {getStatusBadge(asset.status)}
            </StatusBadge>
          </PageTitle>
        </div>
        
        <ActionButtons>
          <Button variant="outline" icon="edit">
            Editar
          </Button>
          
          {asset.status === 'En Stock' && (
            <Button variant="primary" icon="user-plus">
              Asignar
            </Button>
          )}
          
          {asset.status === 'Asignado' && (
            <Button variant="outline" icon="rotate-ccw">
              Retornar
            </Button>
          )}
          
          {asset.status !== 'En Reparación' && (
            <Button variant="outline" icon="tool">
              Enviar a Reparación
            </Button>
          )}
          
          <Button variant="danger" icon="trash-2">
            Dar de Baja
          </Button>
        </ActionButtons>
      </PageHeader>
      
      <AssetGrid>
        {/* Información general */}
        <Card title="Información General">
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
            <DetailItem>
              <DetailLabel>Número de Serie</DetailLabel>
              <DetailValue bold>{asset.serialNumber}</DetailValue>
            </DetailItem>
            
            <DetailItem>
              <DetailLabel>Categoría</DetailLabel>
              <DetailValue>{asset.category}</DetailValue>
              {asset.subcategory && (
                <DetailValue style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                  {asset.subcategory}
                </DetailValue>
              )}
            </DetailItem>
            
            <DetailItem>
              <DetailLabel>Estado</DetailLabel>
              <DetailValue>{getStatusBadge(asset.status)}</DetailValue>
            </DetailItem>
            
            <DetailItem>
              <DetailLabel>Ubicación</DetailLabel>
              <DetailValue>{asset.location}</DetailValue>
            </DetailItem>
            
            <DetailItem>
              <DetailLabel>Fecha de Compra</DetailLabel>
              <DetailValue>{asset.purchaseDate}</DetailValue>
            </DetailItem>
            
            <DetailItem>
              <DetailLabel>Garantía Hasta</DetailLabel>
              <DetailValue>{asset.warrantyUntil}</DetailValue>
            </DetailItem>
            
            {asset.status === 'Asignado' && (
              <DetailItem>
                <DetailLabel>Asignado a</DetailLabel>
                <DetailValue bold>{asset.assignedTo}</DetailValue>
              </DetailItem>
            )}
            
            {/* Información específica para notebooks */}
            {asset.category === 'Computadoras' && asset.subcategory === 'Notebooks' && asset.encryptionPassword && (
              <DetailItem>
                <DetailLabel>Contraseña de Encriptación</DetailLabel>
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <DetailValue bold>{asset.encryptionPassword}</DetailValue>
                  <Button 
                    variant="icon" 
                    style={{ marginLeft: 'var(--spacing-xs)' }}
                    title="Copiar contraseña"
                    onClick={() => {
                      navigator.clipboard.writeText(asset.encryptionPassword);
                      // Aquí podríamos mostrar una notificación de "Copiado"
                    }}
                  >
                    <FeatherIcon icon="copy" size={16} />
                  </Button>
                </div>
              </DetailItem>
            )}
          </div>
          
          {asset.notes && (
            <DetailItem style={{ marginTop: 'var(--spacing-md)' }}>
              <DetailLabel>Notas</DetailLabel>
              <DetailValue>{asset.notes}</DetailValue>
            </DetailItem>
          )}
        </Card>
        
        {/* Especificaciones técnicas */}
        <Card title="Especificaciones Técnicas">
          {asset.specifications ? (
            <>
              {Object.entries(asset.specifications).map(([key, value]) => (
                <DetailItem key={key}>
                  <DetailLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</DetailLabel>
                  <DetailValue>{value}</DetailValue>
                </DetailItem>
              ))}
            </>
          ) : (
            <div style={{ color: 'var(--text-muted)', padding: 'var(--spacing-md) 0' }}>
              No hay especificaciones técnicas disponibles para este activo.
            </div>
          )}
        </Card>
      </AssetGrid>
      
      {/* Si está en reparación, mostrar información de reparación */}
      {asset.status === 'En Reparación' && (
        <RepairInfoCard 
          title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-xs)' }}>
              <FeatherIcon icon="tool" size={20} color="var(--warning)" />
              <span>Información de Reparación</span>
            </div>
          }
        >
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 'var(--spacing-md)' }}>
            <DetailItem>
              <DetailLabel>Proveedor</DetailLabel>
              <DetailValue>Servicio Técnico Dell</DetailValue>
            </DetailItem>
            
            <DetailItem>
              <DetailLabel>Fecha de Envío</DetailLabel>
              <DetailValue>2025-02-10</DetailValue>
            </DetailItem>
            
            <DetailItem>
              <DetailLabel>Problema Reportado</DetailLabel>
              <DetailValue>Falla en pantalla - No enciende correctamente</DetailValue>
            </DetailItem>
            
            <DetailItem>
              <DetailLabel>Estado Actual</DetailLabel>
              <DetailValue>
                <Badge variant="warning">En proceso</Badge>
              </DetailValue>
            </DetailItem>
          </div>
          
          <div style={{ marginTop: 'var(--spacing-md)', display: 'flex', justifyContent: 'flex-end' }}>
            <Button variant="outline" icon="check-circle">
              Marcar como Reparado
            </Button>
          </div>
        </RepairInfoCard>
      )}
      
      {/* Historial */}
      <Card 
        title="Historial de Actividad" 
        style={{ marginTop: 'var(--spacing-lg)' }}
        actions={
          <Button variant="outline" icon="file-text">
            Exportar Historial
          </Button>
        }
      >
        <HistoryList>
          {asset.history.map((item) => (
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
                
                <HistorySubtext>Realizado por: {item.user}</HistorySubtext>
              </HistoryContent>
            </HistoryItem>
          ))}
        </HistoryList>
      </Card>
    </div>
  );
};

export default AssetDetail;
