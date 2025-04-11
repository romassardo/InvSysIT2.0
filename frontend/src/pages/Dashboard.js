import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import StatCard from '../components/ui/StatCard';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import Icon from '../components/ui/Icon';
import { productService, inventoryService, reportService, repairService } from '../services/api';

const PageTitle = styled.h1`
  font-size: 1.8rem;
  font-weight: 800;
  margin-bottom: var(--spacing-lg);
  color: var(--text-primary);
`;

const DashboardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: var(--spacing-lg);
  margin-bottom: var(--spacing-xl);
  
  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }
  
  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: var(--spacing-lg);
  
  @media (max-width: 1200px) {
    grid-template-columns: 1fr;
  }
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
    
    tr:last-child td {
      border-bottom: none;
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

const BadgeContainer = styled.div`
  display: flex;
  align-items: center;
  gap: var(--spacing-xs);
`;

const Dashboard = () => {
  const navigate = useNavigate();
  
  const [statsData, setStatsData] = useState({
    totalAssets: 0,
    assignedAssets: 0,
    inRepair: 0,
    lowStock: 0
  });
  
  const [recentActivity, setRecentActivity] = useState([]);
  const [lowStockItems, setLowStockItems] = useState([]);
  
  const [loading, setLoading] = useState({
    stats: true,
    activity: true,
    lowStock: true
  });
  
  const [error, setError] = useState({
    stats: null,
    activity: null,
    lowStock: null
  });
  
  // Carga de datos desde la API
  useEffect(() => {
    // Función para cargar estadísticas
    const loadStats = async () => {
      try {
        setLoading(prev => ({ ...prev, stats: true }));
        
        // Cargar conteo total de activos
        const productResponse = await productService.getByType('asset');
        const totalAssets = productResponse.data.length;
        
        // Cargar activos asignados
        const assignedResponse = await inventoryService.getAllMovements();
        const assignedAssets = assignedResponse.data.filter(m => 
          m.type === 'assignment' && !m.isReturned
        ).length;
        
        // Cargar equipos en reparación
        const repairResponse = await repairService.getByStatus('in_progress');
        const inRepair = repairResponse.data.length;
        
        // Cargar reporte de stock bajo
        const lowStockResponse = await reportService.lowStock();
        const lowStock = lowStockResponse.data.length;
        
        setStatsData({
          totalAssets,
          assignedAssets,
          inRepair,
          lowStock
        });
        
        setError(prev => ({ ...prev, stats: null }));
      } catch (err) {
        console.error('Error loading stats:', err);
        setError(prev => ({ ...prev, stats: 'Error al cargar estadísticas' }));
      } finally {
        setLoading(prev => ({ ...prev, stats: false }));
      }
    };
    
    // Función para cargar actividad reciente
    const loadRecentActivity = async () => {
      try {
        setLoading(prev => ({ ...prev, activity: true }));
        
        const response = await inventoryService.getAllMovements();
        // Ordenar por fecha más reciente
        const sortedMovements = response.data
          .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
          .slice(0, 4); // Solo mostrar los 4 más recientes
        
        // Mapear respuesta de API al formato requerido por el componente
        const formattedActivity = sortedMovements.map(movement => {
          const activityType = movement.type === 'assignment' ? 'assignment' :
                              movement.type === 'repair' ? 'repair' :
                              movement.type === 'entry' ? 'entry' :
                              movement.type === 'return' ? 'return' : 'other';
          
          // Determinar el icono según el tipo de activo
          const assetIcon = 
            movement.product?.categoryPath?.includes('Computadoras') ? 'Package' :
            movement.product?.categoryPath?.includes('Monitores') ? 'Monitor' :
            movement.product?.categoryPath?.includes('Periféricos') && movement.product?.name?.toLowerCase().includes('teclado') ? 'Type' :
            movement.product?.categoryPath?.includes('Celulares') ? 'Smartphone' : 'Box';
          
          return {
            id: movement.id,
            type: activityType,
            assetName: movement.product?.name || 'Producto no especificado',
            assetType: movement.product?.categoryPath?.split('/')?.pop() || 'Otros',
            assetIcon: assetIcon,
            assignedTo: movement.assignedTo?.name || '',
            location: movement.destinationBranch || movement.destinationDepartment || '',
            timestamp: movement.timestamp,
            user: movement.user?.name || 'Sistema',
            quantity: movement.quantity,
            repairReason: movement.notes,
            previousUser: movement.previousAssignee?.name || ''
          };
        });
        
        setRecentActivity(formattedActivity);
        setError(prev => ({ ...prev, activity: null }));
      } catch (err) {
        console.error('Error loading activity:', err);
        setError(prev => ({ ...prev, activity: 'Error al cargar actividad reciente' }));
      } finally {
        setLoading(prev => ({ ...prev, activity: false }));
      }
    };
    
    // Función para cargar items con stock bajo
    const loadLowStockItems = async () => {
      try {
        setLoading(prev => ({ ...prev, lowStock: true }));
        
        const response = await reportService.lowStock();
        
        // Mapear respuesta de API al formato requerido por el componente
        const formattedItems = response.data.map(item => ({
          id: item.id,
          name: item.name,
          category: item.categoryPath ? item.categoryPath.split('/').pop() : 'Otros',
          currentStock: item.currentStock,
          minimumThreshold: item.minimumThreshold
        }));
        
        setLowStockItems(formattedItems);
        setError(prev => ({ ...prev, lowStock: null }));
      } catch (err) {
        console.error('Error loading low stock items:', err);
        setError(prev => ({ ...prev, lowStock: 'Error al cargar items con stock bajo' }));
      } finally {
        setLoading(prev => ({ ...prev, lowStock: false }));
      }
    };
    
    // Cargar todos los datos
    loadStats();
    loadRecentActivity();
    loadLowStockItems();
  }, []);
  
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
  
  // Función para obtener badge según tipo de actividad
  const getActivityBadge = (type) => {
    switch (type) {
      case 'assignment':
        return <Badge variant="success">Asignación</Badge>;
      case 'repair':
        return <Badge variant="warning">Reparación</Badge>;
      case 'entry':
        return <Badge variant="info">Entrada</Badge>;
      case 'return':
        return <Badge variant="default">Devolución</Badge>;
      default:
        return <Badge>Otros</Badge>;
    }
  };
  
  return (
    <div>
      <PageTitle>Dashboard</PageTitle>
      
      {/* Tarjetas de estadísticas */}
      <DashboardGrid>
        <StatCard
          variant="primary"
          icon="box"
          value={statsData.totalAssets}
          label="Activos Totales"
        />
        
        <StatCard
          variant="success"
          icon="UserCheck"
          value={statsData.assignedAssets}
          label="Activos Asignados"
          trend="up"
          change="2.4%"
        />
        
        <StatCard
          variant="warning"
          icon="Tool"
          value={statsData.inRepair}
          label="En Reparación"
        />
        
        <StatCard
          variant="danger"
          icon="AlertTriangle"
          value={statsData.lowStock}
          label="Stock Bajo"
          trend="down"
          change="3 items"
        />
      </DashboardGrid>
      
      {/* Tarjetas principales */}
      <CardGrid>
        {/* Actividad reciente */}
        <Card 
          title="Actividad Reciente" 
          actions={
            <Button 
              variant="outline" 
              icon="RefreshCw" 
              iconPosition="left"
              onClick={() => {
                setLoading(prev => ({ ...prev, activity: true }));
                inventoryService.getAllMovements()
                  .then(response => {
                    const sortedMovements = response.data
                      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
                      .slice(0, 4);
                      
                    const formattedActivity = sortedMovements.map(movement => {
                      const activityType = movement.type === 'assignment' ? 'assignment' :
                                          movement.type === 'repair' ? 'repair' :
                                          movement.type === 'entry' ? 'entry' :
                                          movement.type === 'return' ? 'return' : 'other';
                      
                      const assetIcon = 
                        movement.product?.categoryPath?.includes('Computadoras') ? 'Package' :
                        movement.product?.categoryPath?.includes('Monitores') ? 'Monitor' :
                        movement.product?.categoryPath?.includes('Periféricos') && movement.product?.name?.toLowerCase().includes('teclado') ? 'Type' :
                        movement.product?.categoryPath?.includes('Celulares') ? 'Smartphone' : 'Box';
                      
                      return {
                        id: movement.id,
                        type: activityType,
                        assetName: movement.product?.name || 'Producto no especificado',
                        assetType: movement.product?.categoryPath?.split('/')?.pop() || 'Otros',
                        assetIcon: assetIcon,
                        assignedTo: movement.assignedTo?.name || '',
                        location: movement.destinationBranch || movement.destinationDepartment || '',
                        timestamp: movement.timestamp,
                        user: movement.user?.name || 'Sistema',
                        quantity: movement.quantity,
                        repairReason: movement.notes,
                        previousUser: movement.previousAssignee?.name || ''
                      };
                    });
                    
                    setRecentActivity(formattedActivity);
                    setError(prev => ({ ...prev, activity: null }));
                  })
                  .catch(err => {
                    console.error('Error refreshing activity:', err);
                    setError(prev => ({ ...prev, activity: 'Error al actualizar actividad reciente' }));
                  })
                  .finally(() => {
                    setLoading(prev => ({ ...prev, activity: false }));
                  });
              }}
            >
              Actualizar
            </Button>
          }
          loading={loading.activity}
          error={error.activity}
        >
          <TableContainer>
            <table>
              <thead>
                <tr>
                  <th>Actividad</th>
                  <th>Activo</th>
                  <th>Fecha</th>
                  <th>Usuario</th>
                </tr>
              </thead>
              <tbody>
                {recentActivity.map(activity => (
                  <tr key={activity.id}>
                    <td>
                      <BadgeContainer>
                        {getActivityBadge(activity.type)}
                      </BadgeContainer>
                    </td>
                    <td>
                      <InventoryItem>
                        <div className="item-icon">
                          <Icon name={activity.assetIcon} size={18} />
                        </div>
                        <div className="item-details">
                          <span className="item-name">{activity.assetName}</span>
                          <span className="item-category">{activity.assetType}</span>
                        </div>
                      </InventoryItem>
                    </td>
                    <td>{formatDate(activity.timestamp)}</td>
                    <td>{activity.user}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableContainer>
          
          <div style={{ textAlign: 'center', marginTop: 'var(--spacing-md)' }}>
            <Button variant="outline" as={Link} to="/reports">
              Ver Historial Completo
            </Button>
          </div>
        </Card>
        
        {/* Consumibles con stock bajo */}
        <Card 
          title="Consumibles con Stock Bajo" 
          actions={
            <Button 
              variant="outline" 
              icon="ExternalLink"
              as={Link}
              to="/inventory/low-stock"
            >
              Ver Todos
            </Button>
          }
          loading={loading.lowStock}
          error={error.lowStock}
        >
          <TableContainer>
            <table>
              <thead>
                <tr>
                  <th>Item</th>
                  <th>Categoría</th>
                  <th>Stock Actual</th>
                  <th>Mínimo</th>
                </tr>
              </thead>
              <tbody>
                {lowStockItems.map(item => (
                  <tr key={item.id}>
                    <td>
                      <span style={{ fontWeight: 600 }}>{item.name}</span>
                    </td>
                    <td>{item.category}</td>
                    <td>
                      <span style={{ 
                        color: item.currentStock === 0 ? 'var(--danger)' : 'var(--warning)',
                        fontWeight: 600
                      }}>
                        {item.currentStock}
                      </span>
                    </td>
                    <td>{item.minimumThreshold}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </TableContainer>
        </Card>
      </CardGrid>
      
      {/* Botones de acciones rápidas */}
      <Card title="Acciones Rápidas" style={{ marginTop: 'var(--spacing-lg)' }}>
        <div style={{ 
          display: 'flex', 
          gap: 'var(--spacing-md)', 
          flexWrap: 'wrap' 
        }} data-component-name="Dashboard">
          <Button 
            icon="PlusCircle" 
            variant="primary"
            onClick={() => navigate('/inventory/entry/new')}
          >
            Nueva Entrada
          </Button>
          
          <Button 
            icon="UserPlus" 
            variant="outline"
            onClick={() => navigate('/inventory/assign/new')}
          >
            Asignar Activo
          </Button>
          
          <Button 
            icon="tool" 
            variant="outline"
            onClick={() => navigate('/inventory/repair/new')}
          >
            Registrar Reparación
          </Button>
          
          <Button 
            icon="file-text" 
            variant="outline"
            onClick={() => navigate('/reports')}
          >
            Generar Reporte
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default Dashboard;
